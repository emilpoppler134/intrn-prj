import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './views/Dashboard';
import ForgotPassword from "./views/ForgotPassword";
import Login from './views/Login';

import './assets/index.css';
import './assets/main.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/login" element={<Login />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
		</Routes>
	</BrowserRouter>
);