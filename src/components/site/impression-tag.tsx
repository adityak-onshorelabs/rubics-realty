/** Marks renders/CGI so nobody mistakes them for photographs (MahaRERA and the site's own disclaimer). */
export function ImpressionTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`t-label pointer-events-none absolute bottom-3 start-3 bg-lacquer/80 px-2 py-1 text-[0.62rem] text-ivory ${className}`}
    >
      Artist&apos;s impression
    </span>
  );
}
