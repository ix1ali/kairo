/** Splits a headline so each word can lift in. Server-rendered — no JS needed. */
export default function RevealHeadline({
  text,
  className = "",
  wordClass = "",
  delay = 0,
  step = 55,
}: {
  text: string;
  className?: string;
  /** Applied to each word. Gradient text must live here, not on the wrapper:
   *  background-clip:text does not paint through inline-block children. */
  wordClass?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={`reveal-word ${wordClass}`}
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
