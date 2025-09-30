export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  title: string;
  text: string;
  photo?: string;
  recommend: boolean;
}
