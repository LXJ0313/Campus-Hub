import { Activity, SearchResult, Registration } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }
  return response.json();
}

export async function fetchActivities(category?: string): Promise<Activity[]> {
  const url = category
    ? `${API_BASE}/activities?category=${encodeURIComponent(category)}`
    : `${API_BASE}/activities`;
  const response = await fetch(url);
  return handleResponse<Activity[]>(response);
}

export async function fetchActivity(activityId: string): Promise<Activity> {
  const response = await fetch(`${API_BASE}/activities/${activityId}`);
  return handleResponse<Activity>(response);
}

export async function fetchFavorites(): Promise<Activity[]> {
  const response = await fetch(`${API_BASE}/favorites`);
  return handleResponse<Activity[]>(response);
}

export async function createFavorite(activityId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activity_id: activityId }),
  });
  return handleResponse<void>(response);
}

export async function removeFavorite(activityId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites/${activityId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

export async function fetchRegistrations(): Promise<Activity[]> {
  const response = await fetch(`${API_BASE}/registrations`);
  return handleResponse<Activity[]>(response);
}

export async function createRegistration(activityId: string): Promise<Registration> {
  const response = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activity_id: activityId }),
  });
  return handleResponse<Registration>(response);
}

export async function removeRegistration(activityId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/registrations/${activityId}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

export async function searchActivities(query: string, category?: string): Promise<SearchResult> {
  const url = new URL(`${API_BASE}/search`);
  url.searchParams.append('q', query);
  if (category) url.searchParams.append('category', category);
  const response = await fetch(url.toString());
  return handleResponse<SearchResult>(response);
}

export async function aiSearch(query: string, category?: string): Promise<SearchResult> {
  const body: { query: string; category?: string } = { query };
  if (category) body.category = category;
  const response = await fetch(`${API_BASE}/search/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<SearchResult>(response);
}
