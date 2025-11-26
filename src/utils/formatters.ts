export const formatPrice = (price: string | number): string => {
  let value: number
  if (typeof price === 'string') {
    value = parseInt(price.replace(/,/g, ''), 10)
  } else {
    value = price
  }

  if (isNaN(value)) return String(price)

  const uk = Math.floor(value / 10000)
  const man = value % 10000

  let result = ''
  if (uk > 0) result += `${uk}억`
  if (man > 0) {
    result += ` ${man}만원`
  } else if (uk > 0) {
    result += '원'
  }
  
  return result.trim() || '0원'
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
