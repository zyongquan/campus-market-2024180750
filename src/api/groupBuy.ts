import http from './http'

export interface GroupBuyItem {
  id: number
  title: string
  type: 'group' | 'partner' | 'team'
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  price?: number
  tags: string[]
  description: string
  image: string
  status: string
}

export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

export function getGroupBuyById(id: number | string) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}

export function publishGroupBuy(data: Partial<GroupBuyItem>) {
  return http.post<GroupBuyItem>('/groupBuys', data)
}

/** Day4 别名 —— 与 publishGroupBuy 等价 */
export const createGroupBuy = publishGroupBuy
