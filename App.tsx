
import React, { useState, useEffect, useMemo } from 'react';
import { RecyclingFacility, Location, Review } from './types';
import { INITIAL_FACILITIES } from './constants.tsx';
import RecycleMap from './components/RecycleMap';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import Logo from './components/Logo';
import { Search, Compass, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [facilities, setFacilities] = useState<RecyclingFacility[]>(INITIAL_FACILITIES);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 3.139, lng: 101.6869 });
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<RecyclingFacility | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tempLocation, setTempLocation] = useState<Location | null>(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
    if (isAdding) return; // Don't switch selection while adding
    setSelectedFacility(facility);
    if (facility) {
      setMapCenter(facility.location);
    }
  };

  const handleStartAdding = () => {
    setIsAdding(true);
    setSelectedFacility(null);
    setTempLocation(mapCenter);
    showToast("Click on the map to set the location!");
  };

  const handleCancelAdding = () => {
    setIsAdding(false);
    setTempLocation(null);
  };

  const handleAddFacility = (newFacilityData: Omit<RecyclingFacility, 'id' | 'reviews' | 'status'>) => {
    const facility: RecyclingFacility = {
      ...newFacilityData,
      id: Math.random().toString(36).substr(2, 9),
      reviews: [],
      status: 'approved',
    };
    setFacilities(prev => [facility, ...prev]);
    setIsAdding(false);
    setTempLocation(null);
    showToast("Successfully published your recycling spot!");
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

    if (selectedFacility?.id === facilityId) {
      setSelectedFacility(prev => prev ? { ...prev, reviews: [...prev.reviews, newReview] } : null);
    }
    
    showToast("Review posted! Thank you for your feedback.");
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      // Filter by material type if a chip is selected
      const matchesMaterial = activeFilter ? f.materials.includes(activeFilter) : true;
      
      // Filter by text search query (Local data only)
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = searchLower === '' || 
        f.name.toLowerCase().includes(searchLower) || 
        f.address.toLowerCase().includes(searchLower) ||
        f.materials.some(m => m.toLowerCase().includes(searchLower));

      return matchesMaterial && matchesSearch;
    });
  }, [facilities, activeFilter, searchQuery]);

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
        
        <div className="flex-1 max-w-xl mx-8 relative group">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listed facilities by name or material..." 
            className="w-full bg-slate-100 border border-transparent rounded-full py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none shadow-sm group-hover:bg-slate-200/50"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="hidden md:block">
          <div className="text-right">
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Environmentally Conscious</p>
            <p className="text-xs text-slate-400">Find the best spot for your waste</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar / Form Flow */}
        <div className="w-80 md:w-96 shrink-0 z-10 shadow-xl border-r border-green-100 bg-white">
          <Sidebar 
            facilities={filteredFacilities}
            selectedFacility={selectedFacility}
            onAddClick={handleStartAdding}
            onFacilityClick={handleFacilitySelect}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onAddReview={handleAddReview}
            isAdding={isAdding}
            tempLocation={tempLocation}
            onCancelAdd={handleCancelAdding}
            onSaveAdd={handleAddFacility}
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
            facilities={filteredFacilities} 
            center={mapCenter} 
            userLocation={userLocation}
            onSelectFacility={handleFacilitySelect}
            isAdding={isAdding}
            tempLocation={tempLocation}
            onMapClick={(loc) => isAdding && setTempLocation(loc)}
          />
        </div>
      </main>

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
