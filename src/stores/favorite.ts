import { defineStore } from 'pinia'

export interface FavoriteItem {
  id: number | string
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  title: string
  description: string
  location?: string
  image?: string
  price?: number
}

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: [] as FavoriteItem[],
  }),

  getters: {
    favoriteCount: (state) => state.favorites.length,

    /** 按类型筛选收藏 */
    favoritesByType: (state) => {
      return (type: FavoriteItem['type']) =>
        state.favorites.filter((item) => item.type === type)
    },
  },

  actions: {
    isFavorite(type: FavoriteItem['type'], id: number | string) {
      return this.favorites.some((item) => item.type === type && item.id === id)
    },

    addFavorite(item: FavoriteItem) {
      if (!this.isFavorite(item.type, item.id)) {
        this.favorites.push(item)
      }
    },

    removeFavorite(type: FavoriteItem['type'], id: number | string) {
      this.favorites = this.favorites.filter((item) => {
        return !(item.type === type && item.id === id)
      })
    },

    toggleFavorite(item: FavoriteItem) {
      if (this.isFavorite(item.type, item.id)) {
        this.removeFavorite(item.type, item.id)
      } else {
        this.addFavorite(item)
      }
    },
  },
})
