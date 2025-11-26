import type { Article } from '../service/types';

export interface ArticleRepositoryPort {
  getPublishedArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticleById(articleId: string): Promise<Article | null>;
}





