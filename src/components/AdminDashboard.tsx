"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Product, PurchaseRequest } from "@/types";
import { AddProductForm } from "./AddProductForm";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

type AdminDashboardProps = {
  onLogout: () => void;
};

async function fetchAdminData() {
  const [productsRes, requestsRes] = await Promise.all([
    fetch("/api/products"),
    fetch("/api/requests"),
  ]);

  if (!productsRes.ok || !requestsRes.ok) {
    throw new Error("Failed to load admin data");
  }

  const [productsData, requestsData] = await Promise.all([
    productsRes.json(),
    requestsRes.json(),
  ]);

  return {
    products: productsData as Product[],
    requests: requestsData as PurchaseRequest[],
  };
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const data = await fetchAdminData();
      setProducts(data.products);
      setRequests(data.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetchAdminData()
      .then((data) => {
        if (!active) return;
        setProducts(data.products);
        setRequests(data.requests);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    onLogout();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brown">Admin</h1>
          <p className="mt-1 text-sm text-brown/70">
            Manage Odomena inventory and view purchase requests.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-peach-dark/50 px-4 py-2 text-sm font-medium text-brown transition hover:bg-peach-light"
        >
          Log out
        </button>
      </div>

      <AddProductForm onAdded={refresh} />

      <section className="card p-6">
        <h2 className="font-serif text-lg font-semibold text-brown">Inventory</h2>
        {loading ? (
          <p className="mt-4 text-sm text-brown/60">Loading…</p>
        ) : error ? (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="mt-4 text-sm text-brown/60">No items yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-peach-dark/20">
            {products.map((product) => (
              <li key={product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-peach-light ring-2 ring-sky/30">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brown">{product.name}</p>
                  <p className="text-sm font-medium text-brown-light">{formatPrice(product.price)}</p>
                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-brown/60">
                      {product.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="shrink-0 self-start rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 disabled:opacity-60"
                >
                  {deletingId === product.id ? "Deleting…" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-6">
        <h2 className="font-serif text-lg font-semibold text-brown">Purchase requests</h2>
        {loading ? (
          <p className="mt-4 text-sm text-brown/60">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-sm text-brown/60">No requests yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-peach-dark/20">
            {requests.map((request) => (
              <li key={request.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-brown">{request.customer_name}</p>
                    <p className="text-sm text-brown/70">{request.contact_info}</p>
                  </div>
                  <p className="rounded-full bg-sky-light px-2.5 py-0.5 text-xs text-brown-dark">
                    {formatDate(request.created_at)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-brown/80">
                  Wants: <span className="font-semibold text-brown">{request.product_name}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
