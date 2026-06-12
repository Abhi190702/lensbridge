export function ErrorPage({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-white">
      <div className="max-w-md rounded-xl border border-red-400/25 bg-red-400/10 p-5">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-red-100/80">{message}</p>
      </div>
    </main>
  );
}
