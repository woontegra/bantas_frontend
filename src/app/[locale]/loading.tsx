export default function LocaleLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-slate-50 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-slate-500">Yükleniyor…</p>
    </div>
  );
}
