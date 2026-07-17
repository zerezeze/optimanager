/**
 * Formats a phone number and generates a WhatsApp message URL.
 * Supports Brazilian numbers and adds country code (55) if missing.
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  // Strip all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, "");
  
  if (!cleanPhone) return "";

  // If phone doesn't start with '55' (Brazil code) and looks like a local DDD + number (10 or 11 digits)
  const formattedPhone = cleanPhone.startsWith("55")
    ? cleanPhone
    : `55${cleanPhone}`;

  const baseUrl = `https://wa.me/${formattedPhone}`;
  
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
  }

  return baseUrl;
}
