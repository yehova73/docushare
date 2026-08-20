import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function capitalize(value: string): string {
  if (value.length === 0) return value;
  return value[0].toUpperCase() + value.slice(1);
}

export const isDefined = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;

export function distinctBy<T, K>(array: T[], keySelector: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
export function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return '""';
  const s = typeof value === "string" ? value : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const cappitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
