---
generator: "SDLC Agent"
date: "2026-04-06"
project: "purely-cart-bugfix-PURELY-1"
phase: "design"
document: "Design System Document"
version: "1.0.0"
status: "draft"
---

# Design System Document — Purely Cart Bug Fix

## 1. Scope

This document defines new reusable patterns introduced by the bug fixes. The existing design system (vanilla CSS modules, react-icons, no component library) is preserved. Only the delta is documented here.

### Existing Design System Summary [existing]

| Aspect | Current Pattern |
|---|---|
| Component model | React functional components with hooks |
| Styling | CSS modules (`.css` files per component/page) |
| Icons | `react-icons` (Ai*, Ri* icon sets) |
| State | React Context API (`AuthContext`, `CartContext`) |
| HTTP | Axios via custom service hooks |
| Forms | `react-hook-form` |
| Routing | React Router v6 |
| Component library | None (vanilla HTML + CSS) |
| Typography | Inherited from CSS — no design tokens |
| Color palette | Defined per CSS file — no centralized tokens |

**No changes to the above.** All patterns below are **additive extensions**.

---

## 2. Safe Numeric Formatting Pattern

**Stories**: PURELY-17 (US-002), PURELY-18 (US-003), PURELY-19 (US-004) / BRD-002

### 2.1 Pattern Definition

A utility function that safely formats numeric values for currency display, preventing `NaN` from appearing in the UI.

### 2.2 Specification

```javascript
/**
 * Safely formats a numeric value for currency display.
 * Returns "0.00" for undefined, null, NaN, or non-numeric inputs.
 *
 * @param {*} value - The value to format
 * @returns {string} Formatted number string with 2 decimal places
 */
function safeFormatPrice(value) {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return "0.00";
  return parsed.toFixed(2);
}
```

### 2.3 Usage Pattern

**Before** (current — broken):
```jsx
<span>Rs. {parseFloat(cartItem.amount).toFixed(2)}</span>
<h3>Subtotal: Rs. {parseFloat(cart.subtotal).toFixed(2)}</h3>
```

**After** (fixed):
```jsx
<span>Rs. {safeFormatPrice(cartItem.amount)}</span>
<h3>Subtotal: Rs. {safeFormatPrice(cart.subtotal)}</h3>
```

### 2.4 Scope of Application

| Component | Locations | Fields |
|---|---|---|
| `cart.jsx` | Item amount, subtotal | `cartItem.amount`, `cart.subtotal` |
| `checkout.jsx` | Item amount, subtotal | `cartItem.amount`, `cart.subtotal` |

### 2.5 Implementation Options

| Option | Approach | Pros | Cons |
|---|---|---|---|
| **A — Inline helper** | Define `safeFormatPrice` inside each component | Zero import overhead, self-contained | Duplicated across 2 files |
| **B — Shared utility** | Export from a shared utils file (e.g., `frontend/src/utils/format.js`) | Single source of truth, testable | Adds a new file |

**Recommendation**: Option B (shared utility) — the function is used in at least 2 components with 4+ call sites, and is likely useful for future pages. However, Option A is acceptable given the minimal-change constraint.

---

## 3. Image Fallback Pattern

**Stories**: PURELY-20 (US-005), PURELY-21 (US-006), PURELY-22 (US-007) / BRD-003

### 3.1 Pattern Definition

A reusable `onError` handler for `<img>` elements that swaps a broken image source with a local placeholder, with infinite-loop prevention.

### 3.2 Specification

```javascript
const PLACEHOLDER_IMAGE = "/placeholder-product.png";

/**
 * Handles image load errors by setting a local placeholder.
 * Includes a guard to prevent infinite error loops if the
 * placeholder itself fails to load.
 *
 * @param {SyntheticEvent} e - React onError event
 */
function handleImageError(e) {
  if (e.target.src !== window.location.origin + PLACEHOLDER_IMAGE) {
    e.target.src = PLACEHOLDER_IMAGE;
  }
}
```

### 3.3 Usage Pattern

**Before** (current — broken):
```jsx
<img src={`${cartItem.imageUrl}`} alt={cartItem.productName} />
```

**After** (fixed):
```jsx
<img
  src={`${cartItem.imageUrl}`}
  alt={cartItem.productName}
  onError={handleImageError}
/>
```

### 3.4 Scope of Application

| Component | Element(s) | Context |
|---|---|---|
| `cart.jsx` | Cart item image (`cartItem.imageUrl`) | Cart drawer sidebar |
| `checkout.jsx` | Order summary item image (`cartItem.imageUrl`) | Checkout order summary |
| `products.jsx` | Product card image (`product.imageUrl`) | Product listing grid |

### 3.5 Placeholder Asset

| Property | Value |
|---|---|
| Path | `frontend/public/placeholder-product.png` |
| Served at | `/placeholder-product.png` (Vite public directory) |
| Background | `#F0F0F0` (light gray) |
| Icon | Centered generic product icon in `#AAAAAA` |
| Size | Responsive (constrained by parent CSS) |
| Format | PNG or SVG |
| Target file size | < 5 KB |

### 3.6 Loop Prevention

The guard `e.target.src !== window.location.origin + PLACEHOLDER_IMAGE` ensures:
1. If the original image fails → placeholder is set.
2. If the placeholder fails → `src` is already the placeholder → no-op.
3. No infinite `onError` → `src` change → `onError` cycle.

### 3.7 Implementation Options

| Option | Approach | Pros | Cons |
|---|---|---|---|
| **A — Inline per component** | Define `handleImageError` and `PLACEHOLDER_IMAGE` in each component | Self-contained | Duplicated in 3 files |
| **B — Shared utility** | Export from `frontend/src/utils/image.js` | Single source of truth | Adds a new file |
| **C — HOC / wrapper component** | `<SafeImage src={url} fallback={placeholder} />` | Clean API, reusable | Adds complexity beyond bug fix scope |

**Recommendation**: Option B (shared utility) for the handler function and constant. Option C is over-engineering for a bug fix. Option A is acceptable if the team prefers zero new files.

---

## 4. Cart State Initialization Pattern

**Stories**: PURELY-17 (US-002) / BRD-002

### 4.1 Pattern Definition

All React state objects consumed by rendering logic must be initialized with a shape that matches what the rendering code expects, including default values for numeric fields displayed in the UI.

### 4.2 Specification

```javascript
const DEFAULT_CART_STATE = {
  cartItems: [],
  subtotal: 0
};

// Usage in CartService hook:
const [cart, setCart] = useState(DEFAULT_CART_STATE);

// Error fallback:
setCart(DEFAULT_CART_STATE);
```

### 4.3 Rules

1. Every field accessed in `render()` / JSX must have a default in the initial state.
2. Numeric fields displayed with `.toFixed()` or similar must default to `0`, not `undefined`.
3. Array fields iterated with `.map()` must default to `[]`, not `undefined`.
4. Error fallbacks must match the initial state shape — not a partial subset.

### 4.4 Before/After Comparison

| Aspect | Before (Broken) | After (Fixed) |
|---|---|---|
| `useState` init | `useState({})` | `useState({ cartItems: [], subtotal: 0 })` |
| Error fallback | `setCart({ cartItems: [] })` | `setCart({ cartItems: [], subtotal: 0 })` |
| Subtotal on mount | `undefined` → `NaN` | `0` → `"0.00"` |
| Subtotal on error | `undefined` → `NaN` | `0` → `"0.00"` |

---

## 5. Error State Display Patterns

### 5.1 Existing Error Patterns [existing — unchanged]

| Pattern | Component | Behavior |
|---|---|---|
| Loading spinner | `<Loading />` | Full-area spinner during async ops |
| Info message | `<Info message="..." />` | Centered text message |
| Form error | `<small className="text-danger">` | Red inline error text |
| Unauthorized | `<Unauthorized />` | Full-page auth-required message |

### 5.2 New Error Handling Behaviors

| Pattern | Trigger | Display | Stories |
|---|---|---|---|
| Safe numeric fallback | `undefined`/`null`/`NaN` price value | `Rs. 0.00` | PURELY-17, PURELY-18, PURELY-19 |
| Image placeholder | External image URL failure | Gray placeholder with icon | PURELY-20, PURELY-21, PURELY-22 |

These patterns degrade gracefully and **silently** — no toast notifications or error dialogs are shown for image failures or NaN fallbacks. This is intentional: these are presentation-layer fixes for data that should have been valid.

---

## 6. Pattern Traceability

| Pattern | Type | Stories | BRD |
|---|---|---|---|
| `safeFormatPrice()` | Utility function | PURELY-17, PURELY-18, PURELY-19 (US-002, US-003, US-004) | BRD-002 |
| `handleImageError()` | Event handler utility | PURELY-20, PURELY-21, PURELY-22 (US-005, US-006, US-007) | BRD-003 |
| `PLACEHOLDER_IMAGE` | Constant | PURELY-20, PURELY-21, PURELY-22 (US-005, US-006, US-007) | BRD-003 |
| `DEFAULT_CART_STATE` | State initialization pattern | PURELY-17 (US-002) | BRD-002 |
| Loop-guarded `onError` | Defensive coding pattern | PURELY-20, PURELY-21, PURELY-22 (US-005, US-006, US-007) | BRD-003 |
