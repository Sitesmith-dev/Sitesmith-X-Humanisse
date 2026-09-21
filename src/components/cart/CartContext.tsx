"use client";
import { useSyncExternalStore } from "react";
import { comics, getComic } from "@/content/comics";
import { SET_PRICE, rupee } from "./pricing";

export { SET_PRICE, rupee };

// One module-level store shared by the header, the catalogue, the comic page and the cart page.
// React Compiler is on, so state never hydrates inside an effect: the first subscriber loads storage,
// and every component reads through useSyncExternalStore with a stable empty server snapshot.
const KEY = "humanisse-preview-cart";
const EMPTY: readonly string[] = [];
const known = new Set(comics.map((c) => c.slug));

let items: readonly string[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

// Stale or hand-edited storage never reaches a render: only unique slugs that are still real comics survive
function clean(raw: unknown): readonly string[] {
  if (!Array.isArray(raw)) return EMPTY;
  const out: string[] = [];
  for (const s of raw) if (typeof s === "string" && known.has(s) && !out.includes(s)) out.push(s);
  return out.length ? out : EMPTY;
}

function read(): readonly string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? clean(JSON.parse(raw)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(next: readonly string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or a full quota only loses persistence, never the page
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function set(next: readonly string[]) {
  items = next;
  write(next);
  emit();
}

// Another tab changing the cart updates this one too
function onStorage(e: StorageEvent) {
  if (e.key !== null && e.key !== KEY) return;
  items = read();
  emit();
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    items = read();
    window.addEventListener("storage", onStorage);
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => items;
const getServerSnapshot = () => EMPTY;
const getReady = () => hydrated;
const getServerReady = () => false;

export const add = (slug: string) => { if (known.has(slug) && !items.includes(slug)) set([...items, slug]); };
export const remove = (slug: string) => { if (items.includes(slug)) set(items.filter((s) => s !== slug)); };
export const toggle = (slug: string) => (items.includes(slug) ? remove(slug) : add(slug));
export const clear = () => { if (items.length) set(EMPTY); };
export const addAll = () => set(comics.map((c) => c.slug));

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // True once storage has been read, so pages can avoid flashing an empty cart before the real one arrives
  const ready = useSyncExternalStore(subscribe, getReady, getServerReady);
  const count = items.length;
  const subtotal = items.reduce((sum, slug) => sum + (getComic(slug)?.price ?? 0), 0);
  // The set price applies only when every comic is in the cart
  const isFullSet = count === comics.length;
  const total = isFullSet ? Math.min(SET_PRICE, subtotal) : subtotal;
  const saving = subtotal - total;
  const has = (slug: string) => items.includes(slug);
  return { items, ready, add, remove, toggle, has, clear, addAll, count, subtotal, total, isFullSet, saving };
}
