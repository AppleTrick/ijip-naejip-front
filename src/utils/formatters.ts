export const formatPrice = (price: string | number): string => {
  if (typeof price === 'number') {
    return `${Math.floor(price / 10000)}억 ${price % 10000 > 0 ? (price % 10000) + '만원' : ''}`
  }
  return price
}

export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}
