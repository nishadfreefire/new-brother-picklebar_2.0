import { StoreSettings } from '../types';

/**
 * Returns a standardized, sanitized international phone number suitable for WhatsApp links (e.g. 88017XXXXXXXX)
 * Always reads live from admin settings (whatsappPhone or contactPhone).
 */
export function getCleanWhatsAppPhone(settings?: StoreSettings | null): string {
  const rawPhone = settings?.whatsappPhone || settings?.contactPhone || '01711234567';
  let cleanPhone = rawPhone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
    cleanPhone = '88' + cleanPhone;
  } else if (!cleanPhone.startsWith('880') && cleanPhone.startsWith('1')) {
    cleanPhone = '880' + cleanPhone;
  } else if (!cleanPhone.startsWith('88') && cleanPhone.length === 10 && cleanPhone.startsWith('1')) {
    cleanPhone = '880' + cleanPhone;
  }
  
  return cleanPhone || '8801711234567';
}

/**
 * Generates an official wa.me link with admin-configured WhatsApp number and pre-filled message.
 */
export function getWhatsAppUrl(settings?: StoreSettings | null, message?: string): string {
  const cleanPhone = getCleanWhatsAppPhone(settings);
  const text = message || settings?.whatsappMessage || 'Hello New Brother Picklebar, I would like to inquire about your pickles!';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
