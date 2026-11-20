import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/layout/AppShell';
import { routes } from '@/app/router/routes';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}