import React, {Suspense} from 'react';
import '@coreui/coreui/dist/css/coreui.min.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './css/style.scss'
import Login from './components/Login';
import Dashboard from './views/Dashboard.js'
import Product from './views/Product';
import Account from './views/Account';
import Branch from './views/Branch';
import Client from './views/Client';
import Page404 from './views/Page404';
import Transactions from './views/Transactions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/productlist" element={<Product/>} />
          <Route path="/account" element={<Account/>} />
          <Route path="/branch" element={<Branch/>} />
          <Route path="/client" element={<Client/>} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
