---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "requirements"
document: "Non-Functional Requirements"
version: "1.0.0"
status: "draft"
author: "SDLC Agent"
source: "outputs/purely-cart-bugfix-PURELY-1/requirements/brd.md"
slug: "purely-cart-bugfix-PURELY-1"
---

# Non-Functional Requirements — Purely Cart Bug Fix

## 1. Overview

Non-functional requirements governing the quality attributes of the three bug fixes. All NFRs are scoped to the affected files and must not introduce regressions.

## 2. Non-Functional Requirements

### NFR-001: Zero NaN Values in UI

**Links**: BRD-002, FRD-003, FRD-004

**Category**: Correctness / Data Integrity

All numeric values rendered in cart and checkout views must be valid JavaScript numbers formatted to two decimal places. No `NaN`, `undefined`, `null`, or empty strings may appear in price-related display elements.

**Measure**: Manual and automated UI inspection yields zero instances of `NaN` or invalid numeric display across cart drawer and checkout page.

---

### NFR-002: No Broken Image Icons Visible to Users

**Links**: BRD-003, FRD-005, FRD-006, FRD-007

**Category**: Usability / Visual Integrity

No browser broken-image icons may be visible in product listing, cart drawer, or checkout summary. All failed image loads must be caught and replaced with a valid placeholder within the same render cycle.

**Measure**: With external image URLs returning 404/403, all `<img>` elements display the placeholder image. Zero broken image icons on screen.

---

### NFR-003: No New External Dependencies Introduced

**Links**: BRD-001, BRD-002, BRD-003, FRD-001

**Category**: Maintainability

No new npm packages, Maven dependencies, or external libraries may be added. All fixes must use existing capabilities of React 18, Axios, Spring Boot, and Spring Cloud.

**Measure**: `package.json` and all `pom.xml` files remain unchanged in dependency sections.

---

### NFR-004: Component API Backward Compatibility

**Links**: BRD-002, FRD-002, FRD-003, FRD-004

**Category**: Compatibility

Cart and checkout component props and public interfaces must remain unchanged. The fixes are additive (guards, defaults, fallbacks) and must not alter how parent components invoke child components.

**Measure**: No component call-site changes required outside the modified files. Existing integration points continue to function without modification.

---

### NFR-005: No Infinite Image Reload Loops

**Links**: BRD-003, FRD-005, FRD-006, FRD-007, TR-002

**Category**: Reliability

The image fallback mechanism must include a guard to prevent infinite `onError` → `src` reassignment loops. If the placeholder itself fails to load, the handler must not re-trigger.

**Measure**: With a deliberately missing placeholder path, the `onError` handler fires at most once per image element without causing repeated network requests.

---

### NFR-006: Restart-Only Backend Deployment

**Links**: BRD-001, FRD-001, TR-001

**Category**: Operability

The BUG-1 fix requires only a `user-service` restart to take effect. No database migrations, schema changes, seed scripts, or multi-service restarts are needed.

**Measure**: After modifying `application.yml` and restarting `user-service`, cart API calls succeed. No other services require restart.
