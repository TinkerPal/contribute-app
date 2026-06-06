import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const setItemInLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const setItemInSessionStorage = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getItemFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const getItemFromSessionStorage = (key) => {
  return JSON.parse(sessionStorage.getItem(key));
};

export const removeItemFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const removeItemFromSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};

export const maskEmail = (email) => {
  const visibleStart = 5;
  const visibleEnd = 3;

  const start = email.slice(0, visibleStart);
  const end = email.slice(email.length - visibleEnd);

  const maskedMiddle = "*".repeat(email.length - visibleStart - visibleEnd);

  return `${start}${maskedMiddle}${end}`;
};

export const handleCopy = (value) => {
  navigator.clipboard.writeText(value);
};

/**
 * Converts a datetime-local value to Unix seconds.
 *
 * Example input:
 * "2026-05-28T22:24"
 *
 * Safe for client-side/browser usage.
 */
export function datetimeLocalToUnixSeconds(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  // YYYY-MM-DDTHH:mm
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  if (!regex.test(value)) {
    return null;
  }

  const date = new Date(value);

  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.floor(timestamp / 1000);
}
