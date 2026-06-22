export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  created_at: string;
};

export type PurchaseRequest = {
  id: string;
  product_id: string | null;
  product_name: string;
  customer_name: string;
  contact_info: string;
  created_at: string;
};
