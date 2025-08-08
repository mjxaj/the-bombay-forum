'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { adminAPI } from '../../utilfunctions/api';
import styles from './manage.module.css';

interface Article {
  id: number;
  title: string;
  description: string;
  sphoto?: string;
  lphoto?: string;
  articleId: string;
  type: string;
  date: string;
  deleted?: boolean;
  source?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ManageNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const articlesPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchArticles();
  }, [router, currentPage, searchQuery, filterType]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await adminAPI.getAllNews(token || '', {
        page: currentPage,
        limit: articlesPerPage,
        search: searchQuery,
        type: filterType
      });
      
      if (response.success) {
        setArticles(response.data.articles);
        setPagination(response.data.pagination);
        
        // Extract unique types for filter dropdown (only on first load or when search is empty)
        if (!searchQuery && !filterType) {
          const types = Array.from(new Set(response.data.articles.map((article: Article) => article.type))) as string[];
          setAllTypes(types);
        }
      } else {
        setError(response.message || 'Failed to fetch articles');
      }
    } catch (error) {
      setError('Failed to fetch articles');
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await adminAPI.deleteNews(token || '', id);
      if (response.success) {
        // Refetch articles to update pagination
        fetchArticles();
      } else {
        setError(response.message || 'Failed to delete article');
      }
    } catch (error) {
      setError('Failed to delete article');
      console.error('Error deleting article:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className={styles.loading}>Loading articles...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Manage News</h1>
          <p className={styles.subtitle}>Manage all your news articles</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin" className={styles.backButton}>
            Back to Dashboard
          </Link>
          <Link href="/admin/add" className={styles.createButton}>
            Add New Article
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
        <select
          value={filterType}
          onChange={handleTypeFilter}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          {allTypes.map((type: string) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.statsBar}>
        <span>Total Articles: {pagination?.totalCount || 0}</span>
        <span>Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}</span>
      </div>

      <div className={styles.articlesList}>
        {articles.length === 0 ? (
          <div className={styles.noArticles}>
            {searchQuery || filterType ? 'No articles match your filters' : 'No articles found'}
          </div>
        ) : (
          articles.map((article: Article) => (
            <div key={article.id} className={styles.articleCard}>
              <div className={styles.articleImage}>
                {article.sphoto ? (
                  <Image 
                    src={article.sphoto} 
                    alt={article.title} 
                    width={120} 
                    height={80} 
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.articleInfo}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.articleContent}>
                  {article.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className={styles.articleMeta}>
                  <span className={styles.articleType}>{article.type}</span>
                  <span className={styles.articleDate}>
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.articleActions}>
                <Link 
                  href={`/admin/edit/${article.id}`} 
                  className={styles.editButton}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(article.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(Math.max((pagination?.currentPage || 1) - 1, 1))}
            disabled={!pagination?.hasPrevPage}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(Math.min((pagination?.currentPage || 1) + 1, pagination?.totalPages || 1))}
            disabled={!pagination?.hasNextPage}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
