import http from './http'

export interface TradeItem {
  id: number
  title: string
  category: string
  price: number
  originalPrice?: number
  condition: string
  location: string
  publisher: string
  publishTime: string
  image: string
  status: string
  likes: number
  description: string
}

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function getTradeById(id: number | string) {
  return http.get<TradeItem>(`/trades/${id}`)
}

export function publishTrade(data: Partial<TradeItem>) {
  return http.post<TradeItem>('/trades', data)
}
