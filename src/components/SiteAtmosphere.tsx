export function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <span className="site-atmosphere__aurora site-atmosphere__aurora--primary" />
      <span className="site-atmosphere__aurora site-atmosphere__aurora--secondary" />

      <svg
        className="site-atmosphere__field"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="site-field-red" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="0.26" stopColor="var(--color-primary)" stopOpacity="0.09" />
            <stop offset="0.58" stopColor="var(--color-primary-hover)" stopOpacity="0.22" />
            <stop offset="0.82" stopColor="var(--color-primary-deep)" stopOpacity="0.08" />
            <stop offset="1" stopColor="var(--color-primary-deep)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="site-field-white" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-text)" stopOpacity="0" />
            <stop offset="0.46" stopColor="var(--color-text)" stopOpacity="0.035" />
            <stop offset="0.7" stopColor="var(--color-primary-hover)" stopOpacity="0.1" />
            <stop offset="1" stopColor="var(--color-primary-hover)" stopOpacity="0" />
          </linearGradient>
          <filter id="site-field-glow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <g className="site-atmosphere__field-lines">
          <path
            className="site-atmosphere__field-glow"
            d="M-190 742 C210 566 548 644 876 758 C1194 868 1442 838 1780 608"
            stroke="url(#site-field-red)"
            filter="url(#site-field-glow)"
          />
          <path
            className="site-atmosphere__field-line"
            d="M-190 742 C210 566 548 644 876 758 C1194 868 1442 838 1780 608"
            stroke="url(#site-field-red)"
          />
          <path
            className="site-atmosphere__field-line site-atmosphere__field-line--quiet"
            d="M-220 164 C178 294 430 58 786 144 C1134 228 1338 324 1774 74"
            stroke="url(#site-field-white)"
          />
          <path
            className="site-atmosphere__field-pulse"
            d="M-190 742 C210 566 548 644 876 758 C1194 868 1442 838 1780 608"
            stroke="url(#site-field-red)"
          />
        </g>
      </svg>
    </div>
  );
}
