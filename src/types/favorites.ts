export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

export interface FavoritesState {
  items: FavoriteProduct[];
  isInitialized: boolean;
}
