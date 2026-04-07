---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "requirements"
document: "User Stories"
version: "1.0.0"
status: "draft"
author: "SDLC Agent"
source: "outputs/purely-cart-bugfix-PURELY-1/requirements/frd.md"
slug: "purely-cart-bugfix-PURELY-1"
---

# User Stories — Purely Cart Bug Fix

## 1. Overview

User stories derived from the functional requirements. Each story includes acceptance criteria in Given/When/Then format and a proposed story point estimate on the Fibonacci scale.

## 2. Stories

---

### US-001: Fix user-service MongoDB URI to Resolve Cart 404s

**Links**: FRD-001

**As a** registered user,
**I want** the cart service to recognise my account when I perform cart operations,
**So that** I can add, view, and manage items in my cart without receiving 404 errors.

**Acceptance Criteria**:

```gherkin
Given a user registered and authenticated via auth-service
When the user calls any cart API endpoint (add/get/update/delete)
Then cart-service validates the user via user-service successfully
And the cart operation completes with a 200 or 201 status code

Given user-service application.yml has been modified
When user-service starts up
Then it connects to the purely_auth_service MongoDB database
And existsUserById returns true for users created via auth-service
```

**Story Points (proposed):** 1

---

### US-002: Initialize Cart State with Safe Defaults

**Links**: FRD-002

**As a** user viewing my cart,
**I want** the cart UI to initialise with valid default values,
**So that** I never see NaN or undefined values before cart data loads.

**Acceptance Criteria**:

```gherkin
Given the cart page or cart drawer is rendered for the first time
When the cart data has not yet loaded from the API
Then the cart state contains subtotal of 0 and an empty cartItems array
And no NaN values appear in the UI

Given the cart API call fails with an error
When the error handler sets the fallback cart state
Then the fallback state includes subtotal of 0 and an empty cartItems array
```

**Story Points (proposed):** 1

---

### US-003: Apply Safe Numeric Formatting in Cart Component

**Links**: FRD-003, FRD-004

**As a** user viewing the cart drawer,
**I want** all prices and subtotals to display as valid currency values,
**So that** I can trust the amounts shown before proceeding to checkout.

**Acceptance Criteria**:

```gherkin
Given a cart item with a valid amount value (e.g., 12.99)
When the cart drawer renders the item
Then the amount displays as "12.99"

Given a cart item with an undefined or null amount value
When the cart drawer renders the item
Then the amount displays as "0.00" instead of "NaN"

Given the cart subtotal is undefined or null
When the cart drawer renders the subtotal
Then the subtotal displays as "0.00" instead of "NaN"
```

**Story Points (proposed):** 2

---

### US-004: Apply Safe Numeric Formatting in Checkout Page

**Links**: FRD-003, FRD-004

**As a** user on the checkout page,
**I want** all item prices and the order subtotal to display correctly,
**So that** I can review my order with confidence before submitting.

**Acceptance Criteria**:

```gherkin
Given a cart item with a valid amount value
When the checkout page renders the order summary
Then the amount displays correctly (e.g., "24.50")

Given a cart item with an undefined or null amount value
When the checkout page renders the order summary
Then the amount displays as "0.00" instead of "NaN"

Given the cart subtotal is undefined or null
When the checkout page renders the subtotal
Then the subtotal displays as "0.00" instead of "NaN"
```

**Story Points (proposed):** 2

---

### US-005: Add Image Fallback in Cart Component

**Links**: FRD-005

**As a** user viewing the cart drawer,
**I want** product images to display a placeholder when the original image URL is broken,
**So that** I do not see broken image icons in my cart.

**Acceptance Criteria**:

```gherkin
Given a cart item whose imageUrl returns a 404 or 403
When the cart drawer renders the item
Then a placeholder image is displayed instead of a broken image icon

Given a cart item whose imageUrl loads successfully
When the cart drawer renders the item
Then the original image displays as expected

Given the placeholder image itself fails to load
When the onError handler fires
Then the handler does not re-trigger (no infinite loop)
```

**Story Points (proposed):** 2

---

### US-006: Add Image Fallback in Checkout Page

**Links**: FRD-006

**As a** user on the checkout page,
**I want** product images in the order summary to fall back to a placeholder when broken,
**So that** the checkout experience is visually clean.

**Acceptance Criteria**:

```gherkin
Given an order summary item whose imageUrl returns a 404 or 403
When the checkout page renders the item
Then a placeholder image is displayed instead of a broken image icon

Given the onError handler fires on an image
When the image src is already the placeholder
Then the handler does not re-assign src (no infinite loop)
```

**Story Points (proposed):** 1

---

### US-007: Add Image Fallback in Products Page

**Links**: FRD-007

**As a** user browsing the product catalogue,
**I want** product images to show a placeholder when the image URL is unavailable,
**So that** the product listing looks complete and professional.

**Acceptance Criteria**:

```gherkin
Given a product whose imageUrl returns a 404 or 403
When the products page renders the product card
Then a placeholder image is displayed instead of a broken image icon

Given the onError handler fires on an image
When the image src is already the placeholder
Then the handler does not re-assign src (no infinite loop)
```

**Story Points (proposed):** 1

---

## 3. Story Point Summary

| Story | Points | Bug |
|---|---|---|
| US-001 | 1 | BUG-1 |
| US-002 | 1 | BUG-2 |
| US-003 | 2 | BUG-2 |
| US-004 | 2 | BUG-2 |
| US-005 | 2 | BUG-3 |
| US-006 | 1 | BUG-3 |
| US-007 | 1 | BUG-3 |
| **Total** | **10** | |
