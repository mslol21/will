/**
 * Integration module for PagBank / PagSeguro Moderninha Smart 2
 * Supports PlugPag App-to-App deeplinks and PagBank API integrations
 */

export interface PagBankPaymentRequest {
  amount: number; // In centavos (ex: 4890 for R$ 48,90)
  paymentType: "CREDIT" | "DEBIT" | "PIX" | "VOUCHER";
  installments?: number;
  userReference?: string;
}

/**
 * Generates a PlugPag App-to-App Deeplink to trigger PagBank payment screen on Moderninha Smart
 */
export function buildPlugPagDeeplink(req: PagBankPaymentRequest): string {
  const amountCents = Math.round(req.amount * 100);
  const ref = req.userReference || `PDV-${Date.now()}`;
  
  // PagSeguro PlugPag Intent URI format
  const params = new URLSearchParams({
    amount: amountCents.toString(),
    paymentType: req.paymentType,
    installments: (req.installments || 1).toString(),
    userReference: ref,
  });

  return `pagseguro://payment?${params.toString()}`;
}

/**
 * Formats order receipt text for 58mm thermal printer (Moderninha Smart built-in printer)
 */
export function generateThermalReceipt(order: {
  id?: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  discount?: number;
  paymentMethod: string;
  date?: string;
}): string {
  const dateStr = order.date || new Date().toLocaleString("pt-BR");
  const line = "--------------------------------";

  let receipt = "";
  receipt += "     EMPORIO CAMINHO DA FE      \n";
  receipt += "   Gastronomia & Tradicao MG    \n";
  receipt += "       FRENTE DE CAIXA PDV      \n";
  receipt += `${line}\n`;
  receipt += `Data: ${dateStr}\n`;
  if (order.id) receipt += `Pedido: #${order.id.slice(0, 8)}\n`;
  receipt += `${line}\n`;
  receipt += "ITEM                  QTD   VALOR\n";
  receipt += `${line}\n`;

  for (const item of order.items) {
    const name = item.name.padEnd(20, " ").slice(0, 20);
    const qty = String(item.qty).padStart(3, " ");
    const totalVal = (item.price * item.qty).toFixed(2).padStart(7, " ");
    receipt += `${name} ${qty} ${totalVal}\n`;
  }

  receipt += `${line}\n`;
  if (order.discount && order.discount > 0) {
    receipt += `Desconto:            R$ -${order.discount.toFixed(2)}\n`;
  }
  receipt += `TOTAL:               R$ ${order.total.toFixed(2)}\n`;
  receipt += `Forma Pagto:         ${order.paymentMethod.toUpperCase()}\n`;
  receipt += `${line}\n`;
  receipt += "   Sabores que alimentam a alma \n";
  receipt += "     Obrigado pela preferencia! \n\n\n";

  return receipt;
}
