import React from 'react';
import ReactDOM from 'react-dom/client';
import 'core-js'
import App from './App';
import axios from 'axios';
import {Provider} from 'react-redux'
import {store} from './store.js'
// import {store2} from './app/store.js'
axios.defaults.withCredentials = true

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);