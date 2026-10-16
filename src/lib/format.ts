export const NGN = (value: number) => `₦${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(value)}`;
export const STORE_NAME = 'CEELINKSTELEGLOBAL';
export const STORE_SLOGAN = 'WE BUY • WE SELL • WE SWAP!';
export const whatsappLink = (message: string, phone = '') => {
  const number = phone.replace(/[^0-9]/g, '');
  if (!number) return '#';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
