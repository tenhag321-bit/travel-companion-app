// src/types/index.ts

export type MarkerType = 
  | 'food'
  | 'sightseeing'
  | 'shopping'
  | 'entertainment'
  | 'accommodation';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Recommendation {
  _id: string;
  name: string;
  type: MarkerType;
  rating: number;
  description: string;
  image?: string;
  user: string; // user ID
  createdAt: string; // ISO string
  coordinates?: Coordinates;
}

// For MapComponent — coordinates required
export interface MapMarker {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: MarkerType;
}

// Request DTOs (no auto-generated fields)
export type CreateRecommendationRequest = Omit<
  Recommendation,
  '_id' | 'user' | 'createdAt'
>;