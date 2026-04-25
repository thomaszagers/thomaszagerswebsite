import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";

export default function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    adminApi
      .me()
      .then((response) => {
        setAllowed(response.authenticated);
      })
      .catch(() => {
        setAllowed(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen p-10 text-slate-700">Checking admin session...</div>;
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}