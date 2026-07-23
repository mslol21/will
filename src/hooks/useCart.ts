"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ContainerType = "bau-madeira" | "cesta-palha" | "caixa-kraft";

export interface CustomBasketState {
  container: ContainerType;
  items: CartItem[];
  giftNote: string;
  recipientName: string;
  senderName: string;
}

const CONTAINER_PRICES: Record<ContainerType, number> = {
  "bau-madeira": 65.0,
  "cesta-palha": 45.0,
  "caixa-kraft": 25.0,
};

const CONTAINER_NAMES: Record<ContainerType, string> = {
  "bau-madeira": "Baú Luxo de Madeira Trabalhada",
  "cesta-palha": "Cesta de Palha Trançada com Forro",
  "caixa-kraft": "Caixa Kraft Festiva com Fita Elegante",
};

export function useCart() {
  const [basket, setBasket] = useState<CustomBasketState>({
    container: "bau-madeira",
    items: [],
    giftNote: "",
    recipientName: "",
    senderName: "",
  });

  const addItem = (product: Product, quantity = 1) => {
    setBasket((prev) => {
      const existingIndex = prev.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        const newItems = [...prev.items];
        newItems[existingIndex].quantity += quantity;
        return { ...prev, items: newItems };
      }

      return {
        ...prev,
        items: [...prev.items, { product, quantity }],
      };
    });
  };

  const removeItem = (productId: string) => {
    setBasket((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.product.id !== productId),
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setBasket((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const setContainer = (container: ContainerType) => {
    setBasket((prev) => ({ ...prev, container }));
  };

  const setGiftDetails = (
    recipientName: string,
    senderName: string,
    giftNote: string
  ) => {
    setBasket((prev) => ({ ...prev, recipientName, senderName, giftNote }));
  };

  const clearBasket = () => {
    setBasket({
      container: "bau-madeira",
      items: [],
      giftNote: "",
      recipientName: "",
      senderName: "",
    });
  };

  const containerPrice = CONTAINER_PRICES[basket.container];
  const itemsPrice = basket.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalPrice = containerPrice + itemsPrice;
  const totalItemsCount = basket.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const generateWhatsAppMessage = () => {
    let msg = `✨ *PEDIDO DE CESTA PERSONALIZADA - EMPÓRIO CAMINHO DA FÉ* ✨\n\n`;
    msg += `📦 *Embalagem Escolhida:* ${CONTAINER_NAMES[basket.container]}\n\n`;
    msg += `🧀 *Itens Selecionados:*\n`;

    basket.items.forEach((item, index) => {
      msg += `${index + 1}. ${item.product.name} (x${item.quantity}) - R$ ${(
        item.product.price * item.quantity
      ).toFixed(2)}\n`;
    });

    msg += `\n💰 *Resumo financeiro:*\n`;
    msg += `• Embalagem: R$ ${containerPrice.toFixed(2)}\n`;
    msg += `• Produtos (${totalItemsCount}): R$ ${itemsPrice.toFixed(2)}\n`;
    msg += `*TOTAL DA CESTA: R$ ${totalPrice.toFixed(2)}*\n\n`;

    if (basket.recipientName || basket.senderName || basket.giftNote) {
      msg += `✉️ *Cartão de Mensagem:*\n`;
      if (basket.recipientName) msg += `• Para: ${basket.recipientName}\n`;
      if (basket.senderName) msg += `• De: ${basket.senderName}\n`;
      if (basket.giftNote) msg += `• Mensagem: "${basket.giftNote}"\n\n`;
    }

    msg += `Gostaria de confirmar a disponibilidade e os detalhes de entrega! 🙏🌿`;
    return msg;
  };

  return {
    basket,
    addItem,
    removeItem,
    updateQuantity,
    setContainer,
    setGiftDetails,
    clearBasket,
    containerPrice,
    containerName: CONTAINER_NAMES[basket.container],
    itemsPrice,
    totalPrice,
    totalItemsCount,
    generateWhatsAppMessage,
  };
}
