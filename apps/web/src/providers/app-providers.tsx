import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../layouts/app-layout';
import { DashboardPage } from '../pages/dashboard-page';
import { StudyPage } from '../pages/study-page';
import { ThemeProvider } from './theme-provider';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/study',
    element: <StudyPage />,
  },
]);

export function AppProviders() {
  return (
    <ConvexProvider client={convexClient}>
      <ThemeProvider defaultTheme="system" storageKey="itera-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </ConvexProvider>
  );
}
