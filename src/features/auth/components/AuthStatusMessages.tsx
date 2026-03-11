"use client";

export function AuthStatusMessages({
  errorMessage,
  successMessage,
}: {
  errorMessage?: string | null;
  successMessage?: string | null;
}) {
  return (
    <>
      {errorMessage ? <p className="text-xs font-semibold text-destructive">{errorMessage}</p> : null}
      {successMessage ? <p className="text-xs font-semibold text-emerald-600">{successMessage}</p> : null}
    </>
  );
}
