// LEXOM — Redux Store Configuration
// Dependencies: @reduxjs/toolkit, react-redux
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import modalReducer from './modalSlice'
import filterReducer from './filterSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,
    filter: filterReducer,
  },
})

export default store
