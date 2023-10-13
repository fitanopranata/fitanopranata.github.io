import { legacy_createStore as createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth.js'

const initialState = {
  sidebarShow: true,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    changeState: changeState
  }
})

// const store = createStore(changeState)
// export default store
