---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "architecture"
document: "NFR Mapping"
version: "1.0.0"
status: "draft"
---

# NFR Mapping — Purely Cart Bug Fix

## 1. Overview

This document maps each Non-Functional Requirement (NFR-001 through NFR-006) to the architectural decisions and components that address it, and defines the verification approach for each.

All NFRs are scoped to the enhancement (bug fix). Existing platform NFRs (overall performance, scalability, security posture) are preserved and not re-evaluated.

---

## 2. NFR-to-Architecture Mapping

### NFR-001: Zero NaN Values in UI

| Attribute | Value |
|---|---|
| **Category** | Correctness / Data Integrity |
| **Links** | BRD-002, FRD-003, FRD-004 |
| **Stories** | PURELY-17 (US-002), PURELY-18 (US-003), PURELY-19 (US-004) |
| **ADR** | ADR-002 |

#### Architectural Component

**Dual-layer defense in the frontend state management architecture:**

| Layer | Component | Mechanism |
|---|---|---|
| Layer 1 — State initialization | `cart.service.jsx` | Default state includes `subtotal: 0`, `cartItems: []`; error fallback includes all required numeric fields |
| Layer 2 — Render guards | `cart.jsx`, `checkout.jsx` | Inline `(parseFloat(value) \|\| 0).toFixed(2)` at every numeric render site |

#### How the Fix Satisfies NFR-001

- Layer 1 ensures the state object always contains valid numeric defaults before any render occurs
- Layer 2 catches any residual `undefined`/`null`/`NaN` values at the point of display
- Together, both layers guarantee that no `NaN` string is ever rendered to the DOM

#### Verification Approach

1. **Manual test**: Load the cart drawer and checkout page with an empty cart, a populated cart, and after an API error — verify all numeric fields show valid values
2. **Automated test**: Unit test the safe formatting expression with inputs: `undefined`, `null`, `NaN`, `0`, `12.99`, `"abc"`
3. **Visual regression**: Screenshot comparison of cart/checkout before and after fix

---

### NFR-002: No Broken Image Icons Visible to Users

| Attribute | Value |
|---|---|
| **Category** | Usability / Visual Integrity |
| **Links** | BRD-003, FRD-005, FRD-006, FRD-007 |
| **Stories** | PURELY-20 (US-005), PURELY-21 (US-006), PURELY-22 (US-007) |
| **ADR** | ADR-003 |

#### Architectural Component

**Inline `onError` handler on `<img>` elements** in three components:

| Component | File | Image Context |
|---|---|---|
| Cart drawer | `frontend/src/components/cart/cart.jsx` | Cart item product images |
| Checkout page | `frontend/src/pages/checkout/checkout.jsx` | Order summary product images |
| Products page | `frontend/src/pages/products/products.jsx` | Product listing card images |

#### How the Fix Satisfies NFR-002

- Every `<img>` element that renders product images includes an `onError` prop
- When the browser fires an error event (404, 403, network failure), the handler replaces `src` with a local placeholder image
- The placeholder is a local asset served by the same origin — no external dependency

#### Verification Approach

1. **Manual test**: Temporarily set product `imageUrl` values to invalid URLs — verify placeholder appears in all three views
2. **Network simulation**: Use browser DevTools to block image requests — verify placeholder renders
3. **Automated test**: Unit test the `onError` handler logic in isolation

---

### NFR-003: No New External Dependencies Introduced

| Attribute | Value |
|---|---|
| **Category** | Maintainability |
| **Links** | BRD-001, BRD-002, BRD-003, FRD-001 |
| **Stories** | All (PURELY-16 through PURELY-22) |
| **ADR** | ADR-001, ADR-002, ADR-003 |

#### Architectural Component

**All three ADRs explicitly chose existing-technology approaches:**

| ADR | Existing Technology Used | Alternative Rejected |
|---|---|---|
| ADR-001 | Spring Data MongoDB config (`application.yml`) | Event bus, Feign rerouting |
| ADR-002 | JavaScript `parseFloat`, `toFixed`, `\|\|` operator | numeral.js, Zod, TypeScript |
| ADR-003 | React `onError` prop (built-in synthetic event) | react-image, react-image-fallback |

#### How the Fix Satisfies NFR-003

- `package.json` `dependencies` and `devDependencies` sections remain unchanged
- All `pom.xml` `<dependencies>` sections remain unchanged
- Every fix exclusively uses APIs already present in the project's runtime

#### Verification Approach

1. **Diff check**: `git diff -- '**/pom.xml' '**/package.json'` shows zero dependency changes
2. **Build verification**: `mvn dependency:tree` and `npm ls` produce identical output before and after

---

### NFR-004: Component API Backward Compatibility

| Attribute | Value |
|---|---|
| **Category** | Compatibility |
| **Links** | BRD-002, FRD-002, FRD-003, FRD-004 |
| **Stories** | PURELY-17 (US-002), PURELY-18 (US-003), PURELY-19 (US-004) |
| **ADR** | ADR-002 |

#### Architectural Component

**Internal-only changes within component render logic and hook state:**

| Change Type | Scope | External API Impact |
|---|---|---|
| State initialization in `cart.service.jsx` | Internal hook state shape | None — consumers receive the same state object with additional default fields |
| Inline `parseFloat` guards in `cart.jsx` | Internal render expression | None — component props unchanged |
| Inline `parseFloat` guards in `checkout.jsx` | Internal render expression | None — component props unchanged |

#### How the Fix Satisfies NFR-004

- No component function signatures change
- No props are added, removed, or renamed
- No context provider APIs change
- The cart state object gains default values but no fields are removed — backward compatible
- All parent component call sites remain valid without modification

#### Verification Approach

1. **Static analysis**: Search for all import/usage sites of modified components — confirm zero call-site changes needed
2. **Integration test**: Load the full application and navigate through cart → checkout flow — verify no runtime errors from component API mismatches

---

### NFR-005: No Infinite Image Reload Loops

| Attribute | Value |
|---|---|
| **Category** | Reliability |
| **Links** | BRD-003, FRD-005, FRD-006, FRD-007, TR-002 |
| **Stories** | PURELY-20 (US-005), PURELY-21 (US-006), PURELY-22 (US-007) |
| **ADR** | ADR-003 |

#### Architectural Component

**Guard clause in the `onError` handler:**

```jsx
onError={(e) => {
  if (e.target.src !== PLACEHOLDER_IMAGE) {
    e.target.src = PLACEHOLDER_IMAGE;
  }
}}
```

The conditional check prevents the handler from reassigning `src` if it already equals the placeholder, breaking the potential `onError → src change → onError` infinite loop.

#### How the Fix Satisfies NFR-005

- If the original URL fails → handler sets placeholder → no further error (placeholder is local and valid)
- If the placeholder itself fails (e.g., missing asset) → handler detects `src === PLACEHOLDER_IMAGE` → no-op → loop broken
- Maximum `onError` invocations: 1 per image element (original URL failure)

#### Verification Approach

1. **Edge case test**: Set `PLACEHOLDER_IMAGE` to a deliberately non-existent path → verify `onError` fires exactly once (no repeated network requests)
2. **Browser DevTools**: Monitor Network tab for repeated image requests from the same `<img>` element
3. **Unit test**: Simulate `onError` event with `e.target.src` already set to placeholder — verify handler does not reassign

---

### NFR-006: Restart-Only Backend Deployment

| Attribute | Value |
|---|---|
| **Category** | Operability |
| **Links** | BRD-001, FRD-001, TR-001 |
| **Stories** | PURELY-16 (US-001) |
| **ADR** | ADR-001 |

#### Architectural Component

**Configuration-only change in `user-service/application.yml`:**

| Aspect | Value |
|---|---|
| Change type | YAML property value change |
| Property | `spring.data.mongodb.uri` |
| Old value | `mongodb://localhost:27017/purely_user_service` |
| New value | `mongodb://localhost:27017/purely_auth_service` |
| Restart scope | `user-service` only |
| Other services affected | None |

#### How the Fix Satisfies NFR-006

- Spring Boot reads `application.yml` at startup — the new URI takes effect immediately upon restart
- No database migration scripts needed — `user-service` reads an existing database with a compatible schema
- No schema changes — the `User` document model is identical in both services
- No other services need restarting — Eureka re-discovers `user-service` automatically after it comes back up

#### Verification Approach

1. **Restart test**: Stop `user-service`, apply config change, restart → verify Eureka registration and cart API success
2. **Isolation test**: Confirm `auth-service`, `cart-service`, `product-service`, and other services remain unaffected (no restart, no errors)
3. **Timing test**: Measure time from `user-service` restart to first successful cart operation — should be within Eureka heartbeat interval (~30s)

---

## 3. NFR Coverage Summary

| NFR ID | Category | Bug(s) | ADR | Satisfied | Verification |
|---|---|---|---|---|---|
| NFR-001 | Correctness | BUG-2 | ADR-002 | Yes — dual-layer numeric defense | Manual + unit test |
| NFR-002 | Usability | BUG-3 | ADR-003 | Yes — onError + placeholder | Manual + network simulation |
| NFR-003 | Maintainability | All | ADR-001, ADR-002, ADR-003 | Yes — zero dependency changes | Diff check + build verify |
| NFR-004 | Compatibility | BUG-2 | ADR-002 | Yes — internal-only changes | Static analysis + integration test |
| NFR-005 | Reliability | BUG-3 | ADR-003 | Yes — guard clause prevents loop | Edge case test + DevTools |
| NFR-006 | Operability | BUG-1 | ADR-001 | Yes — config-only, single restart | Restart test + isolation test |
