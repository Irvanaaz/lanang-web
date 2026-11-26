"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Star,
  Clock,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Flag,
  CheckCircle2,
  UtensilsCrossed,
  CalendarClock,
  Send,
} from "lucide-react";
import { StoreDetail } from "@/types/store";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RelativeTime } from "@/components/ui/relative-time";
import { StoreMonogram } from "@/components/ui/store-monogram";
import {
  formatPriceRange,
  formatRelativeTime,
  formatRupiah,
  getStorePhotoUrl,
} from "@/lib/format";

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function formatWaNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return "62" + digits;
}

export function StoreDetailView({ store }: { store: StoreDetail }) {
  const supabase = createClient();

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // State Form Ulasan
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  // State Modal/Panel Lapor
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState(
    "Nomor WhatsApp tidak aktif",
  );
  const [reportDetail, setReportDetail] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Pastikan sesi anonim & cek status favorit + catat view
  useEffect(() => {
    let active = true;

    async function initBuyerSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      let userId = session?.user?.id;
      if (!userId) {
        const { data } = await supabase.auth.signInAnonymously();
        userId = data.user?.id;
      }

      if (userId && active) {
        const { data: favData } = await supabase
          .from("favorites")
          .select("store_id")
          .eq("user_id", userId)
          .eq("store_id", store.id)
          .maybeSingle();

        if (favData && active) {
          setIsFavorite(true);
        }
      }

      // Catat analitik kunjungan halaman toko
      await supabase.rpc("track_event", {
        p_store_id: store.id,
        p_event_type: "store_view",
      });
    }

    initBuyerSession();

    return () => {
      active = false;
    };
  }, [store.id, supabase]);

  const handleToggleFavorite = async () => {
    setFavLoading(true);
    try {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        const { data } = await supabase.auth.signInAnonymously();
        session = data.session;
      }

      const userId = session?.user?.id;
      if (!userId) return;

      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("store_id", store.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: userId, store_id: store.id });
        setIsFavorite(true);
      }
    } finally {
      setFavLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    supabase.rpc("track_event", {
      p_store_id: store.id,
      p_event_type: "wa_click",
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewFeedback(null);

    try {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        const { data } = await supabase.auth.signInAnonymously();
        session = data.session;
      }

      const userId = session?.user?.id;
      if (!userId) {
        setReviewFeedback("Gagal menyiapkan sesi. Coba muat ulang halaman.");
        return;
      }

      const { error } = await supabase.from("reviews").insert({
        store_id: store.id,
        user_id: userId,
        reviewer_name: reviewerName.trim() || "Warga Pinang",
        rating,
        comment: comment.trim() || null,
      });

      if (error) {
        setReviewFeedback(
          "Kamu sudah pernah mengirim ulasan untuk lapak ini atau terjadi kendala.",
        );
      } else {
        setReviewFeedback(
          "Terima kasih! Ulasanmu berhasil dikirim dan menunggu persetujuan admin.",
        );
        setComment("");
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitting(true);

    try {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        const { data } = await supabase.auth.signInAnonymously();
        session = data.session;
      }

      const userId = session?.user?.id;
      if (!userId) return;

      const { error } = await supabase.from("reports").insert({
        store_id: store.id,
        user_id: userId,
        reason: reportReason,
        detail: reportDetail.trim() || null,
      });

      if (!error) {
        setReportSuccess(true);
        setReportDetail("");
      }
    } finally {
      setReportSubmitting(false);
    }
  };

  const waUrl = `https://wa.me/${formatWaNumber(
    store.whatsapp,
  )}?text=${encodeURIComponent(
    `Halo ${store.name}, saya lihat lapaknya di LANANG (Lapak Pinang). Mau tanya/pesan jajanan...`,
  )}`;

  const mapsLink =
    store.maps_url ||
    (store.latitude && store.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`
      : null);

  const coverUrl =
    store.photos.length > 0 ? getStorePhotoUrl(store.photos[0].path) : null;

  const todayWib = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  ).getDay();

  // Urutkan Senin (1) sampai Minggu (0)
  const orderedHours = [1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
    return (
      store.hours.find((h) => h.day_of_week === dayIdx) || {
        id: `empty-${dayIdx}`,
        day_of_week: dayIdx,
        open_time: null,
        close_time: null,
        is_closed: true,
      }
    );
  });

  return (
    <div className="min-h-screen bg-page pb-24">
      {/* Top Bar Navigasi */}
      <nav className="sticky top-0 z-30 border-b border-line bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Kembali ke Katalog
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={favLoading}
              aria-label={isFavorite ? "Hapus dari favorit" : "Simpan favorit"}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                isFavorite
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-line bg-card text-ink hover:border-brand/50"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-brand" : ""}`}
                strokeWidth={2}
              />
              <span>{isFavorite ? "Tersimpan" : "Favorit"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="mx-auto max-w-5xl px-5 pt-6 md:px-8 md:pt-8">
        {/* Kartu Profil Utama Lapak */}
        <section className="rounded-3xl border border-line bg-card p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={store.name}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover bg-line sm:h-24 sm:w-24"
                />
              ) : (
                <StoreMonogram name={store.name} />
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cream px-3 py-0.5 text-xs font-bold text-brand">
                    {store.category_name}
                  </span>
                  {store.is_open_now ? (
                    <Badge variant="open">Buka Sekarang</Badge>
                  ) : store.status === "holiday" ? (
                    <Badge variant="warning">Sedang Libur</Badge>
                  ) : (
                    <Badge variant="closed">Tutup</Badge>
                  )}
                </div>

                <h1 className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl">
                  {store.name}
                </h1>

                <p className="mt-1 text-xs font-semibold text-muted sm:text-sm">
                  {store.moods.length > 0
                    ? `${store.moods.join(" · ")} • `
                    : ""}
                  <span className="text-ink">
                    {formatPriceRange(store.price_min, store.price_max)}
                  </span>
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1 font-bold text-ink">
                    <Star
                      className="h-4 w-4 fill-sun text-sun"
                      strokeWidth={2}
                    />
                    {store.review_count > 0
                      ? `${store.avg_rating} (${store.review_count} ulasan)`
                      : "Belum ada ulasan"}
                  </span>

                  {(store.rt || store.rw) && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin
                        className="h-3.5 w-3.5 text-brand"
                        strokeWidth={2}
                      />
                      RT {store.rt || "-"} / RW {store.rw || "-"}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                    <RelativeTime isoDate={store.content_updated_at} />
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol CTA Pesan WA & Maps */}
            <div className="flex flex-col gap-2.5 sm:w-64 sm:shrink-0">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-open px-5 py-3.5 font-heading text-sm font-bold text-white shadow-sm transition-all hover:bg-[#166534]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
                Pesan via WhatsApp
              </a>

              {mapsLink && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-page px-4 py-2.5 text-xs font-bold text-ink transition-colors hover:border-brand/50"
                >
                  <MapPin className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                  Buka di Google Maps
                  <ExternalLink className="h-3 w-3 text-muted" />
                </a>
              )}
            </div>
          </div>

          {/* Deskripsi & Alamat Lengkap */}
          {(store.description || store.address) && (
            <div className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-muted">
              {store.description && <p>{store.description}</p>}
              {store.address && (
                <p className="mt-2 text-xs font-semibold text-ink/80">
                  Alamat: {store.address}
                </p>
              )}
            </div>
          )}

          {/* Jajanan Hari Ini */}
          {store.special_today && (
            <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-sun/50 bg-cream/70 px-4 py-3 text-xs font-bold text-ink sm:text-sm">
              <Sparkles
                className="h-5 w-5 shrink-0 text-brand"
                strokeWidth={2}
              />
              <span>Jajanan hari ini: {store.special_today}</span>
            </div>
          )}

          {/* Sosial Media jika ada */}
          {(store.instagram_url || store.tiktok_url) && (
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
              {store.instagram_url && (
                <a
                  href={store.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand hover:underline"
                >
                  Instagram <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {store.tiktok_url && (
                <a
                  href={store.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink hover:underline"
                >
                  TikTok <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
        </section>

        {/* Grid 2 Kolom: Daftar Menu (Kiri) & Jadwal Buka (Kanan) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Daftar Menu */}
          <section className="lg:col-span-7">
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <UtensilsCrossed
                  className="h-5 w-5 text-brand"
                  strokeWidth={2.2}
                />
                <h2 className="font-heading text-lg font-bold text-ink">
                  Daftar Menu ({store.menus.length})
                </h2>
              </div>

              {store.menus.length > 0 ? (
                <div className="mt-4 divide-y divide-line">
                  {store.menus.map((item) => {
                    const itemPhoto = getStorePhotoUrl(item.photo_path);
                    return (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-4 py-3.5 first:pt-1 last:pb-1"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-sm font-bold text-ink sm:text-base">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="mt-0.5 text-xs leading-relaxed text-muted">
                              {item.description}
                            </p>
                          )}
                          <p className="mt-1.5 text-xs font-bold text-brand sm:text-sm">
                            {formatRupiah(item.price)}
                          </p>
                        </div>

                        {itemPhoto && (
                          <img
                            src={itemPhoto}
                            alt={item.name}
                            className="h-16 w-16 shrink-0 rounded-xl object-cover bg-line"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-xs text-muted">
                  Penjual belum menambahkan rincian daftar menu. Silakan tanya
                  langsung lewat WhatsApp.
                </p>
              )}
            </Card>
          </section>

          {/* Jadwal Buka Harian */}
          <section className="lg:col-span-5">
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <CalendarClock
                  className="h-5 w-5 text-brand"
                  strokeWidth={2.2}
                />
                <h2 className="font-heading text-lg font-bold text-ink">
                  Jadwal Buka (WIB)
                </h2>
              </div>

              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
                {orderedHours.map((h) => {
                  const isToday = h.day_of_week === todayWib;
                  return (
                    <li
                      key={h.id}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                        isToday
                          ? "bg-cream/70 font-bold text-ink"
                          : "text-muted"
                      }`}
                    >
                      <span>
                        {DAY_NAMES[h.day_of_week]}
                        {isToday && (
                          <span className="ml-1.5 text-[10px] font-bold text-brand uppercase">
                            (Hari ini)
                          </span>
                        )}
                      </span>
                      <span>
                        {h.is_closed || !h.open_time || !h.close_time
                          ? "Tutup"
                          : `${h.open_time.slice(0, 5)} - ${h.close_time.slice(
                              0,
                              5,
                            )}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        </div>

        {/* Bagian Ulasan Pembeli */}
        <section className="mt-6">
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold text-ink">
              Ulasan Pembeli ({store.review_count})
            </h2>

            {/* Daftar Ulasan yang Sudah Disetujui */}
            {store.reviews.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {store.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-line bg-page/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-ink">
                        {rev.reviewer_name || "Warga Pinang"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-ink">
                        <Star className="h-3.5 w-3.5 fill-sun text-sun" />
                        {rev.rating}/5
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        {rev.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted">
                Belum ada ulasan yang ditampilkan untuk lapak ini. Jadilah yang
                pertama mengulas!
              </p>
            )}

            {/* Form Tulis Ulasan */}
            <form
              onSubmit={handleSubmitReview}
              className="mt-6 border-t border-line pt-5"
            >
              <h3 className="font-heading text-sm font-bold text-ink">
                Tulis Ulasanmu
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted">
                    Nama Panggilan (opsional)
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Contoh: Rina"
                    maxLength={40}
                    className="mt-1 w-full rounded-xl border border-line bg-page px-3.5 py-2 text-xs text-ink focus:border-brand focus:outline-none sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted">
                    Rating
                  </label>
                  <div className="mt-1 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border text-xs font-bold transition-colors ${
                          rating >= num
                            ? "border-sun bg-cream text-ink"
                            : "border-line bg-page text-muted"
                        }`}
                      >
                        {num}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-muted">
                  Komentar Singkat
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan rasa jajanan atau pelayanan lapaknya..."
                  maxLength={300}
                  className="mt-1 w-full rounded-xl border border-line bg-page p-3 text-xs text-ink focus:border-brand focus:outline-none sm:text-sm"
                />
              </div>

              {reviewFeedback && (
                <p className="mt-2 text-xs font-semibold text-brand">
                  {reviewFeedback}
                </p>
              )}

              <div className="mt-3">
                <Button type="submit" disabled={reviewSubmitting}>
                  <Send className="h-3.5 w-3.5" />
                  {reviewSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Tombol & Form Laporkan Lapak */}
        <section className="mt-6 text-center">
          {!showReport ? (
            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted hover:text-closed"
            >
              <Flag className="h-3.5 w-3.5" />
              Laporkan informasi lapak yang tidak sesuai
            </button>
          ) : (
            <Card className="mx-auto max-w-lg text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold text-ink">
                  Laporkan Lapak Ini
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowReport(false);
                    setReportSuccess(false);
                  }}
                  className="text-xs font-bold text-muted hover:text-ink"
                >
                  Tutup
                </button>
              </div>

              {reportSuccess ? (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-open">
                  <CheckCircle2 className="h-4 w-4" />
                  Laporanmu sudah diterima dan akan diperiksa oleh Admin.
                </div>
              ) : (
                <form onSubmit={handleSubmitReport} className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted">
                      Alasan Laporan
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-page px-3 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                    >
                      <option value="Nomor WhatsApp tidak aktif">
                        Nomor WhatsApp tidak aktif
                      </option>
                      <option value="Lapak sudah tutup permanen">
                        Lapak sudah tutup permanen
                      </option>
                      <option value="Lokasi / alamat tidak sesuai">
                        Lokasi / alamat tidak sesuai
                      </option>
                      <option value="Konten tidak pantas">
                        Konten tidak pantas
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted">
                      Keterangan Tambahan (opsional)
                    </label>
                    <textarea
                      rows={2}
                      value={reportDetail}
                      onChange={(e) => setReportDetail(e.target.value)}
                      placeholder="Tuliskan detail singkat..."
                      maxLength={250}
                      className="mt-1 w-full rounded-xl border border-line bg-page p-2.5 text-xs text-ink focus:border-brand focus:outline-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="danger"
                    disabled={reportSubmitting}
                  >
                    {reportSubmitting ? "Mengirim..." : "Kirim Laporan"}
                  </Button>
                </form>
              )}
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
