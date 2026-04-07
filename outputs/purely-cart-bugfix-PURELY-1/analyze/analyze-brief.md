---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "Analyze"
---

# Analyze Brief — Purely Cart Bug Fix

## Project Overview

| Field | Value |
|---|---|
| Project Type | Existing (Bug Fix) |
| Mode | Enhancement — Mode 3 |
| Work Type | Bug |
| Intake | Workspace (local code + GitHub: workguysummitgrp/purely) |
| Main Story | PURELY-1 |
| Jira Project | PURELY |

## Problem-Space Summary

Three interconnected bugs are degrading cart functionality and user experience across the Purely e-commerce platform. The issues span from backend microservice data inconsistency (user validation across split MongoDB databases) to frontend rendering defects (NaN values in cart totals and broken external images). Together, these bugs prevent authenticated users from reliably managing their cart, see invalid pricing on checkout, and encounter broken product images.

## Bug Analysis

### Bug 1: User Validation Failure — Cart API 404

**Root Cause**: The `auth-service` and `user-service` connect to different MongoDB databases. `auth-service` writes user records to `purely_auth_service` while `user-service` reads from `purely_user_service`. When `cart-service` calls `user-service` to validate a user via the Feign client (`/user/exists/byId`), the user is not found because their record only exists in the `auth-service` database.

**Data Flow**:
1. User registers/authenticates via `auth-service` → user stored in `purely_auth_service` MongoDB database
2. JWT token issued containing the user ID from `purely_auth_service`
3. User calls cart API → `cart-service` extracts user ID from JWT via `Authentication.getPrincipal()`
4. `cart-service` calls `user-service.existsUserById(userId)` via Feign
5. `user-service` checks `purely_user_service` database → user NOT found → returns `false`
6. `cart-service` throws `ResourceNotFoundException` → 404

**Affected Files**:
- `microservice-backend/user-service/src/main/resources/application.yml` — MongoDB URI points to `purely_user_service`
- `microservice-backend/auth-service/src/main/resources/application.yml` — MongoDB URI points to `purely_auth_service`
- `microservice-backend/cart-service/src/main/java/com/dharshi/cartservice/services/CartServiceImpl.java` — calls `userService.existsUserById()`
- `microservice-backend/cart-service/src/main/java/com/dharshi/cartservice/feigns/UserService.java` — Feign client to USER-SERVICE
- `microservice-backend/user-service/src/main/java/com/dharshi/userservice/services/UserServiceImpl.java` — queries `userRepository.existsById()`
- `microservice-backend/user-service/src/main/java/com/dharshi/userservice/repositories/UserRepository.java` — MongoRepository for User

**Severity**: Critical — blocks all cart operations for authenticated users.

### Bug 2: NaN Values in Cart UI

**Root Cause**: Multiple frontend code paths perform `parseFloat()` on values that can be `undefined` or `null`, producing `NaN`. This occurs when:
1. The cart state is initialized as an empty object `{}` — `cart.subtotal` is `undefined`
2. When the cart API call fails, the error handler sets `setCart({cartItems:[]})` without a `subtotal` field
3. If cart items have no `amount` field (e.g., when product service is unreachable during `cartItemToCartItemResponseDto`)

**Affected Code Locations**:
- `frontend/src/components/cart/cart.jsx` line ~62: `parseFloat(cartItem.amount).toFixed(2)` — renders `NaN` if `amount` is undefined
- `frontend/src/components/cart/cart.jsx` line ~88: `parseFloat(cart.subtotal).toFixed(2)` — renders `NaN` if `subtotal` is undefined
- `frontend/src/pages/checkout/checkout.jsx` line ~160: `parseFloat(cartItem.amount).toFixed(2)` — same issue
- `frontend/src/pages/checkout/checkout.jsx` line ~167: `parseFloat(cart?.subtotal).toFixed(2)` — same issue
- `frontend/src/api-service/cart.service.jsx` — initial state `useState({})` and error fallback `{cartItems:[]}` both lack numeric fields

**Severity**: High — users see invalid pricing, eroding trust in checkout flow.

### Bug 3: Broken External Image URLs

**Root Cause**: Product images are loaded from external URLs stored in `imageUrl` field (from `ProductDto`). No fallback mechanism exists when these URLs return 404/403 errors. The `<img>` tags render directly with `src={cartItem.imageUrl}` without `onError` handlers or placeholder fallbacks.

**Affected Code Locations**:
- `frontend/src/components/cart/cart.jsx` — `<img src={cartItem.imageUrl} .../>` in cart drawer
- `frontend/src/pages/checkout/checkout.jsx` — `<img src={cartItem.imageUrl} .../>` in order summary
- `frontend/src/pages/products/products.jsx` — `<img src={product.imageUrl} .../>` in product listing

**Severity**: Medium — visual degradation, broken image icons, potential console errors.

## Tech Stack Profile

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router, Axios, react-hook-form |
| Backend | Java Spring Boot (microservices), Spring Cloud (Eureka, Feign, API Gateway) |
| Database | MongoDB (separate databases per service) |
| Service Discovery | Eureka (port 8761) |
| API Gateway | Spring Cloud Gateway (port 8080) |
| Services | auth-service (9030), user-service (9050), cart-service (9060), product-service, category-service, order-service, notification-service |

## Key Constraints

1. **No architecture changes**: Fixes must work within the existing microservice topology — no merging services or restructuring.
2. **MongoDB per-service isolation**: The per-service database pattern is intentional for production. The fix for Bug 1 should align `user-service` with `auth-service` data rather than breaking DB isolation.
3. **Local development context**: The user runs locally; fixes must work on `localhost` with the existing Eureka + gateway setup.
4. **Minimal frontend disruption**: Cart and checkout component APIs should not change; fixes should be additive (guards, fallbacks).
5. **No external dependency additions**: Fixes should use existing libraries (React, Axios, Spring Boot, Feign).

## Key Assumptions

1. The `user-service` originally intends to share user data with `auth-service` — making them point to the same database (or syncing data) is the correct fix for local dev.
2. The `imageUrl` values in the product database may contain stale or external URLs that become unavailable over time.
3. The frontend cart state model can be safely extended with default numeric values without breaking other consumers.

## Strategic Recommendations

1. **Bug 1 Fix**: Configure `user-service` to use the same MongoDB database as `auth-service` (`purely_auth_service`) so user validation succeeds against the same records. This is the simplest, lowest-risk fix for local development.
2. **Bug 2 Fix**: Add defensive numeric parsing throughout the cart UI — use a safe formatter utility that defaults to `0.00` when values are `undefined`/`null`/`NaN`. Also initialize cart state with proper default numeric fields.
3. **Bug 3 Fix**: Add `onError` fallback handlers to all `<img>` tags in cart, checkout, and product components that replace broken URLs with a local placeholder image.
4. **Execution order**: Fix Bug 1 first (unblocks cart flow), then Bug 2 (fixes display), then Bug 3 (polishes UX).
