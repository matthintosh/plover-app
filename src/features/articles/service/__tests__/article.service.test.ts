import { ArticleService } from '../article.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('ArticleService', () => {
  const createService = ({
    articlesReturnValue = [],
    articleByIdReturnValue = null,
  }: {
    articlesReturnValue?: any[];
    articleByIdReturnValue?: any | null;
  }) => {
    const articleRepository = {
      getPublishedArticles: jest.fn().mockResolvedValue(articlesReturnValue),
      getArticleById: jest.fn().mockResolvedValue(articleByIdReturnValue),
    };

    return {
      service: new ArticleService(articleRepository as any),
      articleRepository,
    };
  };

  describe('getPublishedArticles', () => {
    it('returns articles from repository', async () => {
      const mockArticles = [
        {
          id: 'article-1',
          title: 'Article 1',
          content: 'Content 1',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          category: 'prevention',
          publishedAt: '2025-01-15T10:00:00Z',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        },
      ];

      const { service, articleRepository } = createService({
        articlesReturnValue: mockArticles,
      });

      const result = await service.getPublishedArticles();

      expect(articleRepository.getPublishedArticles).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });

    it('passes pagination parameters to repository', async () => {
      const { service, articleRepository } = createService({});

      await service.getPublishedArticles(10, 20);

      expect(articleRepository.getPublishedArticles).toHaveBeenCalledWith(10, 20);
    });
  });

  describe('getArticleById', () => {
    it('returns article from repository', async () => {
      const mockArticle = {
        id: 'article-1',
        title: 'Article 1',
        content: 'Content 1',
        publishedAt: '2025-01-15T10:00:00Z',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      };

      const { service, articleRepository } = createService({
        articleByIdReturnValue: mockArticle,
      });

      const result = await service.getArticleById('article-1');

      expect(articleRepository.getArticleById).toHaveBeenCalledWith('article-1');
      expect(result).toEqual(mockArticle);
    });

    it('returns null when article not found', async () => {
      const { service } = createService({ articleByIdReturnValue: null });

      const result = await service.getArticleById('non-existent');

      expect(result).toBeNull();
    });
  });
});



