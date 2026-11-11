import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "text";

const base =
  "group t-label inline-flex min-h-[52px] items-center justify-center gap-3 px-6 transition-colors duration-200 select-none";

export const buttonClass = (variant: Variant = "solid", className?: string) =>
  cn(
    base,
    variant === "solid" &&
      "bg-navy text-ivory hover:bg-lacquer [.on-navy_&]:bg-ivory [.on-navy_&]:text-navy [.on-navy_&]:hover:bg-travertine-2 [.on-lacquer_&]:bg-ivory [.on-lacquer_&]:text-lacquer [.on-lacquer_&]:hover:bg-travertine-2",
    variant === "outline" &&
      "border border-current text-navy hover:bg-navy hover:text-ivory [.on-navy_&]:text-ivory [.on-navy_&]:hover:bg-ivory [.on-navy_&]:hover:text-navy [.on-lacquer_&]:text-ivory [.on-lacquer_&]:hover:bg-ivory [.on-lacquer_&]:hover:text-lacquer",
    variant === "text" && "min-h-11 px-0 text-current",
    className,
  );

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className,
  arrow = true,
  ...rest
}: { href: string; children: ReactNode; variant?: Variant; arrow?: boolean } & Omit<ComponentProps<typeof Link>, "href">) {
  const external = /^(https?:|tel:|mailto:)/.test(href);
  const content = (
    <>
      <span className={cn(variant === "text" && "rule-grow pb-1")}>{children}</span>
      {arrow ? (
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );
  if (external) {
    return (
      <a href={href} className={buttonClass(variant, className)} {...(rest as ComponentProps<"a">)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {content}
    </Link>
  );
}
