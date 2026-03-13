import { Database } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/theme-toggle';

export function AppLayout() {
  return (
    <div className="bg-muted/40 text-foreground min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
              <Database className="h-4 w-4" />
            </div>
            <span>Itera</span>
          </div>

          <ThemeToggle />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
