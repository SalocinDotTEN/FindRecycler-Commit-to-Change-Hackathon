
import React, { useState, useEffect, useMemo } from 'react';
import { RecyclingFacility, Location, Review } from './types';
import { INITIAL_FACILITIES } from './constants.tsx';
import RecycleMap from './components/RecycleMap';
import Sidebar from './components/Sidebar';
import AddFacilityForm from './components/AddFacilityForm';
import AIAssistant from './components/AIAssistant';
import Logo from './components/Logo';
import { Search, Loader2, Navigation, Compass, CheckCircle } from 'lucide-react';
import { findFacilitiesNearby } from './services/geminiService';

const App: React.FC = () => {
  const [facilities, setFacilities] = useState<RecyclingFacility[]>(INITIAL_FACILITIES);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 3.139, lng: 101.6869 });
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<RecyclingFacility | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize Geolocation
  useEffect(() => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation failed:", error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFacilitySelect = (facility: RecyclingFacility | null) => {
    setSelectedFacility(facility);
    if (facility) {
      setMapCenter(facility.location);
    }
  };

  const handleAddFacility = (newFacilityData: Omit<RecyclingFacility, 'id' | 'reviews' | 'status'>) => {
    const facility: RecyclingFacility = {
      ...newFacilityData,
      id: Math.random().toString(36).substr(2, 9),
      reviews: [],
      status: 'pending', // Submissions start as pending
    };
    setFacilities(prev => [facility, ...prev]);
    setIsAddModalOpen(false);
    showToast("Submission received! Pending admin approval.");
  };

  const handleAddReview = (facilityId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };

    setFacilities(prev => prev.map(f => {
      if (f.id === facilityId) {
        return { ...f, reviews: [...f.reviews, newReview] };
      }
      return f;
    }));

    // If the currently selected facility is the one being reviewed, update it too
    if (selectedFacility?.id === facilityId) {
      setSelectedFacility(prev => prev ? { ...prev, reviews: [...prev.reviews, newReview] } : null);
    }
    
    showToast("Review posted! Thank you for your feedback.");
  };

  const handleAISearchNearby = async () => {
    if (!userLocation) return;
    setIsSearching(true);
    const { sources } = await findFacilitiesNearby(userLocation.lat, userLocation.lng);
    
    const newFacilities: RecyclingFacility[] = sources.map((src, i) => ({
      id: `ai-${i}-${Date.now()}`,
      name: src.title,
      address: "Verified via Google Maps",
      location: userLocation,
      materials: ['General Recycling'],
      type: 'Center',
      openingHours: 'Check link for hours',
      status: 'approved',
      reviews: []
    }));

    if (newFacilities.length > 0) {
      setFacilities(prev => [...newFacilities, ...prev]);
      showToast(`Found ${newFacilities.length} new locations via AI!`);
    }
    
    setIsSearching(false);
  };

  const filteredFacilities = useMemo(() => {
    let list = facilities;
    if (activeFilter) {
      list = list.filter(f => f.materials.includes(activeFilter));
    }
    return list;
  }, [facilities, activeFilter]);

  return (
    <div className="flex flex-col h-screen bg-green-50 overflow-hidden font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[4000] bg-green-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle size={20} className="text-green-400" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-white border-b border-green-100 px-6 flex items-center justify-between z-10 shadow-sm shrink-0">
        <Logo size="md" />
        
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <input 
            type="text" 
            placeholder="Search city or specific material..." 
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-green-500 transition-all outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleAISearchNearby}
            disabled={isSearching || !userLocation}
            className={`flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50`}
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
            AI Search
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 md:w-96 shrink-0 z-10 shadow-xl">
          <Sidebar 
            facilities={filteredFacilities}
            selectedFacility={selectedFacility}
            onAddClick={() => setIsAddModalOpen(true)}
            onFacilityClick={handleFacilitySelect}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onAddReview={handleAddReview}
          />
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-slate-200">
          {isLoadingLocation && (
            <div className="absolute inset-0 z-[1001] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <Compass size={48} className="text-green-600 animate-spin-slow mb-4" />
              <p className="font-bold text-green-900">Locating you for a greener planet...</p>
            </div>
          )}
          <RecycleMap 
            facilities={filteredFacilities.filter(f => f.status === 'approved')} 
            center={mapCenter} 
            userLocation={userLocation}
            onSelectFacility={handleFacilitySelect}
          />
        </div>
      </main>

      {/* Crowdsourcing Modal */}
      {isAddModalOpen && (
        <AddFacilityForm 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleAddFacility}
          currentPos={mapCenter}
        />
      )}

      {/* AI Eco-Assistant Widget */}
      <AIAssistant />

      {/* Footer Branding for Mobile */}
      <footer className="md:hidden p-2 bg-white border-t border-green-50 text-center text-[10px] text-slate-400">
        &copy; 2024 FindRecycler.com - Responsible Environment
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
