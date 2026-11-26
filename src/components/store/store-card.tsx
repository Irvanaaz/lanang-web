import Link from 'next/link';
import { MapPin, Star, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { StoreListItem } from '@/types/store';
import { Badge } from '@/components/ui/badge';
import { StoreMonogram } from '@/components/ui/store-monogram';
import { RelativeTime } from '@/components/ui/relative-time';
import { formatPriceRange, getStorePhotoUrl } from '@/lib/format';

export function StoreCard({
  store,
  highlighted = false,
}: {
  store: StoreListItem;
  highlighted?: boolean;
}) {
  const photoUrl = getStorePhotoUrl(store.cover_photo);

  const statusBadge = () => {
    if (store.is_open_now) {
      return <Badge variant="open">Buka</Badge>;
    }
    if (store.status === 'holiday') {
      return <Badge variant="warning">Libur</Badge>;
    }
    return <Badge variant="closed">Tutup</Badge>;
  };

  return (
    <Link href={`/toko/${store.slug}`} className="group block h-full">
      <article
        className={`flex h-full flex-col justify-between rounded-2xl border bg-card p-5 transition-all duration-200 ${
          highlighted
            ? 'border-[#ffb81c] ring-2 ring-[#ffb81c]/40 shadow-md'
            : 'border-line shadow-xs hover:-translate-y-0.5 hover:border-[#e8590c]/40 hover:shadow-md'
        }`}
      >
        <div>
          <div className="flex items-start gap-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={store.name}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover bg-line"
              />
            ) : (
              <StoreMonogram name={store.name} />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="line-clamp-1 font-heading text-lg font-bold text-ink transition-colors group-hover:text-[#e8590c]">
                  {store.name}
                </h2>
                {statusBadge()}
              </div>

              <p className="mt-1 text-xs font-medium text-muted">
                {store.moods.length > 0 ? `${store.moods.join(' · ')} • ` : ''}
                <span className="text-ink/80">
                  {formatPriceRange(store.price_min, store.price_max)}
                </span>
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1 font-bold text-ink">
                  <Star
                    className="h-3.5 w-3.5 fill-[#ffb81c] text-[#ffb81c]"
                    strokeWidth={2}
                  />
                  {store.review_count > 0
                    ? `${store.avg_rating} (${store.review_count})`
                    : 'Baru'}
                </span>

                {(store.rt || store.rw) && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#e8590c]" strokeWidth={2} />
                    RT {store.rt || '-'} / RW {store.rw || '-'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {store.description && (
            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
              {store.description}
            </p>
          )}

          {store.special_today && (
            <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-[#ffb81c]/40 bg-[#ffb81c]/12 px-3 py-2 text-xs font-semibold text-ink">
              <Sparkles
                className="h-4 w-4 shrink-0 text-[#e8590c]"
                strokeWidth={2}
              />
              <span className="truncate">
                Hari ini: {store.special_today}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted">
          <span className="font-semibold text-ink/75">{store.category_name}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={2} />
            <RelativeTime isoDate={store.content_updated_at} />
            <ChevronRight className="ml-0.5 h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-[#e8590c]" />
          </span>
        </div>
      </article>
    </Link>
  );
}