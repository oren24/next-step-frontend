# NextStep Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the Node.js/Express backend using **React Query** (TanStack Query) for efficient data fetching and state management.

---

## Overview

React Query provides:
- **Automatic caching** of API responses
- **Background refetching** to keep data fresh
- **Optimistic updates** for better UX
- **Built-in error handling and retry logic**
- **Request deduplication** to prevent duplicate API calls

---

## Setup React Query

### 1. Install Dependencies

```bash
# In the frontend directory
cd ../
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Create Query Client

**File: `src/api/queryClient.ts`**

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 3. Setup Provider in App

**File: `src/main.jsx` or `src/App.jsx`**

```jsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './api/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

---

## Create API Client

**File: `src/api/client.ts`**

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Create Custom Hooks

### Auth Hooks

**File: `src/api/hooks/useAuth.ts`**

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { AxiosError } from 'axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  token: string;
}

// Login hook
export const useLogin = () => {
  return useMutation<AuthResponse, AxiosError, LoginPayload>(
    async (payload) => {
      const response = await apiClient.post('/auth/login', payload);
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      },
      onError: (error) => {
        console.error('Login failed:', error.response?.data);
      },
    }
  );
};

// Register hook
export const useRegister = () => {
  return useMutation<AuthResponse, AxiosError, RegisterPayload>(
    async (payload) => {
      const response = await apiClient.post('/auth/register', payload);
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      },
    }
  );
};

// Get profile hook
export const useProfile = (enabled = true) => {
  return useQuery(
    ['profile'],
    async () => {
      const response = await apiClient.get('/users/profile');
      return response.data.data;
    },
    { enabled }
  );
};
```

### Job Applications Hooks

**File: `src/api/hooks/useApplications.ts`**

```typescript
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from '../client';
import { AxiosError } from 'axios';

export interface JobApplication {
  id: number;
  user_id: number;
  company_name: string;
  job_title: string;
  job_url?: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'wishlist';
  description?: string;
  applied_date: string;
  created_at: string;
  updated_at: string;
}

interface CreateApplicationPayload {
  company_name: string;
  job_title: string;
  job_url?: string;
  status?: string;
  description?: string;
  applied_date?: string;
}

interface UpdateApplicationPayload {
  company_name?: string;
  job_title?: string;
  status?: string;
  description?: string;
}

// Fetch all applications
export const useApplications = (
  filters?: { status?: string; page?: number; limit?: number },
  options?: UseQueryOptions
) => {
  return useQuery(
    ['applications', filters],
    async () => {
      const response = await apiClient.get('/applications', {
        params: filters,
      });
      return response.data.data;
    },
    { staleTime: 1000 * 60 * 5, ...options }
  );
};

// Fetch single application
export const useApplication = (
  id: number,
  options?: UseQueryOptions
) => {
  return useQuery(
    ['application', id],
    async () => {
      const response = await apiClient.get(`/applications/${id}`);
      return response.data.data;
    },
    { staleTime: 1000 * 60 * 5, ...options }
  );
};

// Create application mutation
export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JobApplication,
    AxiosError,
    CreateApplicationPayload
  >(
    async (payload) => {
      const response = await apiClient.post('/applications', payload);
      return response.data.data;
    },
    {
      onSuccess: (newApp) => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['applications']);
        // Add to cache
        queryClient.setQueryData(['application', newApp.id], newApp);
      },
      onError: (error) => {
        console.error('Create failed:', error.response?.data);
      },
    }
  );
};

// Update application mutation
export const useUpdateApplication = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    JobApplication,
    AxiosError,
    UpdateApplicationPayload
  >(
    async (payload) => {
      const response = await apiClient.put(`/applications/${id}`, payload);
      return response.data.data;
    },
    {
      onSuccess: (updatedApp) => {
        // Update cache
        queryClient.setQueryData(['application', id], updatedApp);
        queryClient.invalidateQueries(['applications']);
      },
    }
  );
};

// Delete application mutation
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>(
    async (id) => {
      await apiClient.delete(`/applications/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['applications']);
      },
    }
  );
};
```

---

## Usage Examples in Components

### Login Component

```tsx
import { useState } from 'react';
import { useLogin } from '../api/hooks/useAuth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginMutation.mutateAsync({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        type="submit"
        disabled={loginMutation.isLoading}
      >
        {loginMutation.isLoading ? 'Logging in...' : 'Login'}
      </button>
      {loginMutation.error && (
        <p className="error">{loginMutation.error.response?.data?.message}</p>
      )}
    </form>
  );
}

export default LoginForm;
```

### Job Applications List

```tsx
import { useApplications } from '../api/hooks/useApplications';

function ApplicationsList() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data: applications, isLoading, error } = useApplications({ status });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading applications</div>;

  return (
    <div>
      <select value={status || ''} onChange={(e) => setStatus(e.target.value || undefined)}>
        <option value="">All Statuses</option>
        <option value="applied">Applied</option>
        <option value="interviewing">Interviewing</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>

      {applications?.map((app) => (
        <div key={app.id}>
          <h3>{app.company_name}</h3>
          <p>{app.job_title}</p>
          <span className={`status-${app.status}`}>{app.status}</span>
        </div>
      ))}
    </div>
  );
}

export default ApplicationsList;
```

### Create Application

```tsx
import { useState } from 'react';
import { useCreateApplication } from '../api/hooks/useApplications';

function AddApplication() {
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    status: 'applied',
  });

  const createMutation = useCreateApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    setFormData({ company_name: '', job_title: '', status: 'applied' });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Company Name"
        value={formData.company_name}
        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Job Title"
        value={formData.job_title}
        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
        required
      />
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      >
        <option value="applied">Applied</option>
        <option value="interviewing">Interviewing</option>
        <option value="offer">Offer</option>
      </select>
      <button type="submit" disabled={createMutation.isLoading}>
        {createMutation.isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}

export default AddApplication;
```

---

## Environment Configuration

**File: `.env`**

```env
VITE_API_URL=http://localhost:5000
```

**File: `.env.production`**

```env
VITE_API_URL=https://api.nextstep.com
```

---

## Best Practices

1. **Query Keys**: Use meaningful, hierarchical keys:
   ```typescript
   // Good
   ['applications', { status: 'applied', page: 1 }]
   ['application', 123]
   
   // Avoid
   ['data']
   ['list']
   ```

2. **Invalidation Strategy**: Invalidate related queries on mutations:
   ```typescript
   // When updating an app, invalidate the list and single app
   queryClient.invalidateQueries(['applications']);
   queryClient.setQueryData(['application', id], updatedApp);
   ```

3. **Error Handling**: Provide user-friendly error messages:
   ```typescript
   {error && (
     <div className="error">
       {error.response?.data?.message || 'An error occurred'}
     </div>
   )}
   ```

4. **Loading States**: Show loading indicators:
   ```typescript
   <button disabled={isLoading || isFetching}>
     {isLoading ? 'Loading...' : 'Submit'}
   </button>
   ```

5. **Cache Management**: Set appropriate `staleTime` and `gcTime`:
   ```typescript
   staleTime: 1000 * 60 * 5,  // 5 min: data stays fresh
   gcTime: 1000 * 60 * 10,    // 10 min: keep in cache
   ```

---

## Debugging

Use React Query DevTools:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

Open browser DevTools and click the React Query tab to:
- View all active queries and mutations
- Inspect cached data
- Trigger refetches
- Monitor network activity

---

For backend architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).
For API endpoints, see [API.md](./API.md).
