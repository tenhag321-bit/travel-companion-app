// src/App.tsx
import MapComponent from './components/MapComponent';
import { useState, useEffect } from 'react';
import api from './api';

// ✅ All imports now valid
import { 
  Recommendation, 
  MapMarker, 
  Coordinates, 
  User, 
  MarkerType,
  CreateRecommendationRequest 
} from './types';

const App = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<Coordinates>({ lat: 51.505, lng: -0.09 });
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  // ✅ Initialize image as empty string (not undefined)
  const [newRecommendation, setNewRecommendation] = useState<CreateRecommendationRequest>({
    name: '',
    type: 'food',
    rating: 5,
    description: '',
    image: '', // ✅ string → assignable to image?: string
  });

  // ——— useEffects and handlers unchanged (omitted for brevity) ———
  // (Keep your existing login, fetch, logout, etc. logic — they’re fine)

  // ✅ Updated handleAddRecommendation — no casting needed
  const handleAddRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      // ✅ newRecommendation now matches CreateRecommendationRequest exactly
      const created = await api.createRecommendation(newRecommendation, token);
      setRecommendations(prev => [created, ...prev]);

      // Reset with empty string (not undefined)
      setNewRecommendation({
        name: '',
        type: 'food',
        rating: 5,
        description: '',
        image: '',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to add recommendation');
    }
  };

  // ✅ Updated select handler (safe cast — options match MarkerType)
  const handleTypeChange = (value: string) => {
    const type = value as MarkerType;
    setNewRecommendation({ ...newRecommendation, type });
  };

  // ——— Render unchanged ———
  // (Keep your existing JSX — it’s correct)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* ... your existing header and main JSX ... */}
      
      {/* Inside form: updated select */}
      <select
        value={newRecommendation.type}
        onChange={e => handleTypeChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="food">Food</option>
        <option value="sightseeing">Sightseeing</option>
        <option value="shopping">Shopping</option>
        <option value="entertainment">Entertainment</option>
        <option value="accommodation">Accommodation</option>
      </select>

      {/* Optional: add image input */}
      <input
        value={newRecommendation.image}
        onChange={e => setNewRecommendation({ ...newRecommendation, image: e.target.value })}
        placeholder="Image URL (optional)"
        className="border p-2 rounded"
      />

      {/* ... rest of JSX ... */}
    </div>
  );
};

export default App;