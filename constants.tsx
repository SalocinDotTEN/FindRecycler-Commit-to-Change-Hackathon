
import { RecyclingFacility } from './types';

export const INITIAL_FACILITIES: RecyclingFacility[] = [
  {
    id: '1',
    name: 'GreenLife Recycling Center',
    address: '123 Eco Lane, Green City',
    location: { lat: 3.139, lng: 101.6869 },
    materials: ['Plastic', 'Paper', 'Glass', 'Metal'],
    type: 'Center',
    openingHours: '08:00 - 18:00',
    phone: '+60 3-1234 5678',
    description: 'Premier recycling hub in Green City with state-of-the-art sorting facilities.',
    status: 'approved',
    reviews: [
      { id: 'r1', author: 'EcoWarrior', rating: 5, comment: 'Very clean and efficient!', date: '2024-03-15' },
      { id: 'r2', author: 'John Doe', rating: 4, comment: 'Good staff, but can be busy on weekends.', date: '2024-03-10' }
    ]
  },
  {
    id: '2',
    name: 'Neighborhood Paper Bin',
    address: '45 Community Square',
    location: { lat: 3.145, lng: 101.695 },
    materials: ['Paper', 'Cardboard'],
    type: 'Drop-off',
    openingHours: '24/7',
    description: 'A community-managed bin for paper waste only.',
    status: 'approved',
    reviews: []
  },
  {
    id: '3',
    name: 'TechCycle Solutions',
    address: 'Suite 10, Industrial Park',
    location: { lat: 3.125, lng: 101.675 },
    materials: ['E-Waste', 'Batteries'],
    type: 'Store',
    openingHours: '09:00 - 17:00',
    description: 'Specialized in electronic waste and battery disposal.',
    status: 'approved',
    reviews: [
      { id: 'r3', author: 'Alice', rating: 5, comment: 'Finally a place to drop off old laptops.', date: '2024-02-28' }
    ]
  }
];

export const MATERIAL_TYPES = [
  'Plastic',
  'Paper',
  'Glass',
  'Metal',
  'E-Waste',
  'Batteries',
  'Textiles',
  'Organic'
];

export const LOGO_URL = 'https://raw.githubusercontent.com/StackBlitz/stackblitz-images/main/find-recycler-logo.png';
