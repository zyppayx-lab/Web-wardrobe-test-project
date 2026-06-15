export interface Post {
  id: string;

  title: string;

  slug: string;

  category: string;

  tags: string[];

  excerpt: string;

  content: string;

  imageUrl: string;

  affiliateLink?: string;

  authorId: string;

  authorName: string;

  views: number;

  shares: number;

  likes: number;

  createdAt: string;

  updatedAt: string;

  published: boolean;
}
