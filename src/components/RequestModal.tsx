"use client";

import { FormEvent, useState } from "react";
import type { Product } from "@/types";

type RequestModalProps = {
  product: Product;
  onClose: () => void;
};

export function RequestModal({ product, onClose }: RequestModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.name,
          customer_name: customerName,
          contact_info: contactInfo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brown/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-peach to-sky-light px-6 py-4">
          <h3 className="font-serif text-xl font-semibold text-brown">
            {status === "success" ? "Request sent!" : "Request to Buy"}
          </h3>
          {status !== "success" && (
            <p className="mt-0.5 text-sm text-brown/70">{product.name}</p>
          )}
        </div>

        <div className="p-6">
          {status === "success" ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-brown/70">
                Thanks! Odomena will reach out about{" "}
                <strong className="text-brown">{product.name}</strong>.
              </p>
              <button type="button" onClick={onClose} className="btn-primary w-full">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="customer-name" className="mb-1.5 block text-sm font-medium text-brown">
                  Your name
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="contact-info" className="mb-1.5 block text-sm font-medium text-brown">
                  Email or phone
                </label>
                <input
                  id="contact-info"
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(event) => setContactInfo(event.target.value)}
                  placeholder="you@email.com or (555) 123-4567"
                  className="input-field"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-peach-dark/50 px-4 py-2.5 text-sm font-medium text-brown transition hover:bg-peach-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary flex-1"
                >
                  {status === "loading" ? "Sending…" : "Submit request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
