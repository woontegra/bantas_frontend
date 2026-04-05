"use client";

import { useEffect } from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-lg font-semibold text-slate-900">Sayfa yüklenemedi</p>
      <p className="text-sm text-slate-600">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "Bir süre sonra tekrar deneyin."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Yeniden dene
      </button>
    </div>
  );
}
