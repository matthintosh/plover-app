import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { ArticleRepository } from '../article.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('ArticleRepository', () => {
  const createRepository = () => {
    const { supabase } = require('../../../../lib/supabase/client');
    return {
      repository: new ArticleRepository(),
      supabase,
    };
  };

  describe('getPublishedArticles', () => {
    it('returns published articles', async () => {
      const { repository, supabase } = createRepository();
      const mockArticles = [
        {
          id: 'article-1',
          title: 'Article 1',
          content: 'Content 1',
          thumbnail_url: 'https://example.com/thumb1.jpg',
          category: 'prevention',
          published_at: '2025-01-15T10:00:00Z',
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
          status: 'published',
        },
        {
          id: 'article-2',
          title: 'Article 2',
          content: 'Content 2',
          thumbnail_url: null,
          category: null,
          published_at: '2025-01-16T10:00:00Z',
          created_at: '2025-01-16T10:00:00Z',
          updated_at: '2025-01-16T10:00:00Z',
          status: 'published',
        },
      ];

      // Mock the query chain - when no limit/offset, order() returns the final query
      const mockOrder = jest.fn().mockResolvedValue({
        data: mockArticles,
        error: null,
      });
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        order: mockOrder,
      });

      const result = await repository.getPublishedArticles();

      expect(supabase.from).toHaveBeenCalledWith('article');
      expect(mockEq).toHaveBeenCalledWith('status', 'published');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('article-1');
      expect(result[0].title).toBe('Article 1');
    });

    it('applies pagination when limit and offset provided', async () => {
      const { repository, supabase } = createRepository();

      const mockRange = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      const mockOrder = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        order: mockOrder,
      });
      mockOrder.mockReturnValue({
        range: mockRange,
      });

      await repository.getPublishedArticles(10, 20);

      expect(mockRange).toHaveBeenCalledWith(20, 29);
    });

    it('throws error on network failure', async () => {
      const { repository, supabase } = createRepository();

      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Network error' },
      });
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        order: mockOrder,
      });

      await expect(repository.getPublishedArticles()).rejects.toMatchObject({
        code: ErrorCodes.NETWORK_ERROR,
      });
    });
  });

  describe('getArticleById', () => {
    it('returns article when found', async () => {
      const { repository, supabase } = createRepository();
      const mockArticle = {
        id: 'article-1',
        title: 'Article 1',
        content: 'Content 1',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        category: 'prevention',
        published_at: '2025-01-15T10:00:00Z',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
        status: 'published',
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockArticle,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const result = await repository.getArticleById('article-1');

      expect(supabase.from).toHaveBeenCalledWith('article');
      expect(mockEq).toHaveBeenCalledWith('id', 'article-1');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('article-1');
    });

    it('returns null when article not found', async () => {
      const { repository, supabase } = createRepository();

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const result = await repository.getArticleById('non-existent');

      expect(result).toBeNull();
    });
  });
});

