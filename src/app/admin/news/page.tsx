'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { adminAPI } from '../../utilfunctions/api';
import styles from './news.module.css';

interface Article {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  article_type: string;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchArticles();
  }, [router]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await adminAPI.getAllNews(token || '');
      if (response.success) {
        setArticles(response.data);
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
        setArticles(articles.filter(article => article.id !== id));
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

  // Filter articles based on search query and type
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || article.article_type === filterType;
    return matchesSearch && matchesType;
  });

  // Get unique article types for filter
  const articleTypes = Array.from(new Set(articles.map(article => article.article_type)));

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  if (loading) {
    return <div className={styles.loading}>Loading articles...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>News Management</h1>
          <p className={styles.subtitle}>Manage all your news articles</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/dashboard" className={styles.backButton}>
            Back to Dashboard
          </Link>
          <Link href="/admin/news/create" className={styles.createButton}>
            Create New Article
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          {articleTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.statsBar}>
        <span>Total Articles: {filteredArticles.length}</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <div className={styles.articlesList}>
        {currentArticles.length === 0 ? (
          <div className={styles.noArticles}>
            {searchQuery || filterType ? 'No articles match your filters' : 'No articles found'}
          </div>
        ) : (
          currentArticles.map(article => (
            <div key={article.id} className={styles.articleCard}>
              <div className={styles.articleImage}>
                {article.image_url ? (
                  <Image 
                    src={article.image_url} 
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
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className={styles.articleMeta}>
                  <span className={styles.articleType}>{article.article_type}</span>
                  <span className={styles.articleDate}>
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.articleActions}>
                <Link 
                  href={`/admin/news/edit/${article.id}`} 
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

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
