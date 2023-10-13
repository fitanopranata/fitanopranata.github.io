import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth.js'

export const store2 = configureStore({
  reducer: {
    auth: authReducer
  }
})