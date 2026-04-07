---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "architecture"
document: "Architecture Decision Records"
version: "1.0.0"
status: "draft"
---

# Architecture Decision Records — Purely Cart Bug Fix

## Overview

All ADRs in this document are scoped to the enhancement (bug fix) only. Existing architectural decisions from the Purely platform (microservice topology, Spring Cloud stack, React SPA, MongoDB per-service pattern) are settled and not revisited.

---

## ADR-001: Share MongoDB Database Between auth-service and user-service for Local Development

**Status**: Accepted

**Date**: 2026-04-06

**Links**: BRD-001, FRD-001, TR-001, NFR-003, NFR-006, US-001 (PURELY-16)

### Context

`auth-service` writes user records to the `purely_auth_service` MongoDB database during registration. `user-service` is configured to read from a separate `purely_user_service` database, which is empty. This causes `cart-service` to receive `false` from `user-service.existsUserById()` for all valid users, resulting in 404 errors on all cart operations.

The Purely platform follows a per-service database isolation pattern. In production, this could be supported by an event-driven sync mechanism or shared-read replica, but no such mechanism exists in the codebase today.

### Decision

Point `user-service` at the same MongoDB database (`purely_auth_service`) used by `auth-service` by changing the `spring.data.mongodb.uri` in `user-service/src/main/resources/application.yml`.

### Alternatives Considered

| Alternative | Reason Rejected |
|---|---|
| **Add Feign call from cart-service directly to auth-service** | Violates existing service boundaries — `user-service` is the designated owner of user-read operations. Adds cross-cutting coupling. |
| **Implement event-driven sync between auth-service and user-service databases** | Over-engineered for a bug fix; introduces new infrastructure (message broker) and violates constraint C-3 (no new dependencies). |
| **Merge user-service into auth-service** | Major architectural change, violates constraint C-1 (no architecture changes). Affects Helm charts, Dockerfiles, gateway routes, and Feign clients. |
| **Seed user-service database from auth-service on startup** | Fragile; requires a startup script, violates C-3, and creates a sync window where users don't exist. |

### Consequences

**Positive**:
- Single-line configuration change — minimal risk
- Requires only a `user-service` restart (NFR-006)
- No code changes, no new dependencies (NFR-003)
- Immediate resolution of all cart 404 errors

**Negative**:
- In local development, both services share a database — this may mask issues if schemas diverge in the future
- In production, a proper sync mechanism or shared-read pattern should be considered (out of scope for this bug fix)

**Mitigations**:
- Both services use an identical `User` `@Document` model — schema divergence risk is low
- A follow-up story can introduce event-driven sync if production requires separate databases

---

## ADR-002: Inline Safe Numeric Formatting vs Shared Utility Module

**Status**: Accepted

**Date**: 2026-04-06

**Links**: BRD-002, FRD-003, FRD-004, NFR-001, NFR-004, US-003 (PURELY-18), US-004 (PURELY-19)

### Context

`parseFloat()` is called on potentially `undefined` or `null` values in `cart.jsx` and `checkout.jsx`, producing `NaN` in the UI. The fix requires a safe formatting approach that defaults to `"0.00"` for invalid inputs.

Two approaches were evaluated: (a) extract a shared utility function, or (b) apply inline guards at each call site.

### Decision

Apply inline safe numeric formatting at each `parseFloat().toFixed(2)` call site within `cart.jsx` and `checkout.jsx`. The pattern is:

```javascript
(parseFloat(value) || 0).toFixed(2)
```

This replaces each existing `parseFloat(value).toFixed(2)` call with a guarded version.

### Alternatives Considered

| Alternative | Reason Rejected |
|---|---|
| **Create a shared `formatCurrency()` utility in a new file** | Violates constraint C-4 (minimal disruption) and C-3 (no new files or modules beyond what's needed). The formatting logic is a one-liner — extracting it adds abstraction overhead for 4–6 call sites across 2 files. |
| **Use a third-party formatting library (e.g., numeral.js, Intl.NumberFormat wrapper)** | Violates NFR-003 (no new dependencies). `Intl.NumberFormat` is available natively but would require more refactoring of the render logic than the minimal inline fix. |
| **Add TypeScript for type safety** | The project is JavaScript (JSX) — introducing TypeScript is a major structural change, violating C-1 and C-3. |

### Consequences

**Positive**:
- Zero new files, zero new imports — minimal change footprint
- Each call site is self-documenting: the `|| 0` guard is immediately visible
- Component APIs remain unchanged (NFR-004)
- Defensive layer 2 — even if the state hook returns unexpected shapes, rendering is safe

**Negative**:
- The same `(parseFloat(x) || 0).toFixed(2)` pattern is repeated across components — mild DRY violation
- If additional formatting requirements arise (e.g., locale-aware currency), a utility extraction would then be warranted

**Mitigations**:
- The pattern is used in only 2 files (4–6 call sites total) — duplication is minimal
- A future enhancement can extract a utility if the pattern spreads to more components

---

## ADR-003: Image Fallback Strategy — onError Handler vs Wrapper Component

**Status**: Accepted

**Date**: 2026-04-06

**Links**: BRD-003, FRD-005, FRD-006, FRD-007, NFR-002, NFR-005, US-005 (PURELY-20), US-006 (PURELY-21), US-007 (PURELY-22)

### Context

Product images reference external URLs that may be unavailable (404/403). Three components render product images: `cart.jsx`, `checkout.jsx`, and `products.jsx`. The fix needs to replace broken images with a local placeholder without infinite reload loops.

Two approaches were evaluated: (a) add an `onError` handler directly to each `<img>` element, or (b) create a reusable `<SafeImage>` wrapper component.

### Decision

Add an inline `onError` handler to each `<img>` element in the three affected components. The handler sets `e.target.src` to a local placeholder, with a guard to prevent infinite loops:

```jsx
onError={(e) => {
  if (e.target.src !== PLACEHOLDER_IMAGE) {
    e.target.src = PLACEHOLDER_IMAGE;
  }
}}
```

### Alternatives Considered

| Alternative | Reason Rejected |
|---|---|
| **Create a `<SafeImage>` wrapper component** | Adds a new component file, changes import structures in 3 files, and replaces `<img>` elements — violates C-4 (minimal disruption) and increases the change surface. Appropriate for new projects but over-engineered for a 3-file bug fix. |
| **Use CSS `background-image` with fallback** | Requires restructuring the existing `<img>` elements as `<div>` backgrounds, changing CSS classes, and potentially breaking existing layout styles. |
| **Use a service worker to intercept failed image requests** | Major infrastructure addition, violates C-3. |
| **Pre-validate image URLs on the backend** | Adds latency to product/cart API responses and requires backend code changes — violates C-1. |

### Consequences

**Positive**:
- Uses React's native `onError` prop — no custom abstractions
- Loop prevention guard satisfies NFR-005
- Zero new files or dependencies (NFR-003)
- Minimal change per file — add one prop to existing `<img>` elements
- Placeholder is a local asset — no external loading dependency

**Negative**:
- The `onError` handler pattern is repeated across 3 components — mild DRY violation
- If the placeholder image path changes, 3 files need updating

**Mitigations**:
- A `PLACEHOLDER_IMAGE` constant can be defined at the top of each file, or in a shared constants file if the pattern grows
- The placeholder path is a stable local asset path unlikely to change frequently

---

## ADR Summary Table

| ADR | Decision | Scope | Stories |
|---|---|---|---|
| ADR-001 | Share MongoDB between auth-service and user-service | Backend config | PURELY-16 |
| ADR-002 | Inline safe numeric formatting at call sites | Frontend rendering | PURELY-17, PURELY-18, PURELY-19 |
| ADR-003 | Inline onError handler on `<img>` elements | Frontend rendering | PURELY-20, PURELY-21, PURELY-22 |
