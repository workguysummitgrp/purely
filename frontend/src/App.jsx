// Modified by SDLC Agent | 2026-04-08 | purely-wishlist-service-PURELY-23 | development
// Changes: Added WishlistContext.Provider wrapping (WishlistService + WishlistContext).
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/routes"
import './assets/styles/index.css'
import { AuthContext, useAuth } from "./contexts/auth.context"
import CartService from "./api-service/cart.service";
import CartContext from "./contexts/cart.context";
import WishlistService from "./api-service/wishlist.service";
import WishlistContext from "./contexts/wishlist.context";

function App() {

  const { user, toggleUser } = useAuth();
  const { cart, cartError, isProcessingCart, addItemToCart, removeItemFromCart, getCartInformation } = CartService();
  const {
    wishlistItems, wishlistError, isProcessingWishlist,
    addToWishlist, removeFromWishlist, getWishlistItems,
    moveToCart, shareWishlist, getSharedWishlist, isInWishlist
  } = WishlistService();

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, toggleUser }}>
        <CartContext.Provider value={{ cart, cartError, isProcessingCart, addItemToCart, removeItemFromCart, getCartInformation }}>
          <WishlistContext.Provider value={{
            wishlistItems, wishlistError, isProcessingWishlist,
            addToWishlist, removeFromWishlist, getWishlistItems,
            moveToCart, shareWishlist, getSharedWishlist, isInWishlist
          }}>
            <AppRoutes />
          </WishlistContext.Provider>
        </CartContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App
