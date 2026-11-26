export function formatRupiah(amount: number | null): string {
  if (amount === null || amount === undefined) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceRange(min: number | null, max: number | null): string {
  if (min === null && max === null) return 'Harga bervariasi';
  if (min !== null && max !== null && min !== max) {
    return `${formatRupiah(min)} - ${formatRupiah(max)}`;
  }
  return formatRupiah(min ?? max);
}

export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMins < 60) {
    return `diperbarui ${diffMins} menit lalu`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `diperbarui ${diffHours} jam lalu`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `diperbarui ${diffDays} hari lalu`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  return `diperbarui ${diffMonths} bulan lalu`;
}

export function getStorePhotoUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-photos/${path}`;
}