import { memo, useEffect, useRef, useState } from 'react';
import { formatSelected } from '../utils/formatSelected';

interface NormalOption<T> {
  label: string;
  value: T;
}

interface DualOption {
  label: string;
  key: string;
  dual: true;
}

export type Option<T> = NormalOption<T> | DualOption;

interface DropdownListProps<T> {
  label: string;
  value: T | T[];
  options: Option<T>[];
  onChange: (v: T | T[]) => void;
  type: 'radio' | 'checkbox' | 'radio-dual';
  footer?: React.ReactNode | ((ctx: { close: () => void }) => React.ReactNode);
}

function DropdownListImpl<T extends string | number>({
  label,
  value,
  options,
  onChange,
  type,
  footer,
}: DropdownListProps<T>) {
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

  const isSelected = (v: T) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  const toggleValue = (v: T) => {
    if (type === 'radio' || type === 'radio-dual') {
      onChange(v);
      setOpen(false);
    } else {
      if (!Array.isArray(value)) return;
      const set = new Set(value);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      onChange(Array.from(set) as T[]);
    }
  };

  return (
    <div
      className="relative"
      title={
        Array.isArray(value) && value.length > 0
          ? value
              .map(
                (v) =>
                  options.find((o) => 'value' in o && o.value === v)?.label ??
                  String(v)
              )
              .join(', ')
          : label
      }
      ref={ref}
    >
      <button
        className="w-full px-3 py-2 rounded-xl border shadow flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">
          {formatSelected(
            value,
            options.filter(
              (o): o is { label: string; value: T } => 'value' in o
            ),
            label
          )}
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
        <div className="absolute z-10 mt-2 w-full rounded-xl border backdrop-blur-2xl shadow max-h-64 flex flex-col">
          <div className="flex-1 overflow-auto">
            {options.map((o, idx) => {
              if ('dual' in o && o.dual && o.key) {
                const ascKey = `${o.key}_asc` as T;
                const descKey = `${o.key}_desc` as T;
                return (
                  <div
                    key={o.key}
                    className="flex justify-between items-center px-2 py-1"
                  >
                    <span className="truncate">{o.label}</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          checked={isSelected(ascKey)}
                          onChange={() => toggleValue(ascKey)}
                        />
                        ↑
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          checked={isSelected(descKey)}
                          onChange={() => toggleValue(descKey)}
                        />
                        ↓
                      </label>
                    </div>
                  </div>
                );
              }

              return (
                <label
                  key={'value' in o ? o.value : idx}
                  className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer"
                >
                  <input
                    type={type === 'checkbox' ? 'checkbox' : 'radio'}
                    checked={'value' in o ? isSelected(o.value) : false}
                    onChange={() => 'value' in o && toggleValue(o.value)}
                  />
                  <span className="text-sm">{o.label}</span>
                </label>
              );
            })}
          </div>
          {footer && (
            <div className="flex gap-2 items-center border-t p-2 sticky bottom-0 backdrop-gray-xl">
              {typeof footer === 'function'
                ? footer({ close: () => setOpen(false) })
                : footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const DropdownList = memo(DropdownListImpl);
