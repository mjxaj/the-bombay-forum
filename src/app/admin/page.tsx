"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '../utilfunctions/api';
import styles from './admin.module.css';

interface DashboardStats {
  total: number;
  deleted: number;
  byType: Array<{ Type: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboardStats(token);
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to load dashboard statistics');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Admin Dashboard</h1>
          {user && <p className={styles.welcome}>Welcome, {user.name}</p>}
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.quickActions}>
        <Link href="/admin/add" className={styles.actionCard}>
          <h3>Create Article</h3>
          <p>Add a new news article</p>
        </Link>
        <Link href="/admin/manage" className={styles.actionCard}>
          <h3>Manage Articles</h3>
          <p>View and edit existing articles</p>
        </Link>
      </div>

      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Articles</h3>
            <div className={styles.statNumber}>{stats.total}</div>
          </div>
          
          <div className={styles.statCard}>
            <h3>Deleted Articles</h3>
            <div className={styles.statNumber}>{stats.deleted}</div>
          </div>
          
          <div className={styles.statCard}>
            <h3>Active Articles</h3>
            <div className={styles.statNumber}>{stats.total - stats.deleted}</div>
          </div>
          
          <div className={styles.chartCard}>
            <h3>Articles by Type</h3>
            <div className={styles.typeStats}>
              {stats.byType.map((item, index) => (
                <div key={index} className={styles.typeItem}>
                  <span className={styles.typeName}>{item.Type}</span>
                  <span className={styles.typeCount}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.chartCard}>
            <h3>Recent Activity</h3>
            <div className={styles.dailyStats}>
              {stats.dailyStats.slice(0, 10).map((item, index) => (
                <div key={index} className={styles.dailyItem}>
                  <span className={styles.dailyDate}>{item.date}</span>
                  <span className={styles.dailyCount}>{item.count} articles</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
