import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StoreDetailView } from "@/components/store/store-detail-view";
import { StoreDetail } from "@/types/store";

async function StoreDetailLoader({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await paramsPromise;
  const supabase = await createClient();

  const { data: store, error } = await supabase
    .from("stores")
    .select("*, categories ( name )")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !store) {
    console.error("Detail toko error:", error?.message, "slug:", slug);
    notFound();
  }

  const [
    { data: isOpenNow },
    { data: photos },
    { data: menus },
    { data: hours },
    { data: reviews },
    { data: tagRows },
  ] = await Promise.all([
    supabase.rpc("is_store_open_now", { p_store_id: store.id }),
    supabase
      .from("store_photos")
      .select("id, path, sort_order")
      .eq("store_id", store.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select("*")
      .eq("store_id", store.id)
      .eq("is_available", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("store_hours")
      .select("id, day_of_week, open_time, close_time, is_closed")
      .eq("store_id", store.id),
    supabase
      .from("reviews")
      .select("id, reviewer_name, rating, comment, created_at")
      .eq("store_id", store.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    supabase
      .from("store_tags")
      .select("tags ( name )")
      .eq("store_id", store.id),
  ]);

  const approvedReviews = reviews ?? [];
  const reviewCount = approvedReviews.length;
  const avgRating =
    reviewCount > 0
      ? Number(
          (
            approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          ).toFixed(1),
        )
      : 0;

  const todayJakarta = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });

  const categoryObj = Array.isArray(store.categories)
    ? store.categories[0]
    : store.categories;

  const moods = (tagRows ?? [])
    .map((row: any) =>
      Array.isArray(row.tags) ? row.tags[0]?.name : row.tags?.name,
    )
    .filter(Boolean);

  const waNumber =
    store.whatsapp || store.whatsapp_number || store.phone || store.no_wa || "";

  const storeDetail: StoreDetail = {
    id: store.id,
    name: store.name,
    slug: store.slug,
    category_name: categoryObj?.name ?? "Kuliner",
    description: store.description ?? null,
    whatsapp: waNumber,
    address: store.address ?? null,
    rt: store.rt ?? null,
    rw: store.rw ?? null,
    maps_url: store.maps_url ?? null,
    instagram_url: store.instagram_url ?? null,
    tiktok_url: store.tiktok_url ?? null,
    price_min: store.price_min ?? null,
    price_max: store.price_max ?? null,
    status: store.status,
    is_open_now: Boolean(isOpenNow),
    special_today:
      store.special_today_date === todayJakarta ? store.special_today : null,
    special_today_date: store.special_today_date ?? null,
    content_updated_at: store.content_updated_at,
    latitude: store.latitude ?? null,
    longitude: store.longitude ?? null,
    avg_rating: avgRating,
    review_count: reviewCount,
    moods,
    photos: photos ?? [],
    menus: menus ?? [],
    hours: hours ?? [],
    reviews: approvedReviews,
  };

  return <StoreDetailView store={storeDetail} />;
}

export default function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6 text-sm text-muted">
          Memuat profil lapak...
        </div>
      }
    >
      <StoreDetailLoader paramsPromise={params} />
    </Suspense>
  );
}
