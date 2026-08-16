import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import AppShellLayout from "./components/layout/AppShellLayout";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
import TablePage from "./pages/TablePage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route element={<AppShellLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
