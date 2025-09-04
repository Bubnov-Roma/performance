import { memo, useCallback } from 'react';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

function AboutModalImpl({ open, onClose }: AboutModalProps) {
  const onBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/40"
      onClick={onBackdrop}
    >
      <div className="backdrop-blur-xl max-w-lg w-full rounded-2xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 border-none"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">About this Project</h2>
        <p className="mb-2 text-sm">
          This React project demonstrates working with a large dataset of CO₂
          emissions per country. It includes features such as:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>Search and filtering by regions and years</li>
          <li>Column selection with dynamic sorting</li>
          <li>Dual sort options (ascending / descending)</li>
          <li>
            Performance optimizations (Suspense, memoization, web workers)
          </li>
        </ul>
        <p className="text-sm mb-2">
          Project task description:{' '}
          <a
            href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/performance.md"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Performance Task
          </a>
        </p>
        <p className="text-sm mb-2">
          Thanks to Rolling Scopes School for providing the course:{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            ReactJS
          </a>
        </p>
        <p className="text-sm mb-2">
          API source:{' '}
          <a
            href="https://github.com/owid/co2-data"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            CO₂ Dataset
          </a>
        </p>
        <p className="text-sm">
          Author&apos;s GitHub:{' '}
          <a
            href="https://github.com/Bubnov-Roma"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Bubnov-Roma
          </a>
        </p>
      </div>
    </div>
  );
}

export const AboutModal = memo(AboutModalImpl);
