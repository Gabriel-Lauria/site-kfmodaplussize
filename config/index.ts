// Ponto único de leitura da config pelos componentes.
import { BRAND } from "./brand";
import { FEATURES } from "./features";
import type { Store } from "./stores";

export * from "./brand";
export * from "./editorial";
export * from "./features";
export * from "./format";
export * from "./products";
export * from "./stores";

export const SITE_URL = BRAND.siteUrl;
export const CONTACT = BRAND.contact;

// Textos dos botões de pedido conforme FEATURES.ctaMode.
export const CTA = BRAND.cta[FEATURES.ctaMode];

// Rótulos que mudam quando há uma loja só.
export const STORES_NAV = FEATURES.showStores ? "Nossas lojas" : "A loja";
export const STORES_CTA = FEATURES.showStores ? "Encontrar uma loja" : "Visitar a loja";

export function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function storeWhatsapp(store: Store) {
  return waLink(BRAND.messages.store(store.name));
}

export function storageKey(name: string) {
  return `${BRAND.slug}-${name}`;
}
