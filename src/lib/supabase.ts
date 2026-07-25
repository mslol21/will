import { createClient } from "@supabase/supabase-js";
import type { Product, Category, GiftBasket } from "@/types";

const supabaseUrl = "https://efcrctysxrwnrwlwriiy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY3JjdHlzeHJ3bnJ3bHdyaWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDc5NDksImV4cCI6MjEwMDQyMzk0OX0.zwxyS0EE9rLjFcvaYS9Trvt53QUdC4T5LjVCvI7dV5s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── PEDIDOS DE ORAÇÃO ───────────────────────────────────────
export async function submitPrayerRequest(nome: string, oracao: string) {
  const { data, error } = await supabase
    .from("pedidos_oracao")
    .insert([{ nome: nome || "Anonimo", oracao }]);
  return { data, error };
}

export async function getPrayerRequests() {
  const { data, error } = await supabase
    .from("pedidos_oracao")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

// ─── CATEGORIAS ──────────────────────────────────────────────
export async function getCategorias(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("name");
  if (error) { console.error("getCategorias:", error); return []; }
  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description || "",
    image: c.image || "",
    iconName: c.icon_name || "Package",
    itemCount: c.item_count || 0,
  }));
}

export async function upsertCategoria(cat: { id: string; name?: string; description?: string; image?: string; iconName?: string; itemCount?: number }) {
  const { data, error } = await supabase.from("categorias").upsert({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    image: cat.image,
    icon_name: cat.iconName || "Package",
    item_count: cat.itemCount || 0,
  });
  return { data, error };
}

// ─── PRODUTOS ────────────────────────────────────────────────
export async function getProdutos(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getProdutos:", error); return []; }
  return (data || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.short_description || "",
    fullDescription: p.full_description || p.short_description || "",
    price: parseFloat(p.price),
    originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
    category: p.category,
    image: p.image || "",
    gallery: p.gallery || [],
    weight: p.weight || "",
    origin: p.origin || "",
    sku: p.sku || "",
    stock: p.stock || 0,
    rating: parseFloat(p.rating) || 5.0,
    reviewCount: p.review_count || 0,
    badges: p.badges || [],
    isActive: p.is_active !== false,
  }));
}

export async function insertProduto(p: Partial<Product>) {
  const { data, error } = await supabase.from("produtos").insert([{
    slug: p.slug,
    name: p.name,
    short_description: p.shortDescription,
    full_description: p.fullDescription,
    price: p.price,
    original_price: p.originalPrice || null,
    category: p.category,
    image: p.image,
    gallery: p.gallery || [],
    weight: p.weight,
    origin: p.origin,
    sku: p.sku,
    stock: p.stock || 0,
    rating: p.rating || 5.0,
    review_count: p.reviewCount || 1,
    badges: p.badges || [],
    is_active: p.isActive !== false,
  }]).select();
  return { data, error };
}

export async function updateProduto(id: string, p: Partial<Product>) {
  const { data, error } = await supabase.from("produtos").update({
    name: p.name,
    slug: p.slug,
    short_description: p.shortDescription,
    full_description: p.fullDescription,
    price: p.price,
    original_price: p.originalPrice || null,
    category: p.category,
    image: p.image,
    weight: p.weight,
    origin: p.origin,
    sku: p.sku,
    stock: p.stock,
    is_active: p.isActive !== false,
  }).eq("id", id).select();
  return { data, error };
}

export async function updateStock(id: string, stock: number) {
  const { data, error } = await supabase
    .from("produtos")
    .update({ stock })
    .eq("id", id);
  return { data, error };
}

export async function deleteProduto(id: string) {
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  return { error };
}

// ─── FINANCEIRO / MEI ────────────────────────────────────────
export async function getLancamentos() {
  const { data, error } = await supabase
    .from("lancamentos_financeiros")
    .select("*")
    .order("data", { ascending: false });
  return { data: data || [], error };
}

export async function insertLancamento(lancamento: {
  tipo: "receita" | "custo" | "despesa";
  descricao: string;
  valor: number;
  data?: string;
  categoria?: string;
}) {
  const { data, error } = await supabase
    .from("lancamentos_financeiros")
    .insert([lancamento])
    .select();
  return { data, error };
}

export async function deleteLancamento(id: string) {
  const { error } = await supabase
    .from("lancamentos_financeiros")
    .delete()
    .eq("id", id);
  return { error };
}

// ─── PEDIDOS ─────────────────────────────────────────────────
export async function getPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

export async function insertPedido(pedido: {
  nome_cliente?: string;
  telefone?: string;
  itens: any[];
  total: number;
  mensagem?: string;
}) {
  const { data, error } = await supabase
    .from("pedidos")
    .insert([{ ...pedido, status: "pendente" }])
    .select();
  return { data, error };
}

// ─── AUTOMATIC SEED ──────────────────────────────────────────
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/mockData";

export async function seedAllMockDataToSupabase() {
  console.log("🌱 Populando categorias e produtos no Supabase...");
  
  // 1. Seed categories
  for (const cat of CATEGORIES) {
    await supabase.from("categorias").upsert({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      icon_name: cat.iconName || "Package",
      item_count: cat.itemCount || 0,
    });
  }

  // 2. Seed products
  for (const prod of MOCK_PRODUCTS) {
    await supabase.from("produtos").upsert({
      slug: prod.slug,
      name: prod.name,
      short_description: prod.shortDescription,
      full_description: prod.fullDescription,
      price: prod.price,
      original_price: prod.originalPrice || null,
      category: prod.category,
      image: prod.image,
      gallery: prod.gallery || [],
      weight: prod.weight,
      origin: prod.origin,
      sku: prod.sku,
      stock: prod.stock || 20,
      rating: prod.rating || 5.0,
      review_count: prod.reviewCount || 10,
      badges: prod.badges || [],
      is_active: true,
    }, { onConflict: "slug" });
  }

  console.log("✅ Seed concluído com sucesso!");
}
