
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  // Remove any non-digit characters from the phone number
  const cleanPhone = phone.replace(/\D/g, "");
  
  // Ensure the phone number has the country code
  const formattedPhone = cleanPhone.startsWith("27")
    ? cleanPhone
    : `27${cleanPhone.startsWith("0") ? cleanPhone.substring(1) : cleanPhone}`;
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}
