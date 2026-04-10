// LEXOM — Modal Redux Slice
// Section: Global State
// Dependencies: @reduxjs/toolkit
import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isVideoModalOpen: false,
    isProductModalOpen: false,
    selectedProduct: null,
  },
  reducers: {
    // Toggle hero video modal
    toggleVideoModal: (state) => {
      state.isVideoModalOpen = !state.isVideoModalOpen
    },
    // Open product detail modal with product data
    openProductModal: (state, action) => {
      state.selectedProduct = action.payload
      state.isProductModalOpen = true
    },
    // Close product detail modal and clear data
    closeProductModal: (state) => {
      state.isProductModalOpen = false
      state.selectedProduct = null
    },
  },
})

export const { toggleVideoModal, openProductModal, closeProductModal } = modalSlice.actions
export default modalSlice.reducer
