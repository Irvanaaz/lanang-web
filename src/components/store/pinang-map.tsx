"use client";

import React, { useEffect, useRef } from "react";
import { StoreListItem } from "@/types/store";
import { formatPriceRange } from "@/lib/format";

// Pusat koordinat Kelurahan Pinang, Kota Tangerang
const PINANG_CENTER: [number, number] = [-6.2248, 106.6852];

export function PinangMap({ stores }: { stores: StoreListItem[] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: PINANG_CENTER,
        zoom: 16,
        scrollWheelZoom: false, // Mencegah scroll halaman tersangkut saat menggulir ke bawah
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      renderMarkers(L, stores);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Perbarui pin setiap kali filter di beranda berubah
  useEffect(() => {
    async function updateMarkers() {
      if (!mapInstanceRef.current || !markersLayerRef.current) return;
      const L = (await import("leaflet")).default;
      renderMarkers(L, stores);
    }
    updateMarkers();
  }, [stores]);

  function renderMarkers(L: any, storeList: StoreListItem[]) {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const validStores = storeList.filter(
      (s) => typeof s.latitude === "number" && typeof s.longitude === "number",
    );

    validStores.forEach((store) => {
      const pinColor = store.is_open_now ? "#DF6951" : "#78716c";

      const customIcon = L.divIcon({
        className: "lanang-map-pin",
        html: `
          <div style="
            background-color: ${pinColor};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.28);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: #ffffff;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28],
      });

      const statusText = store.is_open_now
        ? '<span style="color:#15803d;font-weight:700;">Buka</span>'
        : '<span style="color:#b91c1c;font-weight:700;">Tutup</span>';

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 175px; padding: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <strong style="font-size:14px; color:#181e4b;">${store.name}</strong>
            <span style="font-size:11px;">${statusText}</span>
          </div>
          <p style="margin:4px 0 2px; font-size:11px; color:#5e6282;">
            ${store.category_name} • ${formatPriceRange(store.price_min, store.price_max)}
          </p>
          <p style="margin:0 0 8px; font-size:11px; color:#5e6282;">
            RT ${store.rt || "-"} / RW ${store.rw || "-"}
          </p>
          <a href="/toko/${store.slug}" style="
            display:inline-block;
            width:100%;
            text-align:center;
            background:#DF6951;
            color:#ffffff;
            font-weight:700;
            font-size:12px;
            padding:6px 10px;
            border-radius:8px;
            text-decoration:none;
          ">
            Lihat lapak
          </a>
        </div>
      `;

      L.marker([store.latitude, store.longitude], { icon: customIcon })
        .bindPopup(popupHtml)
        .addTo(markersLayerRef.current);
    });
  }

  const mappedCount = stores.filter(
    (s) => typeof s.latitude === "number" && typeof s.longitude === "number",
  ).length;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <div>
          <h3 className="font-heading text-base font-bold text-ink">
            Peta Sebaran Lapak Kelurahan Pinang
          </h3>
          <p className="text-xs text-muted">
            Perbesar peta dan klik pin lokasi untuk melihat detail lapak
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
            Buka
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#78716c]" />
            Tutup/Libur
          </span>
          <span className="font-bold text-ink">{mappedCount} titik</span>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="z-10 h-85 w-full sm:h-100"
      />
    </div>
  );
}
