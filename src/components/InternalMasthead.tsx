import Reveal from "@/components/Reveal";

type MastheadFact = {
  label: string;
  value: string;
};

type InternalMastheadProps = {
  index: string;
  eyebrow: string;
  title: string;
  summary: string;
  facts?: MastheadFact[];
};

export default function InternalMasthead({
  index,
  eyebrow,
  title,
  summary,
  facts = [],
}: InternalMastheadProps) {
  return (
    <section className="internal-masthead" aria-labelledby={`page-title-${index}`}>
      <div className="internal-masthead__frame">
        <div className="internal-masthead__rail" aria-hidden="true">
          <span>DEI / {index}</span>
          <span>{eyebrow}</span>
        </div>

        <div className="internal-masthead__copy">
          <Reveal direction="up">
            <p className="internal-masthead__eyebrow">{eyebrow}</p>
            <h1 id={`page-title-${index}`} className="internal-masthead__title">{title}</h1>
          </Reveal>
          <Reveal direction="up" delay={0.06}>
            <p className="internal-masthead__summary">{summary}</p>
          </Reveal>
        </div>

        {facts.length > 0 && (
          <dl className="internal-masthead__facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="internal-masthead__signal" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
