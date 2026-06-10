const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

const getHeaders = () => {
  // If you switch to JWT, add token here:
  // const token = localStorage.getItem('token');
  // return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  return { 'Content-Type': 'application/json' };
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
