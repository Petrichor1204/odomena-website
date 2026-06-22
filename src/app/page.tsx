import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { createSupabaseAdmin } from "@/lib/supabase";
import type { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch products:", error.message);
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
        <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-peach via-peach-light to-sky-light px-8 py-12">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky/30 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-peach-dark/40 blur-xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brown-light">
              Handpicked textiles
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-brown md:text-5xl">
              Odomena African Fabrics
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brown/80">
              Vibrant prints, rich textures, and one-of-a-kind pieces. Browse our
              collection and request to buy — we&apos;ll reach out to complete your
              order.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-brown px-4 py-1.5 text-xs font-medium text-peach-light">
                Ankara & Wax Print
              </span>
              <span className="rounded-full bg-sky px-4 py-1.5 text-xs font-medium text-brown-dark">
                Kente & More
              </span>
              <span className="rounded-full border border-brown/20 bg-white/60 px-4 py-1.5 text-xs font-medium text-brown">
                Custom Orders Welcome
              </span>
            </div>
          </div>
        </section>

        <div className="mb-6 flex items-center gap-3">
          <h2 className="font-serif text-2xl font-semibold text-brown">Shop Collection</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-peach-dark to-sky/50" />
        </div>

        <ProductGrid products={products} />
      </main>
      <footer className="mt-auto border-t border-peach-dark/30 bg-brown py-8 text-center">
        <p className="font-serif text-lg text-peach-light">Odomena African Fabrics</p>
        <p className="mt-1 text-xs text-sky-light/80">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </footer>
    </>
  );
}
