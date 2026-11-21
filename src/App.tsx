import { Routes, Route } from 'react-router-dom';
import AppShell from '@/layout/AppShell';
import { routes } from '@/app/router/routes';
import { AuthGuard } from '@/app/router/guards';
import { ErrorPage } from '@/features/errors';

const SHELL_ROUTES = routes.filter((r) => r.path !== '/lock' && r.path !== '/onboarding');
const FULLSCREEN_ROUTES = routes.filter((r) => r.path === '/lock' || r.path === '/onboarding');

export default function App() {
  return (
    <Routes>
      {FULLSCREEN_ROUTES.map(({ path, element }) => (
        <Route key={path} path={path} element={<AuthGuard>{element}</AuthGuard>} />
      ))}
      <Route element={<AppShell />}>
        {SHELL_ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={<AuthGuard>{element}</AuthGuard>} />
        ))}
        <Route path="*" element={<ErrorPage code="URL3" />} />
      </Route>
    </Routes>
  );
}