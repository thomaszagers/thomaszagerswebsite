import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import Media from "./pages/Media";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEventsList from "./pages/admin/AdminEventsList";
import AdminEventForm from "./pages/admin/AdminEventForm";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },

      { path: "agenda", element: <Agenda /> },
      { path: "media", element: <Media /> },

      { path: "biography", element: <Navigate to="/#bio" replace /> },
      { path: "projects", element: <Navigate to="/#projecten" replace /> },
      { path: "contact", element: <Navigate to="/#contact" replace /> },
      { path: "repertoire", element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "events", element: <AdminEventsList /> },
          { path: "events/new", element: <AdminEventForm /> },
          { path: "events/:id/edit", element: <AdminEventForm /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}