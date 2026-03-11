"use client";

export function SettingsToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-6.5 w-12 rounded-full transition-all ${checked ? "bg-primary" : "bg-secondary"}`}
    >
      <div className={`absolute top-1 h-4.5 w-4.5 rounded-full bg-white transition-all ${checked ? "left-6.5" : "left-1"}`} />
    </button>
  );
}
