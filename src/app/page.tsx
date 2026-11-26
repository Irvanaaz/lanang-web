import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { HomeCatalog } from "@/components/store/home-catalog";
import { StoreListItem } from "@/types/store";

async function CatalogContent() {
  await connection();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_stores", {
    q: null,
    mood: null,
    budget_max: null,
    only_open: false,
    random_pick: false,
  });

  if (error) {
    console.error("Gagal memuat daftar toko:", error.message);
  }

  const stores: StoreListItem[] = (data as StoreListItem[]) ?? [];

  return <HomeCatalog initialStores={stores} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center p-6 text-sm text-muted">
          Memuat daftar lapak di Pinang...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
