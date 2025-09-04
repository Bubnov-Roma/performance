import { lazy, Suspense } from 'react';

const AppContent = lazy(() => import('./components/LazyComponent'));

export function App() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">
          Loading CO₂ dataset… <span className="text-gray-500">(Suspense)</span>
        </div>
      }
    >
      <AppContent />
    </Suspense>
  );
}
