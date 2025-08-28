import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import BorrowsHistory from './components/Members/BorrowHistory.jsx';
import AdminHome from './components/Admin/AdminHome.jsx';
import AdminReports from './components/Admin/AdminReports.jsx';
import Store from './context/Store.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/borrows-history",
        element: <BorrowsHistory />
      },
      {
        path: "/admin-home",
        element: <AdminHome />
      },
      {
        path: "/library",
        element: <AdminReports />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Store>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Store>
  </StrictMode>,
)
