import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/auth";

const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await getMe();
      setPermissions(data.permissions || []);
    } catch {
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const hasPermission = (code) => permissions.includes(code);

  return (
    <PermissionContext.Provider value={{ permissions, loading, hasPermission, refetch: fetchPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used within PermissionProvider");
  return ctx;
}
