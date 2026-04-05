export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-9 w-9 animate-spin rounded-full border-4 border-brand border-t-transparent"
          aria-hidden
        />
        <p className="text-xs text-slate-500">Panel yükleniyor…</p>
      </div>
    </div>
  );
}
