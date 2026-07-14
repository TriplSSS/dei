type PageHeaderMeta = {
  label: string;
  value: string;
};

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: PageHeaderMeta[];
  centered?: boolean;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  meta = [],
  centered = false,
}: PageHeaderProps) {
  return (
    <header className={`page-header-v11${centered ? " page-header-v11--centered" : ""}`}>
      <div className="page-header-v11__inner">
        <p className="page-header-v11__eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-header-v11__description">{description}</p>}
        {meta.length > 0 && (
          <dl className="page-header-v11__meta">
            {meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
