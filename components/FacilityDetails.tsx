
import React, { useState } from 'react';
import { RecyclingFacility, Review } from '../types';
import { X, MapPin, Clock, Phone, Info, Star, Send, User, Calendar, ImageIcon } from 'lucide-react';

interface FacilityDetailsProps {
  facility: RecyclingFacility;
  onClose: () => void;
  onAddReview: (facilityId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({ facility, onClose, onAddReview }) => {
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;
    onAddReview(facility.id, {
      author: reviewAuthor,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
  };

  const averageRating = facility.reviews.length > 0 
    ? (facility.reviews.reduce((acc, r) => acc + r.rating, 0) / facility.reviews.length).toFixed(1)
    : 'No ratings';

  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-green-50 flex items-center justify-between sticky top-0 bg-white z-30 shadow-sm">
        <h2 className="text-xl font-bold text-green-900 truncate pr-4">{facility.name}</h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <X size={24} className="text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Photo Header */}
        {facility.imageUrl ? (
          <div className="w-full h-56 relative overflow-hidden bg-slate-100">
            <img 
              src={facility.imageUrl} 
              alt={facility.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-32 bg-green-50 flex flex-col items-center justify-center text-green-200">
            <ImageIcon size={48} />
            <span className="text-xs font-bold mt-1 uppercase tracking-widest opacity-50">No Photo Available</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <Star fill={averageRating !== 'No ratings' ? 'currentColor' : 'none'} size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800">{averageRating} Stars</p>
              <p className="text-slate-500 text-xs">{facility.reviews.length} reviews</p>
            </div>
            <span className={`ml-auto px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              facility.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {facility.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 text-sm">
              <MapPin className="text-green-600 shrink-0" size={18} />
              <span className="text-slate-600">{facility.address}</span>
            </div>
            {facility.openingHours && (
              <div className="flex gap-3 text-sm">
                <Clock className="text-green-600 shrink-0" size={18} />
                <span className="text-slate-600">{facility.openingHours}</span>
              </div>
            )}
            {facility.phone && (
              <div className="flex gap-3 text-sm">
                <Phone className="text-green-600 shrink-0" size={18} />
                <span className="text-slate-600">{facility.phone}</span>
              </div>
            )}
            {facility.description && (
              <div className="flex gap-3 text-sm">
                <Info className="text-green-600 shrink-0" size={18} />
                <span className="text-slate-600 italic">{facility.description}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Accepted Materials</h3>
            <div className="flex flex-wrap gap-2">
              {facility.materials.map(m => (
                <span key={m} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-200">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-slate-50 border-t border-slate-100 p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">Community Reviews</h3>
          
          <form onSubmit={handleSubmitReview} className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm">
            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Share your experience</p>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setReviewRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    size={20} 
                    className={star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} 
                  />
                </button>
              ))}
            </div>
            <input 
              required
              type="text" 
              placeholder="Your Name" 
              value={reviewAuthor}
              onChange={e => setReviewAuthor(e.target.value)}
              className="w-full text-sm p-2 mb-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-green-500"
            />
            <textarea 
              required
              placeholder="Tell others about the facilities, staff, or parking..." 
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              className="w-full text-sm p-2 h-20 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-green-500 resize-none mb-3"
            />
            <button className="w-full py-2 bg-green-600 text-white rounded text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
              <Send size={14} />
              Post Review
            </button>
          </form>

          <div className="space-y-4">
            {facility.reviews.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4 italic">No reviews yet. Be the first!</p>
            ) : (
              [...facility.reviews].reverse().map(review => (
                <div key={review.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{review.author}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={10} className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar size={10} />
                      {review.date}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;
