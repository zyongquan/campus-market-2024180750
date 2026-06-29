import http from './http'

export interface ErrandItem {
  id: number
  title: string
  taskType: string
  reward: number
  from: string
  to: string
  deadline: string
  publisher: string
  description: string
  image: string
  tags: string[]
  urgency: 'urgent' | 'normal'
  status: string
}

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

export function getErrandById(id: number | string) {
  return http.get<ErrandItem>(`/errands/${id}`)
}

export function publishErrand(data: Partial<ErrandItem>) {
  return http.post<ErrandItem>('/errands', data)
}
