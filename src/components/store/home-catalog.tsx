"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Search,
  X,
  Shuffle,
  Store,
  Utensils,
  Flame,
  Soup,
  CakeSlice,
  Cookie,
  Beef,
  LayoutGrid,
  ArrowDown,
} from "lucide-react";
import { StoreListItem } from "@/types/store";
import { Chip } from "@/components/ui/chip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoreCard } from "@/components/store/store-card";
import { PinangMap } from "@/components/store/pinang-map";

// Ganti nomor WA Admin di sini jika sudah ada nomor khusus admin LANANG
const ADMIN_WA_URL =
  "https://wa.me/6281234567890?text=Halo%20Admin%20LANANG%20(Lapak%20Pinang)%2C%20saya%20ingin%20bertanya%20seputar%20pendaftaran%20lapak.";

const MOOD_CARDS = [
  {
    label: "Semua Mood",
    desc: "Lihat seluruh jajanan",
    value: "",
    icon: LayoutGrid,
  },
  {
    label: "Manis",
    desc: "Es, kue, & martabak",
    value: "manis",
    icon: CakeSlice,
  },
  {
    label: "Gurih",
    desc: "Gorengan & nasi uduk",
    value: "gurih",
    icon: Cookie,
  },
  {
    label: "Pedas",
    desc: "Seblak & sambal nampol",
    value: "pedas",
    icon: Flame,
  },
  {
    label: "Berkuah",
    desc: "Bakso, mie, & soto",
    value: "berkuah",
    icon: Soup,
  },
  {
    label: "Berat",
    desc: "Makan kenyang siang/malam",
    value: "berat",
    icon: Beef,
  },
];

const BUDGETS = [
  { label: "Semua budget", value: null },
  { label: "Di bawah 10rb", value: 10000 },
  { label: "Di bawah 20rb", value: 20000 },
  { label: "Di bawah 35rb", value: 35000 },
];

export function HomeCatalog({
  initialStores,
}: {
  initialStores: StoreListItem[];
}) {
  const [query, setQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [pickedStore, setPickedStore] = useState<StoreListItem | null>(null);
  const [randomMessage, setRandomMessage] = useState<string | null>(null);

  const filteredStores = useMemo(() => {
    return initialStores.filter((store) => {
      if (onlyOpen && !store.is_open_now) return false;

      if (
        selectedMood &&
        !store.moods.some((m) => m.toLowerCase() === selectedMood.toLowerCase())
      ) {
        return false;
      }

      if (
        selectedBudget !== null &&
        store.price_min !== null &&
        store.price_min > selectedBudget
      ) {
        return false;
      }

      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchName = store.name.toLowerCase().includes(q);
        const matchDesc = store.description?.toLowerCase().includes(q);
        const matchSpecial = store.special_today?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchSpecial) return false;
      }

      return true;
    });
  }, [initialStores, onlyOpen, selectedMood, selectedBudget, query]);

  const handleRandomPick = () => {
    const openCandidates = filteredStores.filter((s) => s.is_open_now);
    if (openCandidates.length === 0) {
      setPickedStore(null);
      setRandomMessage(
        "Belum ada toko yang sedang buka dengan filter ini. Coba ganti mood, budget, atau matikan filter Buka sekarang.",
      );
      return;
    }

    setRandomMessage(null);
    const pool =
      openCandidates.length > 1 && pickedStore
        ? openCandidates.filter((s) => s.id !== pickedStore.id)
        : openCandidates;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setPickedStore(chosen);
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedMood("");
    setSelectedBudget(null);
    setOnlyOpen(false);
    setPickedStore(null);
    setRandomMessage(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden">
      <div>
        {/* Dekorasi Latar Organik ala Jadoo di Pojok Kanan Atas & Kiri Atas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 -z-10 h-110 w-110 rounded-bl-[180px] bg-cream opacity-85 dark:opacity-10 sm:h-140 sm:w-145"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        />

        {/* Navbar Minimalis: Hanya Logo, Hubungi Admin, dan Login */}
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
          <Link href="/" className="group inline-flex flex-col">
            <span className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              <span className="text-brand">LA</span>NANG
              <span className="ml-2 text-xs font-semibold text-muted sm:text-sm">
                Lapak Pinang
              </span>
            </span>
            <span className="text-[11px] font-medium text-muted">
              Lapak Pinang: jajan tinggal klik
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-7">
            <a
              href={ADMIN_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-ink transition-colors hover:text-brand sm:text-sm"
            >
              Hubungi Admin
            </a>

            <Link
              href="/masuk"
              className="rounded-lg border border-ink/30 px-4 py-2 text-xs font-bold text-ink transition-all hover:border-brand hover:bg-brand hover:text-white sm:px-5 sm:text-sm"
            >
              Login
            </Link>
          </div>
        </nav>

        {/* Hero Section 2 Kolom ala Jadoo */}
        <section className="mx-auto max-w-6xl px-5 pt-4 pb-10 md:px-8 md:pt-8 md:pb-14">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Kolom Kiri: Teks & Tombol Acak */}
            <div className="lg:col-span-6">
              <p className="text-xs font-bold tracking-widest text-brand uppercase sm:text-sm">
                Katalog Digital UMKM Kelurahan Pinang
              </p>

              <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-[54px]">
                Hari ini jajan apa? Tinggal{" "}
                <span className="relative inline-block">
                  klik
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 180 12"
                    className="absolute -bottom-1.5 left-0 -z-10 w-full text-brand"
                    fill="none"
                  >
                    <path
                      d="M2 9.5C45 3.5 125 2.5 178 8.5"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                , langsung ketemu
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                Bingung mau makan atau ngemil apa di sekitar Pinang? Tekan
                tombol acak untuk rekomendasi instan yang sedang buka, lalu
                pesan langsung lewat WhatsApp penjual.
              </p>

              {/* Tombol Utama di Tengah Hero: Tombol Acak + Tombol Favorit */}
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={handleRandomPick}
                  className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-sun px-7 py-4 font-heading text-base font-bold text-white shadow-[0_14px_28px_-8px_rgba(241,165,1,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#e09800] active:translate-y-0"
                >
                  <Sparkles className="h-5 w-5" strokeWidth={2.2} />
                  Acak jajanan
                </button>

                <Link
                  href="/favorit"
                  className="group inline-flex items-center gap-3 text-sm font-semibold text-muted transition-colors hover:text-ink"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-[0_10px_20px_-5px_rgba(223,105,81,0.55)] transition-transform group-hover:scale-105">
                    <Heart className="h-5 w-5 fill-white" strokeWidth={2} />
                  </span>
                  <span>Favorit saya</span>
                </Link>
              </div>
            </div>

            {/* Kolom Kanan: Kartu Visual Melayang Bersih */}
            <div className="relative lg:col-span-6">
              <div className="mx-auto max-w-md rounded-3xl border border-line bg-card p-6 shadow-[0_24px_60px_-15px_rgba(24,30,75,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-bold text-brand">
                    <Utensils className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Kurasi Lapak Lokal
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    {initialStores.length} Lapak Aktif
                  </span>
                </div>

                <h2 className="mt-4 font-heading text-xl font-bold text-ink">
                  Jajanan Asli Warga Pinang
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Tanpa biaya tambahan aplikasi. Harga jujur langsung dari
                  pedagang sekitar RT/RW Kelurahan Pinang.
                </p>

                {/* Preview 2 lapak teratas */}
                <div className="mt-4 space-y-2.5">
                  {initialStores.slice(0, 2).map((item) => (
                    <Link
                      key={item.id}
                      href={`/toko/${item.slug}`}
                      className="flex items-center justify-between rounded-2xl border border-line bg-page/60 p-3 transition-colors hover:border-brand/40"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-heading text-sm font-bold text-ink">
                          {item.name}
                        </p>
                        <p className="truncate text-[11px] text-muted">
                          {item.moods.join(" · ")} • RT {item.rt}/RW {item.rw}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          item.is_open_now
                            ? "bg-open/15 text-open"
                            : "bg-closed/15 text-closed"
                        }`}
                      >
                        {item.is_open_now ? "Buka" : "Tutup"}
                      </span>
                    </Link>
                  ))}
                </div>

                <a
                  href="#katalog-lapak"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink/5 py-2.5 text-xs font-bold text-ink transition-colors hover:bg-ink/10"
                >
                  Jelajahi semua lapak
                  <ArrowDown className="h-3.5 w-3.5" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Hasil Pilihan Acak (Muncul saat tombol Acak jajanan diklik) */}
        {(pickedStore || randomMessage) && (
          <section className="mx-auto max-w-6xl px-5 pb-10 md:px-8">
            {pickedStore && (
              <div className="rounded-3xl border-2 border-sun bg-cream/40 p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-heading text-base font-bold text-brand sm:text-lg">
                    <Shuffle className="h-5 w-5" strokeWidth={2.2} />
                    Pilihan acak untukmu hari ini
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickedStore(null)}
                    className="rounded-lg px-3 py-1 text-xs font-bold text-muted hover:bg-black/5 hover:text-ink"
                  >
                    Tutup
                  </button>
                </div>
                <div className="max-w-xl">
                  <StoreCard store={pickedStore} highlighted />
                </div>
              </div>
            )}

            {randomMessage && (
              <Card className="border-sun bg-cream/50 text-xs text-ink sm:text-sm">
                <p>{randomMessage}</p>
              </Card>
            )}
          </section>
        )}

        {/* Bagian Kategori / Mood */}
        <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
          <div className="text-center">
            <p className="text-xs font-bold tracking-widest text-muted uppercase">
              Pilih Sesuai Selera
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">
              Mau Jajan Apa Hari Ini?
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {MOOD_CARDS.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMood === item.value;
              return (
                <div key={item.label} className="relative">
                  {isActive && (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-2.5 -left-2.5 -z-10 h-14 w-14 rounded-tl-2xl rounded-br-2xl bg-brand"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedMood(item.value)}
                    className={`flex h-full w-full cursor-pointer flex-col items-center rounded-3xl p-5 text-center transition-all duration-200 ${
                      isActive
                        ? "bg-card shadow-[0_20px_45px_-12px_rgba(24,30,75,0.14)] ring-1 ring-line"
                        : "bg-card/60 hover:bg-card hover:shadow-[0_15px_35px_-12px_rgba(24,30,75,0.08)]"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                        isActive
                          ? "bg-cream text-brand"
                          : "bg-ink/5 text-ink"
                      }`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mt-3.5 font-heading text-sm font-bold text-ink">
                      {item.label}
                    </h3>
                    <p className="mt-1 text-[11px] leading-snug text-muted">
                      {item.desc}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bagian Daftar Lapak, Pencarian, lalu Peta di Bawah */}
        <section
          id="katalog-lapak"
          className="mx-auto max-w-6xl px-5 pt-6 pb-20 md:px-8"
        >
          {/* Kotak Pencarian & Filter */}
          <div className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-4 shadow-xs sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
                strokeWidth={2}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama lapak atau menu (contoh: seblak, ayam bakar)..."
                className="w-full rounded-xl border border-line bg-page py-2.5 pr-9 pl-10 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible sm:pb-0">
              <Chip
                active={onlyOpen}
                onClick={() => setOnlyOpen((prev) => !prev)}
              >
                Buka sekarang
              </Chip>

              {BUDGETS.map((budget) => (
                <Chip
                  key={budget.label}
                  active={selectedBudget === budget.value}
                  onClick={() => setSelectedBudget(budget.value)}
                >
                  {budget.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Info Jumlah Lapak */}
          <div className="mt-6 mb-4 flex items-center justify-between text-xs text-muted sm:text-sm">
            <span>
              Menampilkan{" "}
              <strong className="text-ink">{filteredStores.length}</strong>{" "}
              lapak kuliner di Pinang
            </span>
            {(query || selectedMood || selectedBudget !== null || onlyOpen) && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-bold text-brand hover:underline"
              >
                Atur ulang filter
              </button>
            )}
          </div>

          {/* Grid Kartu Toko */}
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <Card className="py-14 text-center">
              <Store className="mx-auto h-10 w-10 text-muted" strokeWidth={2} />
              <p className="mt-3 font-heading text-base font-bold text-ink">
                Belum ada yang cocok
              </p>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                Coba ganti mood, naikkan budget, atau atur ulang pencarianmu.
              </p>
              <div className="mt-5">
                <Button variant="outline" onClick={resetFilters}>
                  Atur ulang filter
                </Button>
              </div>
            </Card>
          )}

          {/* Peta Sebaran Lapak Kelurahan Pinang (Di Bawah Daftar Lapak) */}
          <div className="mt-10">
            <PinangMap stores={filteredStores} />
          </div>
        </section>
      </div>

      {/* Footer Profesional */}
      <footer className="border-t border-line bg-card/80">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Kolom Brand & Deskripsi */}
            <div className="md:col-span-5">
              <div className="font-heading text-2xl font-bold tracking-tight text-ink">
                <span className="text-brand">LA</span>NANG
                <span className="ml-2 text-xs font-semibold text-muted">
                  Lapak Pinang
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-brand">
                Lapak Pinang: jajan tinggal klik
              </p>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">
                Platform katalog digital UMKM kuliner di Kelurahan Pinang untuk
                memudahkan warga menemukan jajanan lokal dan terhubung langsung
                dengan pedagang.
              </p>
            </div>

            {/* Kolom Navigasi */}
            <div className="md:col-span-3">
              <h3 className="font-heading text-sm font-bold text-ink">
                Menu Utama
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-muted">
                <li>
                  <a href="#katalog-lapak" className="hover:text-brand">
                    Daftar Lapak Kuliner
                  </a>
                </li>
                <li>
                  <Link href="/favorit" className="hover:text-brand">
                    Lapak Favorit Saya
                  </Link>
                </li>
                <li>
                  <Link href="/masuk" className="hover:text-brand">
                    Login Penjual & Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom Bantuan & Legal */}
            <div className="md:col-span-4">
              <h3 className="font-heading text-sm font-bold text-ink">
                Bantuan & Informasi
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-muted">
                <li>
                  <a
                    href={ADMIN_WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand"
                  >
                    Daftarkan Lapak / Hubungi Admin
                  </a>
                </li>
                <li>
                  <Link href="/privasi" className="hover:text-brand">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/syarat" className="hover:text-brand">
                    Syarat Penggunaan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer & Hak Cipta */}
          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-[11px] text-muted sm:flex-row sm:items-center">
            <p>
              LANANG, Lapak Pinang tidak memproses pembayaran dan tidak
              bertanggung jawab atas transaksi di luar aplikasi.
            </p>
            <p className="shrink-0">
              &copy; {new Date().getFullYear()} LANANG, Lapak Pinang.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
