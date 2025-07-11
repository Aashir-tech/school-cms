import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GalleryState {
  categories: string[]
}

const initialState: GalleryState = {
  categories: [
    "Events",
    "Campus",
    "Students",
    "Faculty",
    "Sports",
    "Activities",
    "Facilities",
    "Graduation",
    "Other",
  ],
}

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<string>) => {
      const newCategory = action.payload.trim()
      if (newCategory && !state.categories.includes(newCategory)) {
        state.categories.push(newCategory)
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
        const categoryToRemove = action.payload
        state.categories = state.categories.filter(cat => cat !== categoryToRemove)
      },
  },
})

export const { addCategory , removeCategory } = gallerySlice.actions
export default gallerySlice.reducer