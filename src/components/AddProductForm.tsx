"use client";

import { FormEvent, useRef, useState } from "react";

type AddProductFormProps = {
  onAdded: () => void;
};

export function AddProductForm({ onAdded }: AddProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = formRef.current;
    if (!form) return;

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: new FormData(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to add product");
      }

      form.reset();
      setSuccess(true);
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-peach-dark/20 bg-peach-light/60 px-6 py-4">
        <h2 className="font-serif text-lg font-semibold text-brown">Add new item</h2>
        <p className="mt-0.5 text-sm text-brown/70">
          Upload a photo and fill in the details below.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 p-6">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-brown">
            Name
          </label>
          <input id="name" name="name" type="text" required className="input-field" />
        </div>

        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-brown">
            Price (cedis)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-brown">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-brown">
            Photo
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            className="block w-full text-sm text-brown/70 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-light file:px-4 file:py-2 file:text-sm file:font-medium file:text-brown"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="rounded-lg bg-sky-light/60 px-3 py-2 text-sm text-brown-dark">
            Item added successfully.
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Uploading…" : "Add item"}
        </button>
      </form>
    </section>
  );
}
