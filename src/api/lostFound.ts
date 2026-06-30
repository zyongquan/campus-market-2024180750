import http from './http'

export interface LostFoundItem {
  id: number
  title: string
  type: 'lost' | 'found'
  category: string
  itemName: string
  location: string
  eventTime: string
  contact: string
  description: string
  image: string
  status: string
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

export function getLostFoundById(id: number | string) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}

export function publishLostFound(data: Partial<LostFoundItem>) {
  return http.post<LostFoundItem>('/lostFounds', data)
}

/** Day4 别名 —— 与 publishLostFound 等价 */
export const createLostFound = publishLostFound
