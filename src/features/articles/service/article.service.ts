import type { ArticleRepositoryPort } from '../repository/article.repository.interface';
import { ArticleRepository } from '../repository/article.repository';
import type { Article } from './types';

export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepositoryPort = new ArticleRepository(),
  ) {}

  async getPublishedArticles(limit?: number, offset?: number): Promise<Article[]> {
    return await this.articleRepository.getPublishedArticles(limit, offset);
  }

  async getArticleById(articleId: string): Promise<Article | null> {
    return await this.articleRepository.getArticleById(articleId);
  }
}



