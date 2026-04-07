---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "requirements"
document: "Business Requirements Document"
version: "1.0.0"
status: "draft"
author: "SDLC Agent"
source: "outputs/purely-cart-bugfix-PURELY-1/analyze/analyze-brief.md"
slug: "purely-cart-bugfix-PURELY-1"
---

# Business Requirements Document — Purely Cart Bug Fix

## 1. Purpose

This document captures the business requirements for fixing three bugs that degrade cart functionality across the Purely e-commerce platform. The bugs collectively prevent authenticated users from managing their cart, display invalid pricing, and show broken product images.

## 2. Scope

| Attribute | Value |
|---|---|
| Work Type | Bug Fix (Enhancement — Mode 3) |
| Jira Epic | PURELY-1 |
| Affected Areas | user-service config, frontend cart/checkout/products UI |
| Files Modified | 5 |
| Files Added/Deleted | 0 |

## 3. Business Requirements

### BRD-001: Restore Cart Functionality for Authenticated Users

**Priority**: Critical

Authenticated users must be able to perform all cart operations (add, view, update, remove items) without receiving 404 errors. The cart-service user validation step must succeed for any user who has registered and authenticated through the platform.

**Business Impact**: Cart operations are fully blocked for all authenticated users, preventing any purchases.

**Acceptance Criteria**:
- A user who registers and logs in via auth-service can immediately perform cart operations without errors.
- Cart API endpoints return 200/201 for valid authenticated requests, not 404.

---

### BRD-002: Display Accurate Numeric Values in Cart and Checkout UI

**Priority**: High

All monetary values displayed in the cart drawer and checkout page must show valid, correctly formatted numbers. Users must never see `NaN`, blank, or malformed price values for item amounts or subtotals.

**Business Impact**: NaN values erode user trust in the checkout flow and may cause cart abandonment.

**Acceptance Criteria**:
- Cart item amounts always display as valid currency values (e.g., `12.99`).
- Cart subtotal always displays as a valid currency value.
- When underlying data is missing or undefined, a safe default of `0.00` is shown rather than `NaN`.

---

### BRD-003: Ensure Reliable Product Image Display Across All Pages

**Priority**: Medium

Product images must render reliably in all views (product listing, cart drawer, checkout summary). When an external image URL is unavailable (404/403), a placeholder image must appear instead of a broken image icon.

**Business Impact**: Broken images degrade visual quality and professionalism of the storefront.

**Acceptance Criteria**:
- No broken image icons are visible to users under any circumstance.
- A recognizable placeholder image replaces any image that fails to load.
- The fallback mechanism does not trigger infinite reload loops.

## 4. Constraints

| ID | Constraint |
|---|---|
| C-1 | No architecture changes — fixes must work within existing microservice topology |
| C-2 | MongoDB per-service isolation pattern preserved in production; local dev can share databases |
| C-3 | No external dependency additions — use existing React, Axios, Spring Boot capabilities |
| C-4 | Minimal frontend disruption — component APIs must not change |
| C-5 | Local development context — fixes must work on localhost with Eureka + gateway setup |

## 5. Assumptions

| ID | Assumption | Label |
|---|---|---|
| A-1 | user-service is intended to share user data with auth-service — same database is correct for local dev | Inferred - needs confirmation |
| A-2 | Product imageUrl values may contain stale or unavailable external URLs | Assumed - carries risk |
| A-3 | Frontend cart state model can be safely extended with default numeric values without breaking other consumers | Inferred - needs confirmation |

## 6. Dependencies

| DEP ID | From | To | Type | Direction | Impact |
|---|---|---|---|---|---|
| DEP-001 | auth-service | user-service | Data (shared MongoDB) | Inbound | BUG-1 fix requires user-service to read from auth-service database |
| DEP-002 | cart-service | user-service | Service (Feign client) | Outbound | Cart operations depend on user-service returning valid user existence checks |
| DEP-003 | cart.service.jsx | cart.jsx | Data (state shape) | Outbound | Cart component relies on state object shape including numeric fields |
| DEP-004 | cart.service.jsx | checkout.jsx | Data (state shape) | Outbound | Checkout page relies on state object shape including numeric fields |

## 7. Success Metrics

| Metric | Target |
|---|---|
| Cart API 404 rate for authenticated users | 0% (down from 100%) |
| NaN occurrences in cart/checkout UI | 0 |
| Broken image icons in product/cart/checkout views | 0 |
| Regression in existing cart functionality | None |
