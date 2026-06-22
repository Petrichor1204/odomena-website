"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-brown/10 bg-brown">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group">
          <span className="font-serif text-2xl font-semibold tracking-tight text-peach-light">
            Odomena
          </span>
          <span className="mt-0.5 block text-xs font-medium uppercase tracking-[0.2em] text-sky-light">
            African Fabrics
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-peach transition hover:text-sky-light"
          >
            Shop
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-sky/20 px-3 py-1 text-sky-light transition hover:bg-sky/40"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
