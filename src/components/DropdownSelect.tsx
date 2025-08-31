import { memo, useEffect, useRef, useState } from 'react';

function DropdownSelectImpl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (ev: MouseEvent) => {
      if (ref.current && !ref.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-full px-3 py-2 rounded-xl shadow flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">
          {options.find((o) => o.value === value)?.label ?? label}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border backdrop-blur-xl shadow max-h-64 overflow-auto">
          {options.map((o) => (
            <button
              key={String(o.value)}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-10"
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const DropdownSelect = memo(DropdownSelectImpl);
