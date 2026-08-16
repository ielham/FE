import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Moon, Sun, Search, ChevronDown } from "lucide-react";

export default function Header({ onOpenCommand }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Search trigger */}
      <Button
        variant="outline"
        className="w-64 justify-start gap-2 text-muted-foreground"
        onClick={onOpenCommand}
      >
        <Search className="h-4 w-4" />
        Search...
        <kbd className="ml-auto rounded border bg-muted px-1 text-xs">⌘K</kbd>
      </Button>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-1 pr-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>IL</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Ilham</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ilham Permana</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
