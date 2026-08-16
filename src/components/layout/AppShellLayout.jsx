import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import { CommandDialog, CommandInput, CommandEmpty, CommandList, CommandGroup, CommandItem } from "../ui/command";

const menuItems = [
  { label: "Dashboard", to: "/", group: "Navigation" },
  { label: "Users", to: "/users", group: "Navigation" },
  { label: "Data Table", to: "/table", group: "Navigation" },
  { label: "Settings", to: "/settings", group: "Navigation" },
];

export default function AppShellLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 md:block">
        <Sidebar />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenCommand={() => setOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search menu..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {menuItems.map((item) => (
              <CommandItem
                key={item.to}
                onSelect={() => runCommand(item.to)}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
