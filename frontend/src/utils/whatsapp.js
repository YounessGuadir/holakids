import { store } from '../data/catalog'

export function createWhatsAppLink(product, locale = 'fr') {
  const productUrl = product
    ? `${window.location.origin}/products/${product.slug}`
    : window.location.origin

  const message = product
    ? locale === 'ar' ? [
        'السلام عليكم HOLAKIDS 👋',
        '',
        'أنا مهتم بهذا المنتج:',
        '',
        `المنتج: ${product.name}`,
        `السعر: ${product.price} درهم`,
        `المرجع: ${product.sku}`,
        `الرابط: ${productUrl}`,
        '',
        'هل ما زال متوفرا؟',
        '',
        'شكرا.',
      ].join('\n') : [
        'Bonjour HOLAKIDS 👋',
        '',
        'Je suis intéressé(e) par ce jouet :',
        '',
        `Produit : ${product.name}`,
        `Prix : ${product.price} DH`,
        `Référence : ${product.sku}`,
        `Lien : ${productUrl}`,
        '',
        'Est-il toujours disponible ?',
        '',
        'Merci.',
      ].join('\n')
    : locale === 'ar' ? [
        'السلام عليكم HOLAKIDS 👋',
        '',
        'أرغب في الحصول على معلومات حول منتجاتكم.',
        '',
        'شكرا.',
      ].join('\n') : [
        'Bonjour HOLAKIDS 👋',
        '',
        'Je souhaite avoir plus d’informations sur vos jouets.',
        '',
        'Merci.',
      ].join('\n')

  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`
}
