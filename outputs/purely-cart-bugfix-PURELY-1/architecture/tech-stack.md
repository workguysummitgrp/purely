---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "architecture"
document: "Tech Stack Selection"
version: "1.0.0"
status: "draft"
---

# Tech Stack Selection — Purely Cart Bug Fix

## 1. Overview

This document inventories the existing Purely technology stack and confirms that **zero new technologies or dependencies** are introduced by this enhancement. All three bug fixes use existing capabilities.

**Constraint**: NFR-003 — No new npm packages, Maven dependencies, or external libraries may be added.

---

## 2. Existing Stack Inventory

### 2.1 Backend

| Technology | Version | Purpose | Status |
|---|---|---|---|
| Java | 17+ | Language runtime | [existing] |
| Spring Boot | 3.x | Application framework | [existing] |
| Spring Cloud Gateway | 2023.x | API gateway routing | [existing] |
| Spring Cloud Netflix Eureka | 2023.x | Service discovery | [existing] |
| Spring Cloud OpenFeign | 2023.x | Declarative REST client for inter-service calls | [existing] |
| Spring Security | 6.x | Authentication/authorization | [existing] |
| Spring Data MongoDB | 3.x | MongoDB data access | [existing] |
| MongoDB | 6.x+ | Document database (per-service) | [existing] |
| Maven | 3.9+ | Build tool (via `mvnw` wrapper) | [existing] |
| Docker | — | Container images (per-service Dockerfiles) | [existing] |

### 2.2 Frontend

| Technology | Version | Purpose | Status |
|---|---|---|---|
| React | 18.x | UI framework | [existing] |
| Vite | 5.x | Build tool / dev server | [existing] |
| Axios | 1.x | HTTP client | [existing] |
| React Router | 6.x | Client-side routing | [existing] |
| React Context API | (built-in) | State management | [existing] |
| react-hook-form | 7.x | Form handling | [existing] |
| react-icons | 5.x | Icon library | [existing] |
| Nginx | 1.x | Production static file server (Docker) | [existing] |

### 2.3 Infrastructure

| Technology | Purpose | Status |
|---|---|---|
| Terraform | IaC — VPC, EKS, ECR, ALB provisioning | [existing] |
| Helm Charts | Kubernetes per-service deployment packaging | [existing] |
| Docker | Container runtime | [existing] |
| AWS EKS | Kubernetes cluster (production) | [existing] |

---

## 3. Enhancement Stack Impact

### 3.1 Impact Summary

| Category | New Additions | Removals | Version Changes |
|---|---|---|---|
| Backend dependencies (`pom.xml`) | 0 | 0 | 0 |
| Frontend dependencies (`package.json`) | 0 | 0 | 0 |
| Infrastructure tools | 0 | 0 | 0 |

### 3.2 Technologies Used by Each Fix

| Bug | Fix Approach | Technology Used | New? |
|---|---|---|---|
| BUG-1 (PURELY-16) | Change MongoDB URI in `application.yml` | Spring Data MongoDB (existing config) | No |
| BUG-2 (PURELY-17, PURELY-18, PURELY-19) | Safe state defaults + inline `parseFloat` guard | React `useState`, JavaScript `parseFloat`, `Number.toFixed` | No — built-in JS/React |
| BUG-3 (PURELY-20, PURELY-21, PURELY-22) | `onError` handler on `<img>` elements | React `onError` synthetic event (built-in) | No — native React prop |

### 3.3 Rationale for Zero New Dependencies

| Potential Dependency | Why Not Added |
|---|---|
| **numeral.js / accounting.js** (number formatting) | JavaScript's native `parseFloat()` + `toFixed()` with an `\|\| 0` guard achieves the same result without adding a library. The formatting need is limited to 4–6 call sites. |
| **react-image / react-image-fallback** (image error handling) | React's built-in `onError` prop on `<img>` elements handles the use case directly. A wrapper library would add bundle size for a one-prop solution. |
| **Joi / Zod** (state validation) | Overkill for defaulting 2 fields in a cart state object. A simple object spread with defaults suffices. |
| **Event bus / message broker** (data sync) | Not needed for the local development database-sharing fix. If production needs separate databases, a sync mechanism is a separate initiative. |

---

## 4. Verification

To verify NFR-003 compliance, confirm after development:

1. **Backend**: `git diff pom.xml` for all service directories shows no changes to `<dependencies>` sections
2. **Frontend**: `git diff frontend/package.json` shows no changes to `dependencies` or `devDependencies`
3. **Lock files**: No new entries in `package-lock.json` (if present) or Maven `.m2` cache

---

## 5. Traceability

| Section | NFR | BRD | Stories (Jira) |
|---|---|---|---|
| 3.2 BUG-1 technologies | NFR-003, NFR-006 | BRD-001 | PURELY-16 |
| 3.2 BUG-2 technologies | NFR-001, NFR-003, NFR-004 | BRD-002 | PURELY-17, PURELY-18, PURELY-19 |
| 3.2 BUG-3 technologies | NFR-002, NFR-003, NFR-005 | BRD-003 | PURELY-20, PURELY-21, PURELY-22 |
