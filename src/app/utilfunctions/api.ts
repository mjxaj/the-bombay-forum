const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    ...options,
  };

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  } else {
    defaultOptions.headers = {
      ...options.headers,
    };
  }

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.error || `API call failed: ${response.status} ${response.statusText}`,
        data: null
      };
    }
    
    // For admin endpoints, wrap in consistent format
    if (endpoint.includes('/admin/')) {
      return {
        success: true,
        data: data,
        message: data.message || 'Success'
      };
    }
    
    // For regular endpoints, return data directly for backward compatibility
    return data;
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
      data: null
    };
  }
}

// Article API calls
export const articleAPI = {
  // Get articles with search and filters
  getArticles: (params: {
    query?: string;
    articleId?: string;
    articleType?: string;
    num?: number;
    sortBy?: string;
    order?: string;
    randomize?: boolean;
    fullDescription?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall(`/api/searcharticles?${searchParams.toString()}`);
  },

  // Get title suggestions
  getTitleSuggestions: (query: string, num: number = 10) => {
    return apiCall(`/api/suggestions?query=${encodeURIComponent(query)}&num=${num}`);
  },
};

// Admin API calls
export const adminAPI = {
  // Login
  login: (email: string, password: string) => {
    return apiCall('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then(response => {
      // Backend returns { success: true, token, user } directly
      if (response.success && response.data) {
        return {
          success: true,
          token: response.data.token,
          user: response.data.user,
          message: response.message
        };
      }
      return response;
    });
  },

  // Dashboard stats
  getDashboardStats: (token: string) => {
    return apiCall('/api/admin/dashboard/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Create news
  createNews: (token: string, newsData: any) => {
    return apiCall('/api/admin/news', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newsData),
    });
  },

  // Get all news for admin
  getAllNews: (token: string, params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall(`/api/admin/news?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get single news by ID
  getNewsById: (token: string, id: number) => {
    return apiCall(`/api/admin/news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update news
  updateNews: (token: string, id: number, updateData: any) => {
    return apiCall(`/api/admin/news/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
  },

  // Delete news
  deleteNews: (token: string, id: number) => {
    return apiCall(`/api/admin/news/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Upload image
  uploadImage: (token: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiCall('/api/admin/upload-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let browser set it for FormData
      },
      body: formData,
    });
  },

  // Delete image
  deleteImage: (token: string, imageUrl: string) => {
    return apiCall('/api/admin/delete-image', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });
  },
};

export default apiCall;
