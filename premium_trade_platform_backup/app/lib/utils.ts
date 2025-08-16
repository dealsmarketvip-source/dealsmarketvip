
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = "EUR") {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: currency,
  }).format(price)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-EU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function isSubscriptionActive(subscription: any): boolean {
  if (!subscription) return false
  return subscription.status === "ACTIVE" && 
         subscription.currentPeriodEnd && 
         new Date(subscription.currentPeriodEnd) > new Date()
}
