import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveals, declared in markup and driven by one IntersectionObserver (RevealObserver in the root layout).
 * Server-renderable: no client JS per element. CSS in globals.css owns the motion; content is always painted
 * when JS is off, when the observer fails, or under prefers-reduced-motion.
 */
export type RevealKind = "fade" | "text" | "plate" | "wipe" | "line" | "draw" | "count" | "stagger";

const delayStyle = (delay = 0, style?: CSSProperties) => ({ ...style, ["--d" as string]: `${delay}ms` }) as CSSProperties;

type Tag = "div" | "li" | "p" | "figure" | "span" | "ol" | "ul" | "dl" | "section" | "blockquote";

/** Wraps any block in a reveal. `delay` in milliseconds. */
export function Reveal({
  children,
  as: As = "div",
  kind = "fade",
  delay = 0,
  className,
  style,
  id,
}: {
  children: ReactNode;
  as?: Tag;
  kind?: RevealKind;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <As id={id} suppressHydrationWarning data-reveal={kind} className={className} style={delayStyle(delay, style)}>
      {children}
    </As>
  );
}

/** Index helper for `kind="stagger"` children. */
export const staggerIndex = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;

/**
 * Headline text whose words rise out of individual masks. Pass a string, or `lines` for forced line breaks.
 * Words stay real text (selectable, read normally by screen readers).
 */
export function SplitText({
  children,
  lines,
  delay = 0,
  className,
}: {
  children?: string;
  lines?: string[];
  delay?: number;
  className?: string;
}) {
  let n = 0;
  const words = (text: string) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((w, k, arr) => (
        <span key={k}>
          <span className="split-w">
            <span className="split-i" style={{ ["--i" as string]: n++ } as CSSProperties}>
              {w}
            </span>
          </span>
          {k < arr.length - 1 ? " " : null}
        </span>
      ));

  return (
    <span suppressHydrationWarning data-reveal="text" className={cn("block", className)} style={delayStyle(delay)}>
      {lines
        ? lines.map((l, i) => (
            <span key={i} className="block">
              {words(l)}
            </span>
          ))
        : words(children ?? "")}
    </span>
  );
}

const DIGITS = "0123456789".split("");

/**
 * Figures as an odometer: each digit rolls up from zero to its final value, like a lift indicator.
 * The real value is in the DOM for assistive tech; the rolling glyphs are decorative.
 */
export function RollingNumber({ value, delay = 0, className }: { value: string; delay?: number; className?: string }) {
  let d = 0;
  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden suppressHydrationWarning data-reveal="count" className="inline-flex items-start whitespace-pre" style={delayStyle(delay)}>
        {[...value].map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className="odo">
              <span className="odo-strip" style={{ ["--n" as string]: Number(ch), ["--i" as string]: d++ } as CSSProperties}>
                {DIGITS.map((g) => (
                  <span key={g}>{g}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className="odo-ch">
              {ch}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
