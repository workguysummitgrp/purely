---
generator: "SDLC Agent"
date: "2026-04-07"
project: "purely-cart-bugfix-PURELY-1"
phase: "testing"
---

# Unit Test Results

## Summary

- **Framework**: Vitest 2.1.9 + @testing-library/react 16.1.0 (frontend); JUnit 5 (backend — written, not executed)
- **Total**: 24 | **Passed**: 22 | **Failed**: 0 | **Skipped**: 0 | **Not Executed**: 2
- **Coverage**: 81.41% lines (critical-path), 81.41% statements (overall)
- **Duration**: 4.07 s (frontend); backend tests not executed (no Maven/Gradle runner in CI)

### Execution Environment

| Property | Value |
|---|---|
| Test Runner | Vitest 2.1.9 (`vitest run`) |
| Coverage Provider | @vitest/coverage-v8 |
| DOM Environment | jsdom 25.0.1 |
| React | 18.2.0 |
| OS | Windows (local) |
| Node | Workspace default |

## Test Cases

### Frontend (Executed — 22/22 passed)

| Test ID | User Story | Test Name | Status | File |
|---|---|---|---|---|
| UT-001 | US-002 / PURELY-17 | initial cart state has safe numeric defaults (subtotal=0, noOfCartItems=0) | PASS | cart.service.test.jsx |
| UT-002 | US-002 / PURELY-17 | parseFloat with \|\| 0 guard produces "0.00" for all falsy inputs | PASS | cart.service.test.jsx |
| UT-003 | US-002 / PURELY-17 | error handler resets cart to safe defaults | PASS | cart.service.test.jsx |
| UT-004 | US-002 / PURELY-17 | cart resets to safe defaults when user has no token | PASS | cart.service.test.jsx |
| UT-005 | US-003 / PURELY-18 | renders "0.00" for amount and subtotal when cartItem.amount is undefined — no NaN | PASS | cart.test.jsx |
| UT-006 | US-003 / PURELY-18 | renders "0.00" when cartItem.amount is null — no NaN | PASS | cart.test.jsx |
| UT-007 | US-003 / PURELY-18 | renders correct amount when cartItem.amount is a valid number | PASS | cart.test.jsx |
| UT-008 | US-003 / PURELY-18 | renders info message when no cart items exist | PASS | cart.test.jsx |
| UT-009 | US-005 / PURELY-20 | sets placeholder image on error | PASS | cart.test.jsx |
| UT-010 | US-005 / PURELY-20 | does NOT loop — second error keeps placeholder (data-fallback guard) | PASS | cart.test.jsx |
| UT-011 | US-004 / PURELY-19 | renders "0.00" when cartItem.amount is undefined — no NaN | PASS | checkout.test.jsx |
| UT-012 | US-004 / PURELY-19 | renders "0.00" when cartItem.amount is null — no NaN | PASS | checkout.test.jsx |
| UT-013 | US-004 / PURELY-19 | renders correct amount when values are valid numbers | PASS | checkout.test.jsx |
| UT-014 | US-004 / PURELY-19 | renders subtotal "0.00" with empty cart | PASS | checkout.test.jsx |
| UT-015 | US-006 / PURELY-21 | sets placeholder image on error | PASS | checkout.test.jsx |
| UT-016 | US-006 / PURELY-21 | does NOT loop — guard prevents double fallback | PASS | checkout.test.jsx |
| UT-017 | US-007 / PURELY-22 | renders product images with correct src | PASS | products.test.jsx |
| UT-018 | US-007 / PURELY-22 | sets placeholder image on error for broken image | PASS | products.test.jsx |
| UT-019 | US-007 / PURELY-22 | does NOT loop — guard prevents infinite fallback cycle | PASS | products.test.jsx |
| UT-020 | US-007 / PURELY-22 | good image is not affected by fallback logic until error fires | PASS | products.test.jsx |
| UT-021 | US-007 / PURELY-22 | placeholder constant matches the SVG used in products.jsx | PASS | products.test.jsx |
| UT-022 | US-007 / PURELY-22 | renders real Products component with img elements that have onError handlers (CR-001 smoke) | PASS | products.test.jsx |

### Backend (Written, Not Executed — 2 tests)

| Test ID | User Story | Test Name | Status | File |
|---|---|---|---|---|
| UT-023 | US-001 / PURELY-16 | mongoDbUri_shouldPointToAuthServiceDatabase | NOT EXECUTED | MongoDbUriConfigTest.java |
| UT-024 | US-001 / PURELY-16 | mongoDbUri_shouldBeValidMongoConnectionString | NOT EXECUTED | MongoDbUriConfigTest.java |

**Reason**: Backend tests require Maven + JDK build toolchain. The user-service project uses Spring Boot with Maven wrapper (`mvnw`). These tests read `application.yml` from classpath and assert the MongoDB URI contains `purely_auth_service`. Execution deferred to CI pipeline or manual `./mvnw test` run.

## Failed Tests

_No failures._

## Coverage Breakdown

| Module | Lines | Branches | Functions | Statements |
|---|---|---|---|---|
| **All files (total)** | **81.41%** (333/409) | **60.78%** (31/51) | **44%** (11/25) | **81.41%** (333/409) |
| `api-service/cart.service.jsx` | 47.12% (41/87) | 100% (8/8) | 50% (3/6) | 47.12% |
| `components/cart/cart.jsx` | 92.50% (74/80) | 68.75% (11/16) | 25% (2/8) | 92.50% |
| `pages/checkout/checkout.jsx` | 97.16% (137/141) | 37.50% (6/16) | 66.66% (2/3) | 97.16% |
| `pages/products/products.jsx` | 80.19% (81/101) | 54.54% (6/11) | 50% (4/8) | 80.19% |

### Coverage Assessment

**Critical-path line coverage: 81.41%** — exceeds the 80% minimum threshold.

| Criterion | Status | Notes |
|---|---|---|
| Critical-path ≥ 80% lines | **PASS** | 81.41% overall lines across bug-fix files |
| cart.jsx bug-fix paths | **PASS** | 92.50% lines — safe numeric + image fallback covered |
| checkout.jsx bug-fix paths | **PASS** | 97.16% lines — safe numeric + image fallback covered |
| products.jsx bug-fix paths | **PASS** | 80.19% lines — image fallback + smoke test covered |
| cart.service.jsx | **ATTENTION** | 47.12% lines — `addItemToCart`, `removeItemFromCart`, `getCartInformation` mutation functions not exercised (not part of bug-fix scope) |

### Coverage Gap Analysis

The following areas have lower coverage, but fall **outside the bug-fix scope**:

1. **cart.service.jsx (47.12% lines)**: The `addItemToCart` (lines 18–32), `removeItemFromCart` (lines 35–49), and `getCartInformation` (lines 52–67) mutation functions are not tested. These are pre-existing service functions unrelated to the US-002 safe-defaults fix. Branch coverage is 100% for the initialized state and error paths that were part of the bug fix.

2. **cart.jsx functions (25%)**: Cart item increment/decrement/delete handler functions (lines 20–27) are not invoked by tests. These are interaction handlers from the original codebase, not part of the NaN or image-fallback fixes.

3. **checkout.jsx branches (37.50%)**: Form validation branches (lines 22–27) for the order placement flow are not exercised. These are pre-existing checkout form logic, not part of the numeric formatting fix.

4. **products.jsx (lines 53–57, 70–77, 95–102)**: Category filtering and product fetch side-effect branches are pre-existing logic outside bug-fix scope.

**Recommendation**: These gaps are acceptable for a bug-fix engagement. A future feature sprint should add integration tests covering cart mutations and checkout form submission.

## User Story Traceability Matrix

| US ID | Jira Key | Story Description | Test IDs | Tests | Coverage |
|---|---|---|---|---|---|
| US-001 | PURELY-16 | Fix MongoDB URI | UT-023, UT-024 | 2 (not executed) | Config assertion (deferred) |
| US-002 | PURELY-17 | Safe Cart Defaults | UT-001 – UT-004 | 4 | Init state, error handler, no-token, parseFloat guard |
| US-003 | PURELY-18 | Safe Numeric in Cart | UT-005 – UT-008 | 4 | undefined, null, valid number, empty cart |
| US-004 | PURELY-19 | Safe Numeric in Checkout | UT-011 – UT-014 | 4 | undefined, null, valid number, empty cart |
| US-005 | PURELY-20 | Image Fallback Cart | UT-009, UT-010 | 2 | onError handler, infinite-loop guard |
| US-006 | PURELY-21 | Image Fallback Checkout | UT-015, UT-016 | 2 | onError handler, infinite-loop guard |
| US-007 | PURELY-22 | Image Fallback Products | UT-017 – UT-022 | 6 | src check, onError, loop guard, unaffected img, constant validation, real component smoke |

**All 7 user stories have test coverage.** US-001 backend tests are written but require Maven execution.

## Defects

_No defects found during unit test execution._

| ID | Test ID | Severity | Description | Expected | Actual |
|---|---|---|---|---|---|
| — | — | — | No defects | — | — |

### Warnings (Non-Blocking)

| Severity | Source | Description |
|---|---|---|
| LOW | cart.service.test.jsx (UT-001) | React `act(...)` warning during async state update in `renderHook`. Does not affect test correctness — state assertions use `waitFor`. Suppressible with explicit `act()` wrapping in a future cleanup pass. |

## Test File Inventory

| File | Path | Tests | Stories |
|---|---|---|---|
| cart.service.test.jsx | `frontend/src/__tests__/cart.service.test.jsx` | 4 | US-002 |
| cart.test.jsx | `frontend/src/__tests__/cart.test.jsx` | 6 | US-003, US-005 |
| checkout.test.jsx | `frontend/src/__tests__/checkout.test.jsx` | 6 | US-004, US-006 |
| products.test.jsx | `frontend/src/__tests__/products.test.jsx` | 6 | US-007 |
| MongoDbUriConfigTest.java | `microservice-backend/user-service/src/test/java/.../MongoDbUriConfigTest.java` | 2 | US-001 |
| setup.js | `frontend/src/__tests__/setup.js` | — | Test infrastructure |
| vitest.config.js | `frontend/vitest.config.js` | — | Test infrastructure |
