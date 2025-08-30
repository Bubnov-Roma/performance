import React, { memo, useCallback, useMemo } from 'react';
import type { ColumnSpec } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  available: ColumnSpec[];
  selected: ColumnSpec[];
  onToggleKey: (key: string) => void;
}
function ColumnSelectorModalImpl({
  open,
  onClose,
  available,
  selected,
  onToggleKey,
}: Props) {
  const selectedKeys = useMemo(
    () => new Set(selected.map((c) => c.key)),
    [selected]
  );
  const onBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center p-4"
      onClick={onBackdrop}
    >
      <div className="backdrop-blur-md rounded-2xl bg-white/30 shadow-xl w-full max-w-xl p-4">
        <header className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Select additional columns</h3>
          <button onClick={onClose} className="px-2 py-1 rounded-lg border">
            Close
          </button>
        </header>
        <div className="mt-3 grid sm:grid-cols-2 gap-2 max-h-[60vh] overflow-auto">
          {available.map((c) => (
            <label
              key={c.key}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-10"
            >
              <input
                type="checkbox"
                checked={selectedKeys.has(c.key)}
                onChange={() => onToggleKey(c.key)}
              />
              <span className="text-sm">{c.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ColumnSelectorModal = memo(ColumnSelectorModalImpl);
