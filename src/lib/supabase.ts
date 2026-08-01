import { createClient } from "@/utils/supabase/client";
import type { Product, Category, GiftBasket } from "@/types";

export const supabase = createClient();

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
    validade: p.validade || undefined,
  }));
}

export async function insertProduto(p: Partial<Product>) {
  const payload: any = {
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
  };
  
  if (p.validade !== undefined) {
    payload.validade = p.validade || null;
  }

  const { data, error } = await supabase.from("produtos").insert([payload]).select();
  return { data, error };
}

export async function updateProduto(id: string, p: Partial<Product>) {
  const payload: any = {
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
  };

  if (p.validade !== undefined) {
    payload.validade = p.validade || null;
  }

  const { data, error } = await supabase.from("produtos").update(payload).eq("id", id).select();
  return { data, error };
}

export async function updateStock(id: string, stock: number) {
  const { data, error } = await supabase
    .from("produtos")
    .update({ stock })
    .eq("id", id);
  return { data, error };
}

export async function adjustStock(
  id: string, 
  currentStock: number, 
  newStock: number, 
  motivo: string = "Ajuste manual"
) {
  const delta = newStock - currentStock;
  const tipo = delta > 0 ? "entrada" : delta < 0 ? "saida" : "ajuste";
  const absQty = Math.abs(delta);

  if (absQty === 0) return { data: null, error: null };

  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("produtos")
    .update({ stock: newStock })
    .eq("id", id);

  if (!error) {
    await supabase.from("movimentacao_estoque").insert([{
      produto_id: id,
      tipo,
      quantidade: absQty,
      motivo,
      responsavel_id: userData.user?.id
    }]);
  }

  return { data, error };
}

export async function getMovimentacoes() {
  const { data, error } = await supabase
    .from("movimentacao_estoque")
    .select(`
      id, tipo, quantidade, motivo, created_at,
      produto:produtos(name),
      responsavel:perfis(nome)
    `)
    .order("created_at", { ascending: false })
    .limit(50);
  return { data: data || [], error };
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
  pontos_ganhos?: number;
}) {
  const { data, error } = await supabase
    .from("pedidos")
    .insert([{ ...pedido, status: "pendente" }])
    .select();
  return { data, error };
}

// ─── CRM (CLIENTES) ──────────────────────────────────────────
export async function getClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nome");
  return { data: data || [], error };
}

export async function insertCliente(cliente: {
  nome: string;
  telefone?: string;
  email?: string;
  cidade?: string;
  data_nascimento?: string;
}) {
  const { data, error } = await supabase
    .from("clientes")
    .insert([cliente])
    .select();
  return { data, error };
}

export async function updateCliente(id: string, cliente: any) {
  const { data, error } = await supabase
    .from("clientes")
    .update(cliente)
    .eq("id", id)
    .select();
  return { data, error };
}

// ─── FORNECEDORES ──────────────────────────────────────────────
export async function getFornecedores() {
  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .order("nome_fantasia");
  
  if (data) {
    return data.map(f => ({
      id: f.id,
      nomeFantasia: f.nome_fantasia,
      razaoSocial: f.razao_social,
      cnpj: f.cnpj,
      email: f.email,
      telefone: f.telefone,
      endereco: f.endereco,
      createdAt: f.created_at,
    }));
  }
  return [];
}

export async function insertFornecedor(f: any) {
  const { data, error } = await supabase.from("fornecedores").insert([{
    nome_fantasia: f.nomeFantasia,
    razao_social: f.razaoSocial,
    cnpj: f.cnpj,
    email: f.email,
    telefone: f.telefone,
    endereco: f.endereco,
  }]).select();
  return { data, error };
}

// ─── COMPRAS ─────────────────────────────────────────────────
export async function getPedidosCompra() {
  const { data, error } = await supabase
    .from("pedidos_compra")
    .select(`
      *,
      fornecedor:fornecedores (*),
      itens:itens_pedido_compra (*)
    `)
    .order("created_at", { ascending: false });
  return { data: data || [], error };
}

export async function insertPedidoCompra(pedido: any, itens: any[]) {
  const { data: pedidoData, error: pedidoError } = await supabase
    .from("pedidos_compra")
    .insert([{
      fornecedor_id: pedido.fornecedorId,
      status: "pendente",
      valor_total: pedido.valorTotal,
    }])
    .select()
    .single();

  if (pedidoError || !pedidoData) return { error: pedidoError };

  const itensPayload = itens.map(i => ({
    pedido_compra_id: pedidoData.id,
    produto_id: i.produtoId,
    quantidade: i.quantidade,
    custo_unitario: i.custoUnitario,
  }));

  const { error: itensError } = await supabase
    .from("itens_pedido_compra")
    .insert(itensPayload);

  return { data: pedidoData, error: itensError };
}

export async function receberPedidoCompra(pedidoId: string) {
  // 1. Marcar como recebido
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos_compra")
    .update({ status: "recebido", data_recebimento: new Date().toISOString() })
    .eq("id", pedidoId)
    .select("*, itens:itens_pedido_compra(*)")
    .single();

  if (pedidoError || !pedido) return { error: pedidoError };

  // 2. Dar entrada no estoque
  for (const item of pedido.itens) {
    const { data: produto } = await supabase
      .from("produtos")
      .select("stock, custo_medio")
      .eq("id", item.produto_id)
      .single();

    if (produto) {
      const newStock = produto.stock + item.quantidade;
      const currentTotalCost = produto.stock * (produto.custo_medio || 0);
      const addedCost = item.quantidade * item.custo_unitario;
      const newCustoMedio = newStock > 0 ? (currentTotalCost + addedCost) / newStock : 0;

      await supabase.from("produtos").update({
        stock: newStock,
        custo_medio: newCustoMedio
      }).eq("id", item.produto_id);
    }
  }

  // 3. Lançamento Financeiro Automático
  await insertLancamento({
    tipo: "despesa",
    descricao: `Compra de Fornecedor (Pedido #${pedidoId.substring(0,8)})`,
    valor: pedido.valor_total,
    categoria: "Fornecedores"
  });

  return { data: pedido };
}

// ─── CESTAS & KITS ─────────────────────────────────────────────
export async function getCestas(): Promise<GiftBasket[]> {
  const { data, error } = await supabase
    .from("cestas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getCestas:", error); return []; }
  return (data || []).map((c: any) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || "",
    price: parseFloat(c.price),
    originalPrice: c.original_price ? parseFloat(c.original_price) : undefined,
    image: c.image || "",
    includedItems: c.included_items || [],
    containerType: c.container_type || "caixa-kraft",
    isCustomizable: false,
    available: c.available !== false,
  }));
}

export async function insertCesta(c: Partial<GiftBasket>) {
  const payload: any = {
    slug: c.slug,
    name: c.name,
    description: c.description,
    price: c.price,
    original_price: c.originalPrice || null,
    image: c.image,
    included_items: c.includedItems || [],
    container_type: c.containerType,
    available: c.available !== false,
  };
  const { data, error } = await supabase.from("cestas").insert([payload]).select();
  return { data, error };
}

export async function updateCesta(id: string, c: Partial<GiftBasket>) {
  const payload: any = {
    slug: c.slug,
    name: c.name,
    description: c.description,
    price: c.price,
    original_price: c.originalPrice || null,
    image: c.image,
    included_items: c.includedItems,
    container_type: c.containerType,
    available: c.available,
  };
  // Remove undefined fields
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
  
  const { data, error } = await supabase.from("cestas").update(payload).eq("id", id).select();
  return { data, error };
}

export async function deleteCesta(id: string) {
  const { error } = await supabase.from("cestas").delete().eq("id", id);
  return { error };
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
