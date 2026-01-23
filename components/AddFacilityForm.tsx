
import React, { useState, useRef } from 'react';
import { X, Save, MapPin, AlertCircle, Camera, Trash2 } from 'lucide-react';
import { RecyclingFacility } from '../types';
import { MATERIAL_TYPES } from '../constants';

interface AddFacilityFormProps {
  onClose: () => void;
  onSave: (facility: Omit<RecyclingFacility, 'id' | 'reviews' | 'status'>) => void;
  currentPos: { lat: number, lng: number };
}

const AddFacilityForm: React.FC<AddFacilityFormProps> = ({ onClose, onSave, currentPos }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RecyclingFacility['type']>('Center');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material) 
        : [...prev, material]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || selectedMaterials.length === 0) return;

    onSave({
      name,
      address,
      description,
      location: currentPos,
      materials: selectedMaterials,
      type,
      phone,
      imageUrl,
      isCrowdsourced: true,
      openingHours: openingHours || 'Not specified'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-green-50 flex items-center justify-between bg-green-50/50">
          <div>
            <h2 className="text-xl font-bold text-green-900">Add Recycling Spot</h2>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Help the community grow</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-amber-800">
            <AlertCircle size={20} className="shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Pending Approval</p>
              <p className="opacity-80">New submissions are reviewed by moderators before appearing on the public map.</p>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Facility Photo</label>
            {imageUrl ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden group">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-slate-700 hover:bg-green-50"
                  >
                    <Camera size={20} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImageUrl(undefined)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50 transition-all"
              >
                <Camera size={32} />
                <span className="text-xs font-medium">Upload a photo of the facility</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Facility Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
              placeholder="e.g. Green Bin #102"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Address</label>
            <input 
              required
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
              placeholder="Street name, neighborhood..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm h-20 resize-none"
              placeholder="Tell us more about this place..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Facility Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white"
              >
                <option value="Center">Full Center</option>
                <option value="Drop-off">Drop-off Bin</option>
                <option value="Store">Retail Point</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Opening Hours</label>
              <input 
                type="text" 
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                placeholder="e.g. 24/7 or 9am-5pm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Materials Accepted</label>
            <div className="flex flex-wrap gap-2">
              {MATERIAL_TYPES.filter(m => m !== 'Organic').map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMaterial(m)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${
                    selectedMaterials.includes(m)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-green-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-[10px] flex items-center gap-2">
            <MapPin size={14} className="shrink-0" />
            <span>Map location will be set to the current center: {currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}</span>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Save size={20} />
            Submit for Approval
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFacilityForm;
