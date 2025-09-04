export function formatSelected<T>(
  value: T | T[],
  options: { label: string; value: T }[],
  label: string
): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return label;
    if (value.length === 1) {
      return (
        options.find((o) => o.value === value[0])?.label ?? String(value[0])
      );
    }
    const first =
      options.find((o) => o.value === value[0])?.label ?? String(value[0]);
    return `${first} +${value.length - 1}`;
  }

  return options.find((o) => o.value === value)?.label ?? label;
}
