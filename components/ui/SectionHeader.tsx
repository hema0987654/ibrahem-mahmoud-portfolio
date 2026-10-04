type Props = {
  index: string;
  label: string;
  title: string;
  intro?: string;
  headingId: string;
};

/** Datasheet-style section header: mono index line, hairline, large title. */
export function SectionHeader({ index, label, title, intro, headingId }: Props) {
  return (
    <div className="reveal">
      <p className="label flex items-center gap-3 text-muted">
        <span className="text-signal">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span>{label}</span>
      </p>
      <h2
        id={headingId}
        className="mt-6 max-w-[18ch] text-title font-semibold leading-[1.02] tracking-[-0.03em]"
      >
        {title}
      </h2>
      {intro ? <p className="mt-6 max-w-[52ch] text-lead text-muted">{intro}</p> : null}
    </div>
  );
}
