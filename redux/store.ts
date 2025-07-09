import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import dashboardReducer from "./slices/dashboardSlice"
import cmsReducer from "./slices/cmsSlice"
import uiReducer from "./slices/uiSlice"
import publicDataReducer from './slices/publicDataSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    cms: cmsReducer,
    ui: uiReducer,
    publicData: publicDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
