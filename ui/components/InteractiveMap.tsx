import type * as L from 'leaflet';
// Type-only: pulls in the markercluster plugin's augmentation of the
// "leaflet" module (L.MarkerClusterGroup, L.markerClusterGroup, …) without
// emitting a runtime import — only the @types package is installed, the
// plugin itself is loaded at runtime from a CDN <script> tag.
import type {} from 'leaflet.markercluster';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import { MapMarker, MissingPerson, LostItem, CAMEROON_REGIONS } from '@/types';

import { XIcon, MapPinIcon, FilterIcon } from './icons/Icons';

interface InteractiveMapProps {
  persons: MissingPerson[];
  items: LostItem[];
  onSelectPerson?: (person: MissingPerson) => void;
  onSelectItem?: (item: LostItem) => void;
}

// Leaflet (+ the markercluster plugin, whose types augment the "leaflet"
// module) is loaded at runtime from a CDN <script> tag (see loadLeaflet
// below), not bundled — this import is type-only, so no runtime code is
// pulled in.
declare global {
  interface Window {
    L: typeof L;
  }
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  persons,
  items,
  onSelectPerson,
  onSelectItem,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filters, setFilters] = useState({
    showPersons: true,
    showItems: true,
    showMissing: true,
    showUrgent: true,
    showFound: true,
    showLost: true,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load Leaflet CSS and JS
  useEffect(() => {
    const loadLeaflet = async () => {
      // Check if already loaded
      if (window.L) {
        setMapLoaded(true);
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Load MarkerCluster CSS
      const clusterCss = document.createElement('link');
      clusterCss.rel = 'stylesheet';
      clusterCss.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
      document.head.appendChild(clusterCss);

      const clusterDefaultCss = document.createElement('link');
      clusterDefaultCss.rel = 'stylesheet';
      clusterDefaultCss.href =
        'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
      document.head.appendChild(clusterDefaultCss);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        // Load MarkerCluster JS after Leaflet
        const clusterScript = document.createElement('script');
        clusterScript.src =
          'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
        clusterScript.async = true;
        clusterScript.onload = () => setMapLoaded(true);
        document.body.appendChild(clusterScript);
      };
      document.body.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // Center on Cameroon
    const map = L.map(mapRef.current).setView([7.3697, 12.3547], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
    markersRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 10) size = 'medium';
        if (count > 50) size = 'large';

        return L.divIcon({
          html: `<div class="cluster-icon cluster-${size}">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40),
        });
      },
    });

    map.addLayer(markersRef.current);

    // Add custom CSS for clusters
    const style = document.createElement('style');
    style.textContent = `
      .custom-cluster-icon {
        background: transparent !important;
        border: none !important;
      }
      .cluster-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .cluster-small {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #f97316, #ea580c);
        font-size: 12px;
      }
      .cluster-medium {
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        font-size: 14px;
      }
      .cluster-large {
        width: 52px;
        height: 52px;
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
        font-size: 16px;
      }
      .custom-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      }
      .custom-marker:hover {
        transform: scale(1.1);
      }
      .marker-missing { background: #f97316; }
      .marker-urgent { background: #ef4444; animation: pulse 2s infinite; }
      .marker-found { background: #22c55e; }
      .marker-lost { background: #3b82f6; }
      .marker-item { background: #8b5cf6; }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded]);

  // Update markers when data or filters change
  useEffect(() => {
    if (!mapLoaded || !markersRef.current) return;

    const L = window.L;
    const markerGroup = markersRef.current;
    markerGroup.clearLayers();

    // Helper to get coordinates for a region
    const getRegionCoords = (regionName: string) => {
      const region = CAMEROON_REGIONS.find((r) => r.name === regionName);
      if (region) {
        // Add some randomness to avoid overlapping markers
        return {
          lat: region.lat + (Math.random() - 0.5) * 0.5,
          lng: region.lng + (Math.random() - 0.5) * 0.5,
        };
      }
      return null;
    };

    // Add person markers
    if (filters.showPersons) {
      persons.forEach((person) => {
        // Filter by status
        if (person.status === 'found' && !filters.showFound) return;
        if (person.is_urgent && !filters.showUrgent) return;
        if ((person.status === 'missing' || person.status === 'searching') && !filters.showMissing)
          return;

        let lat = person.latitude;
        let lng = person.longitude;

        // If no coordinates, use region center
        if (!lat || !lng) {
          const coords = getRegionCoords(person.region);
          if (coords) {
            lat = coords.lat;
            lng = coords.lng;
          } else {
            return;
          }
        }

        const markerClass = person.is_urgent
          ? 'marker-urgent'
          : person.status === 'found'
            ? 'marker-found'
            : 'marker-missing';

        const icon = L.divIcon({
          html: `<div class="custom-marker ${markerClass}" style="width: 36px; height: 36px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([lat, lng], { icon });

        marker.on('click', () => {
          setSelectedMarker({
            id: person.id,
            type: 'person',
            latitude: lat!,
            longitude: lng!,
            title: person.full_name,
            status: person.status,
            is_urgent: person.is_urgent,
            photo_url: person.photo_url,
            location: person.last_seen_location,
            date: person.last_seen_date,
          });
          if (onSelectPerson) onSelectPerson(person);
        });

        markerGroup.addLayer(marker);
      });
    }

    // Add item markers
    if (filters.showItems) {
      items.forEach((item) => {
        // Filter by status
        if (item.report_type === 'found' && !filters.showFound) return;
        if (item.report_type === 'lost' && !filters.showLost) return;

        let lat = item.latitude;
        let lng = item.longitude;

        // If no coordinates, use region center
        if (!lat || !lng) {
          const coords = getRegionCoords(item.region);
          if (coords) {
            lat = coords.lat;
            lng = coords.lng;
          } else {
            return;
          }
        }

        const markerClass =
          item.report_type === 'found'
            ? 'marker-found'
            : item.is_urgent
              ? 'marker-urgent'
              : 'marker-lost';

        const itemIcon =
          item.item_type === 'document'
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>`;

        const icon = L.divIcon({
          html: `<div class="custom-marker ${markerClass}" style="width: 32px; height: 32px;">
            ${itemIcon}
          </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([lat, lng], { icon });

        marker.on('click', () => {
          setSelectedMarker({
            id: item.id,
            type: 'item',
            latitude: lat!,
            longitude: lng!,
            title: item.item_name,
            status: item.status,
            is_urgent: item.is_urgent,
            photo_url: item.photo_url,
            location: item.location,
            date: item.date_lost_found,
          });
          if (onSelectItem) onSelectItem(item);
        });

        markerGroup.addLayer(marker);
      });
    }
  }, [mapLoaded, persons, items, filters, onSelectPerson, onSelectItem]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: string, type: string) => {
    if (type === 'person') {
      switch (status) {
        case 'missing':
          return 'Disparu(e)';
        case 'urgent':
          return 'Urgent';
        case 'found':
          return 'Retrouvé(e)';
        case 'searching':
          return 'Recherche en cours';
        default:
          return status;
      }
    } else {
      switch (status) {
        case 'lost':
          return 'Perdu';
        case 'found':
          return 'Trouvé';
        case 'claimed':
          return 'Réclamé';
        default:
          return status;
      }
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Carte des signalements
          </h2>
          <p className="text-gray-600">Visualisez tous les cas signalés au Cameroun</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Map Controls */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Legend */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600">Disparu</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-gray-600">Urgent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Retrouvé</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Perdu</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              <FilterIcon size={16} />
              Filtres
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showPersons}
                    onChange={(e) => setFilters((f) => ({ ...f, showPersons: e.target.checked }))}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Personnes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showItems}
                    onChange={(e) => setFilters((f) => ({ ...f, showItems: e.target.checked }))}
                    className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Objets/Documents</span>
                </label>
                <div className="w-px h-6 bg-gray-300"></div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showMissing}
                    onChange={(e) => setFilters((f) => ({ ...f, showMissing: e.target.checked }))}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Disparus</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showUrgent}
                    onChange={(e) => setFilters((f) => ({ ...f, showUrgent: e.target.checked }))}
                    className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Urgents</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showFound}
                    onChange={(e) => setFilters((f) => ({ ...f, showFound: e.target.checked }))}
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Retrouvés</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.showLost}
                    onChange={(e) => setFilters((f) => ({ ...f, showLost: e.target.checked }))}
                    className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Perdus</span>
                </label>
              </div>
            </div>
          )}

          {/* Map Container */}
          <div className="relative">
            <div ref={mapRef} className="w-full h-[500px] z-0" style={{ background: '#e5e7eb' }}>
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de la carte...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Marker Info */}
            {selectedMarker && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-xl shadow-lg p-4 z-[1000]">
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <XIcon size={16} className="text-gray-500" />
                </button>

                <div className="flex gap-3">
                  {selectedMarker.photo_url && (
                    <Image
                      src={selectedMarker.photo_url}
                      alt={selectedMarker.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{selectedMarker.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPinIcon size={14} className="text-orange-500" />
                      <span className="truncate">{selectedMarker.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedMarker.is_urgent
                            ? 'bg-red-100 text-red-700'
                            : selectedMarker.status === 'found'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {getStatusLabel(selectedMarker.status, selectedMarker.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(selectedMarker.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-2xl text-orange-600">
                  {persons.filter((p) => p.status !== 'found').length}
                </div>
                <div className="text-gray-500">Personnes disparues</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">
                  {persons.filter((p) => p.is_urgent && p.status !== 'found').length}
                </div>
                <div className="text-gray-500">Cas urgents</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-blue-600">
                  {items.filter((i) => i.report_type === 'lost' && i.status !== 'claimed').length}
                </div>
                <div className="text-gray-500">Objets perdus</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-purple-600">
                  {items.filter((i) => i.report_type === 'found' && i.status !== 'claimed').length}
                </div>
                <div className="text-gray-500">Objets trouvés</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-green-600">
                  {persons.filter((p) => p.status === 'found').length +
                    items.filter((i) => i.status === 'claimed').length}
                </div>
                <div className="text-gray-500">Cas résolus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
