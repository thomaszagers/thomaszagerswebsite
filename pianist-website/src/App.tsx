import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import Media from "./pages/Media";
import NotFound from "./pages/NotFound"



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
      { path: "*", element: <NotFound /> }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}