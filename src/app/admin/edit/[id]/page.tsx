'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { adminAPI } from '../../../utilfunctions/api';
import ImageUpload from '../../../components/ImageUpload';
import styles from './edit.module.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className={styles.editorLoading}>Loading editor...</div>
});

import 'react-quill/dist/quill.snow.css';

interface NewsData {
  articleId: string;
  title: string;
  description: string;
  type: string;
  sphoto: string;
  lphoto: string;
}

interface Article extends NewsData {
  id: number;
  date: string;
  deleted?: boolean;
  source?: string;
}

export default function EditNews() {
  const [newsData, setNewsData] = useState<NewsData>({
    articleId: '',
    title: '',
    description: '',
    type: '',
    sphoto: '',
    lphoto: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const response = await adminAPI.getNewsById(token || '', parseInt(articleId));
        
        if (response.success) {
          const article = response.data;
          setNewsData({
            articleId: article.articleId,
            title: article.title,
            description: article.description,
            type: article.type,
            sphoto: article.sphoto || '',
            lphoto: article.lphoto || ''
          });
        } else {
          setError(response.message || 'Failed to fetch article');
        }
      } catch (error) {
        setError('Failed to fetch article');
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [router, articleId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewsData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setNewsData(prev => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!newsData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!newsData.description.trim()) {
      setError('Content is required');
      return;
    }
    if (!newsData.type) {
      setError('Article type is required');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('adminToken');
      const response = await adminAPI.updateNews(token || '', parseInt(articleId), {
        articleId: newsData.articleId,
        title: newsData.title.trim(),
        description: newsData.description,
        type: newsData.type,
        sphoto: newsData.sphoto.trim() || '',
        lphoto: newsData.lphoto.trim() || ''
      });

      if (response.success) {
        setSuccess('News article updated successfully!');
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/admin/manage');
        }, 2000);
      } else {
        setError(response.message || 'Failed to update article');
      }
    } catch (error) {
      setError('Failed to update article');
      console.error('Error updating article:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  if (loading) {
    return <div className={styles.loading}>Loading article...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Edit Article</h1>
          <p className={styles.subtitle}>Update article information and content</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/manage" className={styles.backButton}>
            Back to Manage
          </Link>
          <Link href="/admin" className={styles.dashboardButton}>
            Dashboard
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="articleId" className={styles.label}>
              Article ID *
            </label>
            <input
              type="text"
              id="articleId"
              name="articleId"
              value={newsData.articleId}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter unique article ID..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newsData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter article title..."
              maxLength={255}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>
              Article Type *
            </label>
            <select
              id="type"
              name="type"
              value={newsData.type}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">Select article type</option>
              <option value="finance">Finance</option>
              <option value="market">Market</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="technology">Technology</option>
              <option value="politics">Politics</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <ImageUpload
              label="Small Image URL"
              value={newsData.sphoto}
              onChange={(url) => setNewsData(prev => ({ ...prev, sphoto: url }))}
              placeholder="https://example.com/small-image.jpg"
            />
          </div>

          <div className={styles.formGroup}>
            <ImageUpload
              label="Large Image URL"
              value={newsData.lphoto}
              onChange={(url) => setNewsData(prev => ({ ...prev, lphoto: url }))}
              placeholder="https://example.com/large-image.jpg"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Article Content *
          </label>
          <div className={styles.editorContainer}>
            <ReactQuill
              theme="snow"
              value={newsData.description}
              onChange={handleContentChange}
              modules={quillModules}
              formats={quillFormats}
              className={styles.editor}
              placeholder="Write your article content here..."
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/manage" className={styles.cancelButton}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? 'Updating...' : 'Update Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
