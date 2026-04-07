---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "requirements"
document: "Requirements Traceability Matrix"
version: "1.0.0"
status: "draft"
author: "SDLC Agent"
source: "outputs/purely-cart-bugfix-PURELY-1/requirements/brd.md"
slug: "purely-cart-bugfix-PURELY-1"
---

# Requirements Traceability Matrix — Purely Cart Bug Fix

## 1. Overview

Full traceability matrix linking all requirement IDs across BRD, FRD, NFR, TR, DEP, US, and UJ artifacts. Every ID defined in the requirements pack appears in this matrix with no gaps.

## 2. BRD → FRD Mapping

| BRD ID | FRD IDs |
|---|---|
| BRD-001 | FRD-001 |
| BRD-002 | FRD-002, FRD-003, FRD-004 |
| BRD-003 | FRD-005, FRD-006, FRD-007 |

## 3. FRD → NFR Mapping

| FRD ID | NFR IDs |
|---|---|
| FRD-001 | NFR-003, NFR-006 |
| FRD-002 | NFR-001, NFR-004 |
| FRD-003 | NFR-001, NFR-004 |
| FRD-004 | NFR-001, NFR-004 |
| FRD-005 | NFR-002, NFR-005 |
| FRD-006 | NFR-002, NFR-005 |
| FRD-007 | NFR-002, NFR-005 |

## 4. FRD → US Mapping

| FRD ID | US IDs |
|---|---|
| FRD-001 | US-001 |
| FRD-002 | US-002 |
| FRD-003 | US-003, US-004 |
| FRD-004 | US-003, US-004 |
| FRD-005 | US-005 |
| FRD-006 | US-006 |
| FRD-007 | US-007 |

## 5. US → UJ Mapping

| US ID | UJ IDs |
|---|---|
| US-001 | UJ-001 |
| US-002 | UJ-001 |
| US-003 | UJ-002 |
| US-004 | UJ-003 |
| US-005 | UJ-004 |
| US-006 | UJ-004 |
| US-007 | UJ-004 |

## 6. NFR → TR Mapping

| NFR ID | TR IDs |
|---|---|
| NFR-001 | — |
| NFR-002 | TR-002 |
| NFR-003 | TR-001 |
| NFR-004 | — |
| NFR-005 | TR-002 |
| NFR-006 | TR-001 |

## 7. TR → FRD Mapping

| TR ID | FRD IDs |
|---|---|
| TR-001 | FRD-001 |
| TR-002 | FRD-005, FRD-006, FRD-007 |

## 8. Dependency Register

| DEP ID | From | To | Type | Direction | Impact |
|---|---|---|---|---|---|
| DEP-001 | auth-service | user-service | Data (shared MongoDB) | Inbound | BUG-1 fix requires user-service to read from auth-service database |
| DEP-002 | cart-service | user-service | Service (Feign client) | Outbound | Cart operations depend on user-service returning valid user existence checks |
| DEP-003 | cart.service.jsx | cart.jsx | Data (state shape) | Outbound | Cart component relies on cart state object including numeric fields |
| DEP-004 | cart.service.jsx | checkout.jsx | Data (state shape) | Outbound | Checkout page relies on cart state object including numeric fields |

## 9. DEP → BRD/FRD Linkage

| DEP ID | BRD IDs | FRD IDs |
|---|---|---|
| DEP-001 | BRD-001 | FRD-001 |
| DEP-002 | BRD-001 | FRD-001 |
| DEP-003 | BRD-002 | FRD-002, FRD-003, FRD-004 |
| DEP-004 | BRD-002 | FRD-002, FRD-003, FRD-004 |

## 10. Full Cross-Reference Matrix

| ID | Type | Traces To | Traced From |
|---|---|---|---|
| BRD-001 | Business Req | FRD-001 | — |
| BRD-002 | Business Req | FRD-002, FRD-003, FRD-004 | — |
| BRD-003 | Business Req | FRD-005, FRD-006, FRD-007 | — |
| FRD-001 | Functional Req | US-001, TR-001 | BRD-001, DEP-001, DEP-002 |
| FRD-002 | Functional Req | US-002 | BRD-002, DEP-003, DEP-004 |
| FRD-003 | Functional Req | US-003, US-004 | BRD-002 |
| FRD-004 | Functional Req | US-003, US-004 | BRD-002 |
| FRD-005 | Functional Req | US-005, TR-002 | BRD-003 |
| FRD-006 | Functional Req | US-006, TR-002 | BRD-003 |
| FRD-007 | Functional Req | US-007, TR-002 | BRD-003 |
| NFR-001 | Non-Functional Req | — | BRD-002, FRD-002, FRD-003, FRD-004 |
| NFR-002 | Non-Functional Req | TR-002 | BRD-003, FRD-005, FRD-006, FRD-007 |
| NFR-003 | Non-Functional Req | TR-001 | BRD-001, BRD-002, BRD-003, FRD-001 |
| NFR-004 | Non-Functional Req | — | BRD-002, FRD-002, FRD-003, FRD-004 |
| NFR-005 | Non-Functional Req | TR-002 | BRD-003, FRD-005, FRD-006, FRD-007 |
| NFR-006 | Non-Functional Req | TR-001 | BRD-001, FRD-001 |
| TR-001 | Technical Req | — | FRD-001, NFR-003, NFR-006 |
| TR-002 | Technical Req | — | FRD-005, FRD-006, FRD-007, NFR-002, NFR-005 |
| DEP-001 | Dependency | FRD-001 | BRD-001 |
| DEP-002 | Dependency | FRD-001 | BRD-001 |
| DEP-003 | Dependency | FRD-002, FRD-003, FRD-004 | BRD-002 |
| DEP-004 | Dependency | FRD-002, FRD-003, FRD-004 | BRD-002 |
| US-001 | User Story | UJ-001 | FRD-001 |
| US-002 | User Story | UJ-001 | FRD-002 |
| US-003 | User Story | UJ-002 | FRD-003, FRD-004 |
| US-004 | User Story | UJ-003 | FRD-003, FRD-004 |
| US-005 | User Story | UJ-004 | FRD-005 |
| US-006 | User Story | UJ-004 | FRD-006 |
| US-007 | User Story | UJ-004 | FRD-007 |
| UJ-001 | User Journey | — | BRD-001, US-001, US-002 |
| UJ-002 | User Journey | — | BRD-002, US-003 |
| UJ-003 | User Journey | — | BRD-002, US-004 |
| UJ-004 | User Journey | — | BRD-003, US-005, US-006, US-007 |

## 11. Coverage Summary

| Artifact | IDs Defined | All Traced | Gaps |
|---|---|---|---|
| BRD | 3 (BRD-001–003) | Yes | None |
| FRD | 7 (FRD-001–007) | Yes | None |
| NFR | 6 (NFR-001–006) | Yes | None |
| TR | 2 (TR-001–002) | Yes | None |
| DEP | 4 (DEP-001–004) | Yes | None |
| US | 7 (US-001–007) | Yes | None |
| UJ | 4 (UJ-001–004) | Yes | None |
| **Total** | **33 IDs** | **100%** | **None** |
