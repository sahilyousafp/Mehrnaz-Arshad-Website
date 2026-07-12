// Edge-to-edge display wordmark: each letter is its own flex item and the row
// is justified, so the name always spans the full available width.

export default function Wordmark({ text, className = "" }: { text: string; className?: string }) {
  const chars = [...text];
  return (
    <div className={`wordmark ${className}`} aria-label={text}>
      {chars.map((c, i) =>
        c === " " ? (
          <span key={i} className="gap" aria-hidden />
        ) : (
          <span key={i} aria-hidden>
            {c}
          </span>
        ),
      )}
    </div>
  );
}
