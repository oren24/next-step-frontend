export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getServerUrl = () => {
  return API_BASE_URL.replace(/\/api$/, '');
};
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const resumesApi = {
  getAll: () => fetch(`${API_BASE_URL}/resumes`, { headers: getHeaders() }).then(handleResponse),
  getById: (id) => fetch(`${API_BASE_URL}/resumes/${id}`, { headers: getHeaders() }).then(handleResponse),
  create: (data) => {
    const isFormData = data instanceof FormData;
    const headers = getHeaders();
    if (isFormData) delete headers['Content-Type'];
    return fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    }).then(handleResponse);
  },
  update: (id, data) => {
    const isFormData = data instanceof FormData;
    const headers = getHeaders();
    if (isFormData) delete headers['Content-Type'];
    return fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    }).then(handleResponse);
  },
  delete: (id) => fetch(`${API_BASE_URL}/resumes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

export const connectionsApi = {
  getAll: () => fetch(`${API_BASE_URL}/connections`, { headers: getHeaders() }).then(handleResponse),
  getById: (id) => fetch(`${API_BASE_URL}/connections/${id}`, { headers: getHeaders() }).then(handleResponse),
  create: (data) => fetch(`${API_BASE_URL}/connections`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  update: (id, data) => fetch(`${API_BASE_URL}/connections/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (id) => fetch(`${API_BASE_URL}/connections/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

export const applicationsApi = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/applications?${queryString}` : `${API_BASE_URL}/applications`;
    return fetch(url, { headers: getHeaders() }).then(handleResponse);
  },
  getById: (id) => fetch(`${API_BASE_URL}/applications/${id}`, { headers: getHeaders() }).then(handleResponse),
  create: (data) => fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  update: (id, data) => fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (id) => fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

export const authApi = {
  register: (data) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  login: (data) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  oauthLogin: (data) => fetch(`${API_BASE_URL}/auth/oauth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
};
