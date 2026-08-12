import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Availability = "available" | "sold_out" | "out_of_stock" | "preorder";

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  short_description: string | null;
  description: string | null;
  specifications: string[];
  condition_note: string | null;
  warranty: string | null;
  price: number;
  previous_price: number | null;
  stock: number;
  availability: Availability;
  is_featured: boolean;
  image_url: string | null;
  gallery: string[];
  category_id: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const normalize = (row: Record<string, unknown>): Product => ({
  ...(row as unknown as Product),
  price: Number(row["price"]),
  previous_price: row["previous_price"] == null ? null : Number(row["previous_price"]),
  specifications: asStringArray(row["specifications"]),
  gallery: asStringArray(row["gallery"]),
});

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "In stock",
  sold_out: "Sold out",
  out_of_stock: "Out of stock",
  preorder: "Pre-order",
};

export const isPurchasable = (availability: Availability) =>
  availability === "available" || availability === "preorder";

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => normalize(row as Record<string, unknown>));
    },
  });

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,slug,description,sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? normalize(data as Record<string, unknown>) : null;
    },
  });
