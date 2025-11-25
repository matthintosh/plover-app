import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { ArticleRepositoryPort } from './article.repository.interface';
import type { Article } from '../service/types';

export class ArticleRepository implements ArticleRepositoryPort {
  async getPublishedArticles(limit?: number, offset?: number): Promise<Article[]> {
    let query = supabase
      .from('article')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (limit !== undefined && offset !== undefined) {
      query = query.range(offset, offset + limit - 1);
    } else if (limit !== undefined) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return [];
    }

    return data.map((row) => this.mapRowToArticle(row));
  }

  async getArticleById(articleId: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('article')
      .select('*')
      .eq('id', articleId)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    // Only return published articles to patients
    if (data.status !== 'published') {
      return null;
    }

    return this.mapRowToArticle(data);
  }

  private mapRowToArticle(row: {
    id: string;
    title: string;
    content: string;
    thumbnail_url: string | null;
    category: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    status: string;
  }): Article {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      thumbnailUrl: row.thumbnail_url || undefined,
      category: row.category || undefined,
      publishedAt: row.published_at || row.created_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

