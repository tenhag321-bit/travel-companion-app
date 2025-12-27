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
  avatarUrl?: string;
}

export interface Recommendation {
  _id: string;
  name: string;
  type: MarkerType;
  rating: number;
  description: string;
  image?: string; // ✅ optional — string | undefined
  user: string;
  createdAt: string;
  coordinates?: Coordinates;
}

export interface MapMarker {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: MarkerType;
}

// ✅ Explicit request shape — no Omit, no ambiguity
export type CreateRecommendationRequest = {
  name: string;
  type: MarkerType;
  rating: number;
  description: string;
  image?: string; // optional
};