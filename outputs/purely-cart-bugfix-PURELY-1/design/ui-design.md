---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "design"
document: "UI Design Document"
version: "1.0.0"
status: "draft"
---

# UI Design Document — Purely Cart Bug Fix

## 1. Scope

This document covers UI changes for the enhancement bug-fix run. Only screens affected by the three bugs are in scope. No new screens or navigation changes are introduced.

### Affected Screens

| Screen | Component Path | Bugs Addressed | Jira Stories |
|---|---|---|---|
| Cart Drawer (sidebar) | `frontend/src/components/cart/cart.jsx` | BUG-2, BUG-3 | PURELY-18 (US-003), PURELY-20 (US-005) |
| Checkout Page | `frontend/src/pages/checkout/checkout.jsx` | BUG-2, BUG-3 | PURELY-19 (US-004), PURELY-21 (US-006) |
| Products Page | `frontend/src/pages/products/products.jsx` | BUG-3 | PURELY-22 (US-007) |

### Screens NOT in Scope

All other pages (Home, Login, Register, My Account, Order History, Search) are unaffected and not documented here.

---

## 2. Cart Drawer — Bug Fix UI Changes

**Existing pattern** [existing]: Slide-in sidebar (`div.shoppingCart.active`) triggered by header cart icon. Contains cart items list, quantity controls, subtotal, and checkout button. Uses `cart.css` for styling.

### 2.1 Numeric Display Fix — PURELY-18 (US-003) / BRD-002

#### Current State (Broken)

```
Cart Item Row:
┌──────────────────────────────────────────┐
│ [BROKEN IMG]  Product Name         [🗑]  │
│               Rs. 250 x 2 = Rs. NaN     │
│               [ - ]  2  [ + ]            │
└──────────────────────────────────────────┘

Subtotal Bar:
┌──────────────────────────────────────────┐
│ Subtotal: Rs. NaN                        │
│ [  Proceed to checkout  ]                │
└──────────────────────────────────────────┘
```

When `cartItem.amount` or `cart.subtotal` is `undefined`/`null`, `parseFloat()` returns `NaN`, displayed literally.

#### Fixed State

```
Cart Item Row:
┌──────────────────────────────────────────┐
│ [product img]  Product Name        [🗑]  │
│               Rs. 250 x 2 = Rs. 500.00  │
│               [ - ]  2  [ + ]            │
└──────────────────────────────────────────┘

Subtotal Bar:
┌──────────────────────────────────────────┐
│ Subtotal: Rs. 500.00                     │
│ [  Proceed to checkout  ]                │
└──────────────────────────────────────────┘
```

**Display Rules**:
- All monetary values use `safeFormatPrice(value)` → returns `"0.00"` for `undefined`/`null`/`NaN`, otherwise `parseFloat(value).toFixed(2)`.
- Format: `Rs. {formatted_value}` (preserves existing currency prefix).
- No change to font, color, or layout — only the rendered number changes.

### 2.2 Image Fallback — PURELY-20 (US-005) / BRD-003

#### Current State (Broken)

```
┌──────────────────────────────────────────┐
│ [🖼️ ✕]  Product Name               [🗑]  │
│          (broken image icon visible)     │
└──────────────────────────────────────────┘
```

External `imageUrl` returns 404/403 → browser shows broken-image icon.

#### Fixed State

```
┌──────────────────────────────────────────┐
│ [placeholder]  Product Name         [🗑]  │
│  (gray box     Rs. 250 x 1 = Rs. 250.00 │
│   with icon)   [ - ]  1  [ + ]           │
└──────────────────────────────────────────┘
```

**Placeholder Design**:
- Source: Local asset (e.g., `/placeholder-product.png` or inline SVG).
- Appearance: Light gray background (#F0F0F0), centered package/image icon in medium gray (#AAAAAA).
- Size: Matches existing `img` dimensions in cart row (constrained by existing CSS).
- Behavior: `onError` handler replaces `src` with placeholder path. Guard prevents infinite loop if placeholder itself fails.

#### States

| State | Visual | Trigger |
|---|---|---|
| Image loading | No change (browser default) | `<img>` element created |
| Image loaded | Product image displayed | `onLoad` fires successfully |
| Image error | Placeholder displayed | `onError` fires; `src` swapped to placeholder |
| Placeholder error | No further action (loop guard) | `onError` fires but `src` already equals placeholder |

### 2.3 Cart Empty / Error / Loading States [existing — unchanged]

These states remain unchanged from the existing implementation:

| State | Current Behavior | Change |
|---|---|---|
| **Loading** | `<Loading />` spinner component | No change |
| **Empty cart** | `<Info message="No items in your cart!" />` | No change |
| **Cart error** | `cartError` flag set; no visible UI error message | No change (out of scope) |
| **Initial load (pre-API)** | Subtotal shows `NaN` | **Fixed**: Shows `Rs. 0.00` via safe defaults (PURELY-17 / US-002) |

### 2.4 Accessibility — Cart Drawer

| Element | WCAG 2.1 AA Requirement | Implementation |
|---|---|---|
| Placeholder image | `alt` text must describe fallback | `alt="Product image unavailable"` |
| Price display | Screen reader must read valid value | Safe formatting ensures numeric string, not "NaN" |
| Quantity buttons | Disabled state announced | Existing `disable` class — no change |

---

## 3. Checkout Page — Bug Fix UI Changes

**Existing pattern** [existing]: Full-page layout with shipping form (left) and order summary (right). Uses `checkout.css`, `react-hook-form` for form handling. Cart data consumed via `CartContext`.

### 3.1 Numeric Display Fix — PURELY-19 (US-004) / BRD-002

#### Current State (Broken)

```
Order Summary:
┌───────────────────────────────────┐
│ Order summary                     │
│ ─────────────────────────────────│
│ [IMG] Product A                   │
│       Rs. 250 x 2 = Rs. NaN      │
│ [IMG] Product B                   │
│       Rs. 100 x 1 = Rs. NaN      │
│ ─────────────────────────────────│
│ Sub Total          Rs. NaN        │
└───────────────────────────────────┘
```

#### Fixed State

```
Order Summary:
┌───────────────────────────────────┐
│ Order summary                     │
│ ─────────────────────────────────│
│ [IMG] Product A                   │
│       Rs. 250 x 2 = Rs. 500.00   │
│ [IMG] Product B                   │
│       Rs. 100 x 1 = Rs. 100.00   │
│ ─────────────────────────────────│
│ Sub Total          Rs. 600.00     │
└───────────────────────────────────┘
```

**Display Rules**: Same `safeFormatPrice()` utility as cart drawer. Identical fix pattern.

### 3.2 Image Fallback — PURELY-21 (US-006) / BRD-003

Same `onError` handler pattern as cart drawer. Placeholder image is identical. Applied to all `<img>` elements within the order summary section (`summary > .product > img`).

### 3.3 Checkout States

| State | Current Behavior | Change |
|---|---|---|
| **Unauthenticated** | `<Unauthorized />` component | No change [existing] |
| **Form loading** | "Processing..." button text | No change [existing] |
| **Order error** | Red `text-danger` message | No change [existing] |
| **Cart empty** | Order summary renders empty (no items) | Shows `Rs. 0.00` for subtotal via safe defaults |

### 3.4 Accessibility — Checkout Page

| Element | WCAG 2.1 AA Requirement | Implementation |
|---|---|---|
| Placeholder image | Descriptive `alt` text | `alt="Product image unavailable"` |
| Price values | Valid numeric content for screen readers | Safe formatting ensures readable values |
| Order summary section | Semantic `<summary>` tag already used | No change [existing] |

---

## 4. Products Page — Bug Fix UI Changes

**Existing pattern** [existing]: Grid layout of product cards. Each card has image, price, name, description, and "Add to cart" button. Uses `products.css`. Category tabs for filtering.

### 4.1 Image Fallback — PURELY-22 (US-007) / BRD-003

#### Current State (Broken)

```
Product Card:
┌─────────────────┐
│  [🖼️ ✕ broken]  │
│  Rs. 250         │
│  Product Name    │
│  Description...  │
│  [Add to cart]   │
└─────────────────┘
```

#### Fixed State

```
Product Card:
┌─────────────────┐
│  [placeholder]   │
│  Rs. 250         │
│  Product Name    │
│  Description...  │
│  [Add to cart]   │
└─────────────────┘
```

Same `onError` handler and placeholder as cart/checkout. Applied to `.box > img.image` elements.

### 4.2 Products Page States [existing — unchanged]

| State | Current Behavior | Change |
|---|---|---|
| **Loading** | `<Loading />` spinner | No change |
| **Error** | `<Info message="Unable to display product right now..." />` | No change |
| **Empty** | No products rendered; empty grid | No change |

### 4.3 Accessibility — Products Page

| Element | WCAG 2.1 AA Requirement | Implementation |
|---|---|---|
| Product image | `alt` attribute present and descriptive | Existing: `alt='product'` — placeholder uses same `alt` |
| Placeholder image | Non-decorative alt when fallback active | `alt="Product image unavailable"` on error |

---

## 5. Placeholder Image Specification

A single reusable placeholder image asset is used across all three screens.

| Property | Value |
|---|---|
| Location | `frontend/public/placeholder-product.png` (or inline SVG constant) |
| Dimensions | Flexible (CSS-constrained by container) |
| Background | `#F0F0F0` (light gray) |
| Icon | Centered package/camera icon in `#AAAAAA` |
| Format | PNG (with transparency) or SVG |
| File size target | < 5 KB |

The placeholder must be a **local** asset — not an external URL — to guarantee availability when external image hosts are down.

---

## 6. Cross-Bug Visual Summary

| Screen | NaN Fix | Image Fallback | Stories |
|---|---|---|---|
| Cart Drawer | ✅ Amount + Subtotal | ✅ Cart item images | PURELY-18, PURELY-20 |
| Checkout Page | ✅ Amount + Subtotal | ✅ Order summary images | PURELY-19, PURELY-21 |
| Products Page | — (no numeric bug) | ✅ Product card images | PURELY-22 |
| Cart Service Hook | ✅ Default state | — | PURELY-17 |
| user-service Config | — | — | PURELY-16 (backend only) |
