
import React, { useState, useRef } from 'react';
import { X, Save, MapPin, Camera, Trash2, ChevronLeft, Info } from 'lucide-react';
import { RecyclingFacility, Location } from '../types';
import { MATERIAL_TYPES } from '../constants';

interface AddFacilityFormProps {
  onClose: () => void;
  onSave: (facility: Omit<RecyclingFacility, 'id' | 'reviews' | 'status'>) => void;
  currentPos: Location;
  inline?: boolean;
}

const AddFacilityForm: React.FC<AddFacilityFormProps> = ({ onClose, onSave, currentPos, inline }) => {
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
  };

  const containerClasses = inline 
    ? "flex flex-col h-full overflow-hidden" 
    : "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4";
  
  const innerClasses = inline 
    ? "flex flex-col h-full"
    : "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]";

  return (
    <div className={containerClasses}>
      <div className={innerClasses}>
        <div className="p-4 border-b border-green-50 flex items-center justify-between bg-green-50/50 shrink-0">
          <div className="flex items-center gap-2">
            {inline && (
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-green-600">
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-green-900 leading-tight">Add Recycling Spot</h2>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Contribute to the Map</p>
            </div>
          </div>
          {!inline && (
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-blue-800">
            <Info size={20} className="shrink-0" />
            <div className="text-[11px]">
              <p className="font-bold">Community Led</p>
              <p className="opacity-80">Pin the exact location on the map to help others find this facility easily.</p>
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-800">
            <div className="p-2 bg-green-100 rounded-full">
              <MapPin size={18} />
            </div>
            <div className="text-[11px]">
              <p className="font-bold">Selected Coordinates</p>
              <p className="font-mono">{currentPos.lat.toFixed(6)}, {currentPos.lng.toFixed(6)}</p>
              <p className="text-[9px] opacity-60">Click map to adjust pin position</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Facility Photo</label>
            {imageUrl ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-slate-700 hover:bg-green-50"
                  >
                    <Camera size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImageUrl(undefined)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50 transition-all bg-slate-50/50"
              >
                <Camera size={24} />
                <span className="text-[10px] font-bold uppercase">Add Photo</span>
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

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                placeholder="e.g. Green Bin #102"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Address</label>
              <input 
                required
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                placeholder="Street name, neighborhood..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                >
                  <option value="Center">Center</option>
                  <option value="Drop-off">Drop-off</option>
                  <option value="Store">Retail</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hours</label>
                <input 
                  type="text" 
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  placeholder="24/7 or 9-5"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Accepted Materials</label>
              <div className="flex flex-wrap gap-1.5">
                {MATERIAL_TYPES.filter(m => m !== 'Organic').map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMaterial(m)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                      selectedMaterials.includes(m)
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-green-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-2">
            <button 
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Save size={18} />
              Publish Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacilityForm;
