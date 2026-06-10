interface PageBannerProps {
  badge: string;
  badgeClass?: string;
  title: string;
  lead?: string;
  centered?: boolean;
  leadMaxWidth?: number;
  titleClass?: string;
}

export function PageBanner({
  badge,
  badgeClass = 'bg-secondary text-white',
  title,
  lead,
  centered,
  leadMaxWidth = 560,
  titleClass = 'display-6',
}: PageBannerProps) {
  return (
    <section className={`page-banner${centered ? ' text-center' : ''}`}>
      <span className={`badge rounded-pill ${badgeClass}`}>{badge}</span>
      <h1 className={`${titleClass} fw-bold mt-3`}>{title}</h1>
      {lead && (
        <p
          className={`lead mb-0${centered ? ' mx-auto' : ''}`}
          style={centered ? { maxWidth: leadMaxWidth } : undefined}
        >
          {lead}
        </p>
      )}
    </section>
  );
}
