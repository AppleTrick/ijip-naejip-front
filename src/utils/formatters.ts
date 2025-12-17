export const formatPrice = (price: string | number): string => {
  let value: number
  if (typeof price === 'string') {
    value = parseInt(price.replace(/,/g, ''), 10)
  } else {
    value = price
  }

  if (isNaN(value)) return String(price)

  // Input is in '만원' unit
  if (value >= 10000) {
    // 1억 이상
    const uk = value / 10000
    return `${parseFloat(uk.toFixed(1))}억`
  } else {
    // 1억 미만 (천만원 단위)
    const cheon = value / 1000
    return `${parseFloat(cheon.toFixed(1))}천`
  }
}

/**
 * [가격 파싱]
 * "10억", "10,000만원" 등의 문자열을 숫자(만원 단위)로 변환합니다.
 * 예: "10억" -> 100000, "5,000만원" -> 5000
 */
export const parseKoreanPrice = (priceStr: string): number => {
  const numericString = priceStr.replace(/[^0-9]/g, '')
  const price = parseInt(numericString, 10)
  
  if (isNaN(price)) return 0

  if (priceStr.includes('억')) {
    return price * 10000
  } else {
    return price
  }
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
