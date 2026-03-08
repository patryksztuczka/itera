import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 text-slate-900">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">Tailwind v4 is ready</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Prettier now uses the Tailwind plugin, so class names are auto-sorted on format.
        </p>
        <button
          onClick={() => setCount((value) => value + 1)}
          className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Count is {count}
        </button>
      </section>
    </main>
  );
}

export default App;
