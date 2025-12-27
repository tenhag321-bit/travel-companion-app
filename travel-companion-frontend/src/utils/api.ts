// src/utils/api.ts
import type {
  AuthResponse,
  DestinationsResponse,
  ItineraryResponse,
  Destination,
  ItineraryItem
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Centralized response handler
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${res.status}`);
  }
  return res.json();
};

export const api = {
  // 🔐 Auth
  login: (email: string, password: string): Promise<AuthResponse> =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  register: (name: string, email: string, password: string): Promise<AuthResponse> =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(handleResponse),

  // 🌍 Destinations (public)
  getDestinations: (search?: string): Promise<DestinationsResponse> => {
    const url = search
      ? `${API_BASE}/destinations?search=${encodeURIComponent(search)}`
      : `${API_BASE}/destinations`;
    return fetch(url).then(handleResponse);
  },

  // 🗺️ Itinerary (protected)
  getItinerary: (token: string): Promise<ItineraryResponse> =>
    fetch(`${API_BASE}/itinerary`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(handleResponse),

  addToItinerary: (item: Omit<ItineraryItem, '_id' | 'createdAt'>, token: string): Promise<ItineraryItem> =>
    fetch(`${API_BASE}/itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item)
    }).then(handleResponse)
};