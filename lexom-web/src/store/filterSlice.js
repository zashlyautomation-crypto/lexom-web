// LEXOM — Filter Redux Slice
// Section: 3 - Collection Gallery
// Dependencies: @reduxjs/toolkit
import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    activeFilters: {
      size: null,
      color: null,
      price: null,
    },
  },
  reducers: {
    // Toggle filter — if value already active, unselect (set null)
    setFilter: (state, action) => {
      const { category, value } = action.payload
      state.activeFilters[category] =
        state.activeFilters[category] === value ? null : value
    },
    // Reset all filters to null
    clearFilters: (state) => {
      state.activeFilters = { size: null, color: null, price: null }
    },
  },
})

export const { setFilter, clearFilters } = filterSlice.actions
export default filterSlice.reducer
