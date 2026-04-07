---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "requirements"
document: "Jira Backlog Enrichment Plan"
version: "1.0.0"
status: "completed"
---

# Jira Backlog Enrichment Plan

**Project**: purely-cart-bugfix-PURELY-1
**Issues to enrich**: 10 (3 child epics + 7 stories)
**Generated**: 2026-04-06T15:10:00Z

## Enrichment Summary

| Field | Action | Issues Affected |
|---|---|---|
| Labels | +requirements, +auto-generated | 0 issues (all 10 already have both labels) |
| Priority | Map from BRD priority | 6 issues need update (Medium → High) |
| Components | Disabled per config | 0 issues |

## Priority Mapping (from BRD)

| BRD ID | BRD Priority | Jira Priority Target |
|---|---|---|
| BRD-001 | Critical | High |
| BRD-002 | High | High |
| BRD-003 | Medium | Medium |

Stories inherit priority from their parent child epic's BRD mapping.

## Detailed Plan

| Issue Key | Summary | Labels | Priority | Components |
|---|---|---|---|---|
| PURELY-13 | [BRD-001] Restore Cart Functionality for Authenticated Users | skip (already present) | Medium → **High** | disabled |
| PURELY-14 | [BRD-002] Display Accurate Numeric Values in Cart and Checkout UI | skip (already present) | Medium → **High** | disabled |
| PURELY-15 | [BRD-003] Ensure Reliable Product Image Display Across All Pages | skip (already present) | skip (already Medium) | disabled |
| PURELY-16 | [US-001] Fix user-service MongoDB URI to Resolve Cart 404s | skip (already present) | Medium → **High** (inherits BRD-001) | disabled |
| PURELY-17 | [US-002] Initialize Cart State with Safe Defaults | skip (already present) | Medium → **High** (inherits BRD-002) | disabled |
| PURELY-18 | [US-003] Apply Safe Numeric Formatting in Cart Component | skip (already present) | Medium → **High** (inherits BRD-002) | disabled |
| PURELY-19 | [US-004] Apply Safe Numeric Formatting in Checkout Page | skip (already present) | Medium → **High** (inherits BRD-002) | disabled |
| PURELY-20 | [US-005] Add Image Fallback in Cart Component | skip (already present) | skip (already Medium, inherits BRD-003) | disabled |
| PURELY-21 | [US-006] Add Image Fallback in Checkout Page | skip (already present) | skip (already Medium, inherits BRD-003) | disabled |
| PURELY-22 | [US-007] Add Image Fallback in Products Page | skip (already present) | skip (already Medium, inherits BRD-003) | disabled |

## Notes

- Idempotent: fields already matching target values are skipped.
- Non-blocking: individual field update failures are logged but do not stop enrichment.
- Labels were already applied during jira-sync — zero label changes needed.
- Components are disabled in config (`apply_components: false`).
- Net changes: **6 priority updates** across PURELY-13, PURELY-14, PURELY-16, PURELY-17, PURELY-18, PURELY-19.
