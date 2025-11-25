import { ArticleRepository } from '../../repository/article.repository';
import { ArticleService } from '../../service/article.service';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('ArticleService - Article Browsing Integration', () => {
  const createService = () => {
    const articleRepository = new ArticleRepository();
    return {
      service: new ArticleService(articleRepository),
      articleRepository,
    };
  };

  it('browses published articles through service', async () => {
    const { service, articleRepository } = createService();

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
      {
        id: 'article-2',
        title: 'Article 2',
        content: 'Content 2',
        publishedAt: '2025-01-16T10:00:00Z',
        createdAt: '2025-01-16T10:00:00Z',
        updatedAt: '2025-01-16T10:00:00Z',
      },
    ];

    jest.spyOn(articleRepository, 'getPublishedArticles').mockResolvedValue(mockArticles);

    const result = await service.getPublishedArticles();

    expect(articleRepository.getPublishedArticles).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('article-1');
    expect(result[1].id).toBe('article-2');
  });

  it('gets article by id through service', async () => {
    const { service, articleRepository } = createService();

    const mockArticle = {
      id: 'article-1',
      title: 'Article 1',
      content: 'Content 1',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      category: 'prevention',
      publishedAt: '2025-01-15T10:00:00Z',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
    };

    jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue(mockArticle);

    const result = await service.getArticleById('article-1');

    expect(articleRepository.getArticleById).toHaveBeenCalledWith('article-1');
    expect(result).toBeTruthy();
    expect(result?.id).toBe('article-1');
    expect(result?.title).toBe('Article 1');
  });

  it('handles pagination through service', async () => {
    const { service, articleRepository } = createService();

    jest.spyOn(articleRepository, 'getPublishedArticles').mockResolvedValue([]);

    await service.getPublishedArticles(10, 20);

    expect(articleRepository.getPublishedArticles).toHaveBeenCalledWith(10, 20);
  });
});



