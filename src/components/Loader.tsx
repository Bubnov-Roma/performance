import { memo } from 'react';

interface LoaderProps {
  loading: boolean;
  pending: boolean;
}

function LoaderImpl({ loading, pending }: LoaderProps) {
  const active = loading || pending;

  return (
    <div className="h-1 w-full rounded-full overflow-hidden my-2">
      <div
        className={`h-full w-full bg-gray-400 transition-opacity duration-300 ${
          active ? 'opacity-100 animate-progress' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export const Loader = memo(LoaderImpl);
