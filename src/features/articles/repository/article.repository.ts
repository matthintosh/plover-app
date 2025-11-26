import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { Article } from '../service/types';
import type { ArticleRepositoryPort } from './article.repository.interface';

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

  private mapRowToArticle(row: Record<string, unknown>): Article {
    // Convert Supabase Proxy object to plain object to avoid "Indexed property setter" errors
    // Extract values explicitly to work around Supabase Proxy limitations
    const id = String(row.id ?? '');
    const title = String(row.title ?? '');
    const content = String(row.content ?? '');
    const thumbnail_url = row.thumbnail_url ? String(row.thumbnail_url) : null;
    const category = row.category ? String(row.category) : null;
    const published_at = row.published_at ? String(row.published_at) : null;
    const created_at = String(row.created_at ?? '');
    const updated_at = String(row.updated_at ?? '');

    // Ensure publishedAt is always a string (required by Article type)
    // For published articles, published_at should never be null due to DB constraint,
    // but we fallback to created_at as a safety measure
    const publishedAt = published_at ?? created_at;
    
    return {
      id,
      title,
      content,
      thumbnailUrl: thumbnail_url || undefined,
      category: category || undefined,
      publishedAt,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  }
}

