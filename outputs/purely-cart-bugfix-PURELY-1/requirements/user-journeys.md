---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "requirements"
document: "User Journeys"
version: "1.0.0"
status: "draft"
author: "SDLC Agent"
source: "outputs/purely-cart-bugfix-PURELY-1/requirements/brd.md"
slug: "purely-cart-bugfix-PURELY-1"
---

# User Journeys — Purely Cart Bug Fix

## 1. Overview

User journeys describing end-to-end scenarios affected by the three cart bugs and their expected behavior after fixes are applied.

## 2. Journeys

### UJ-001: Authenticated User Adds Items to Cart

**Links**: BRD-001 | Stories: US-001, US-002

**Persona**: Registered customer

**Preconditions**:
- User has registered via the auth-service signup flow.
- User is logged in with a valid JWT token.
- At least one product exists in the catalogue.

**Journey Steps**:

| Step | Action | Expected Result |
|---|---|---|
| 1 | User logs in via the login page | JWT token issued, user redirected to home |
| 2 | User browses products and clicks "Add to Cart" | Cart API call succeeds (201). Cart drawer shows the item. |
| 3 | User opens cart drawer | Cart items displayed with valid quantities and amounts |
| 4 | User modifies item quantity | Cart API update succeeds (200). Updated totals displayed. |
| 5 | User removes an item | Cart API delete succeeds (200). Item removed from view. |

**Post-Bug-Fix Outcome**: Steps 2-5 no longer return 404 errors because user-service validates the user against the correct database.

---

### UJ-002: User Views Cart with Accurate Pricing

**Links**: BRD-002 | Stories: US-003

**Persona**: Registered customer

**Preconditions**:
- User is logged in and has items in cart.

**Journey Steps**:

| Step | Action | Expected Result |
|---|---|---|
| 1 | User opens the cart drawer | Cart items load with amounts displayed (e.g., `$12.99`) |
| 2 | User views subtotal at bottom of cart drawer | Subtotal displays as valid currency (e.g., `$45.97`) |
| 3 | Cart has items with missing amount data | Amounts display as `$0.00` instead of `NaN` |

**Post-Bug-Fix Outcome**: No `NaN` values appear regardless of backend data completeness.

---

### UJ-003: User Completes Checkout with Correct Totals

**Links**: BRD-002 | Stories: US-004

**Persona**: Registered customer

**Preconditions**:
- User is logged in and has items in cart.
- User navigates to checkout page.

**Journey Steps**:

| Step | Action | Expected Result |
|---|---|---|
| 1 | User navigates to checkout page | Order summary loads with item details and amounts |
| 2 | User reviews item prices in order summary | All amounts display as valid currency values |
| 3 | User reviews subtotal | Subtotal displays as valid currency value |
| 4 | User submits order | Order placed successfully with correct totals |

**Post-Bug-Fix Outcome**: Checkout page never shows `NaN` for prices or subtotals.

---

### UJ-004: User Browses Products with Reliable Images

**Links**: BRD-003 | Stories: US-005, US-006, US-007

**Persona**: Any visitor (logged in or guest)

**Preconditions**:
- Products exist with external `imageUrl` values.
- Some external image URLs may be unavailable (404/403).

**Journey Steps**:

| Step | Action | Expected Result |
|---|---|---|
| 1 | User browses the products page | Product cards display images; broken URLs show placeholder |
| 2 | User adds a product to cart and opens cart drawer | Cart item images display; broken URLs show placeholder |
| 3 | User navigates to checkout | Order summary images display; broken URLs show placeholder |

**Post-Bug-Fix Outcome**: No broken image icons appear anywhere. Placeholder images substitute seamlessly for failed URLs.
