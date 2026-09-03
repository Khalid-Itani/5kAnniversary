"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-primary w-full disabled:cursor-wait disabled:opacity-60"
      type="submit"
      disabled={pending}
    >
      {pending ? "Submitting…" : children}
    </button>
  );
}
