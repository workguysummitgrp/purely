---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "requirements"
document: "Functional Requirements Document"
version: "1.0.0"
status: "draft"
author: "SDLC Agent"
source: "outputs/purely-cart-bugfix-PURELY-1/requirements/brd.md"
slug: "purely-cart-bugfix-PURELY-1"
---

# Functional Requirements Document — Purely Cart Bug Fix

## 1. Overview

This document defines the functional requirements to resolve three bugs affecting cart functionality in the Purely e-commerce platform. Each requirement maps to one or more business requirements defined in the BRD.

## 2. Functional Requirements

### FRD-001: Align user-service MongoDB Database with auth-service

**Links**: BRD-001, DEP-001

**Description**: Modify the `user-service` MongoDB connection URI in `application.yml` to point to the same database used by `auth-service` (`purely_auth_service`), so that user existence checks resolve against the same data store where users are registered.

**Current Behavior**: `user-service` connects to `purely_user_service`; `auth-service` writes to `purely_auth_service`. User validation via Feign returns `false` for valid users.

**Expected Behavior**: `user-service` connects to `purely_auth_service`. `existsUserById()` returns `true` for any user who registered through `auth-service`.

**Affected File**: `microservice-backend/user-service/src/main/resources/application.yml`

**Verification**: After restart, `GET /user/exists/byId/{userId}` returns `true` for users created via auth-service registration.

---

### FRD-002: Initialize Cart State with Default Numeric Values

**Links**: BRD-002, DEP-003, DEP-004

**Description**: Update the cart service hook (`cart.service.jsx`) to initialize cart state with a well-defined object shape that includes `subtotal: 0`, `cartItems: []`, and other expected fields. Ensure the error fallback also includes `subtotal: 0`.

**Current Behavior**: Initial state is `useState({})`. Error fallback sets `{cartItems: []}` without `subtotal`.

**Expected Behavior**: Initial state is `{ cartItems: [], subtotal: 0 }`. Error fallback also includes `subtotal: 0`.

**Affected File**: `frontend/src/api-service/cart.service.jsx`

---

### FRD-003: Apply Safe Numeric Formatting to Cart Item Amounts

**Links**: BRD-002

**Description**: Replace all direct `parseFloat(cartItem.amount).toFixed(2)` calls in cart and checkout components with a safe formatting approach that returns `"0.00"` when the value is `undefined`, `null`, or `NaN`.

**Current Behavior**: `parseFloat(undefined)` returns `NaN`; `.toFixed(2)` on `NaN` produces `"NaN"`.

**Expected Behavior**: Undefined/null/NaN amounts display as `"0.00"`.

**Affected Files**: `frontend/src/components/cart/cart.jsx`, `frontend/src/pages/checkout/checkout.jsx`

---

### FRD-004: Apply Safe Numeric Formatting to Cart Subtotal

**Links**: BRD-002

**Description**: Replace all direct `parseFloat(cart.subtotal).toFixed(2)` calls with a safe formatting approach that returns `"0.00"` when `subtotal` is `undefined`, `null`, or `NaN`.

**Current Behavior**: `parseFloat(undefined)` returns `NaN` for subtotal display.

**Expected Behavior**: Undefined/null/NaN subtotals display as `"0.00"`.

**Affected Files**: `frontend/src/components/cart/cart.jsx`, `frontend/src/pages/checkout/checkout.jsx`

---

### FRD-005: Add Image Fallback Handler to Cart Component

**Links**: BRD-003

**Description**: Add an `onError` event handler to all `<img>` elements in the cart component that sets the image source to a local placeholder when the original URL fails to load. Include a guard to prevent infinite fallback loops.

**Current Behavior**: Broken external URLs result in browser broken-image icons.

**Expected Behavior**: Failed images are replaced with a placeholder. No infinite reload loops.

**Affected File**: `frontend/src/components/cart/cart.jsx`

---

### FRD-006: Add Image Fallback Handler to Checkout Page

**Links**: BRD-003

**Description**: Add an `onError` event handler to all `<img>` elements in the checkout page that sets the image source to a local placeholder when the original URL fails to load.

**Current Behavior**: Broken external URLs result in browser broken-image icons.

**Expected Behavior**: Failed images are replaced with a placeholder.

**Affected File**: `frontend/src/pages/checkout/checkout.jsx`

---

### FRD-007: Add Image Fallback Handler to Products Page

**Links**: BRD-003

**Description**: Add an `onError` event handler to all `<img>` elements in the products page that sets the image source to a local placeholder when the original URL fails to load.

**Current Behavior**: Broken external URLs result in browser broken-image icons.

**Expected Behavior**: Failed images are replaced with a placeholder.

**Affected File**: `frontend/src/pages/products/products.jsx`

## 3. Technical Requirements

### TR-001: MongoDB Connection String Configuration Change

**Links**: FRD-001, NFR-003

Only the `spring.data.mongodb.uri` value in `user-service/application.yml` is modified. No application code, model, or repository changes are required. Both `auth-service` and `user-service` share the same `User` document model.

### TR-002: React onError Event Handler Pattern for Image Elements

**Links**: FRD-005, FRD-006, FRD-007, NFR-002

Use the native React `onError` prop on `<img>` elements. Set `e.target.src` to the placeholder path. Guard against infinite loops by checking whether `src` already equals the placeholder before reassigning.
