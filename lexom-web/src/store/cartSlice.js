// LEXOM — Cart Redux Slice
// Section: Global State
// Dependencies: @reduxjs/toolkit
import { createSlice } from '@reduxjs/toolkit'

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('lexom_cart')
    return savedCart ? JSON.parse(savedCart) : []
  } catch (err) {
    return []
  }
}

const initialCartItems = getInitialCart()
const initialTotal = initialCartItems.reduce((sum, item) => sum + (item.price || 0), 0)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: initialCartItems,
    cartTotal: initialTotal,
    isCartDrawerOpen: false,
  },
  reducers: {
    // Add a product to cart and open the drawer
    addToCart: (state, action) => {
      // Ensure we don't add duplicates if that's the logic (previously we overwrote in localStorage)
      const existingIndex = state.cartItems.findIndex(item => item.id === action.payload.id)
      if (existingIndex >= 0) {
        state.cartItems[existingIndex] = action.payload
      } else {
        state.cartItems.push(action.payload)
      }
      state.cartTotal = state.cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
      state.isCartDrawerOpen = true
    },
    // Remove product by index
    removeFromCart: (state, action) => {
      const index = action.payload
      if (state.cartItems[index]) {
        state.cartTotal -= state.cartItems[index].price
        state.cartItems.splice(index, 1)
      }
    },
    // Update item quantity
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload
      if (quantity < 1) return
      if (quantity > 99) return
      const item = state.cartItems[index]
      if (item) {
        const diff = quantity - (item.quantity || 1)
        state.cartTotal += diff * item.price
        state.cartItems[index].quantity = quantity
      }
    },
    // Clear the entire cart
    clearCart: (state) => {
      state.cartItems = []
      state.cartTotal = 0
      state.isCartDrawerOpen = false
    },
    // Toggle the cart drawer open/closed
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false
    },
  },
})

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCartDrawer, 
  closeCartDrawer 
} = cartSlice.actions
export default cartSlice.reducer
