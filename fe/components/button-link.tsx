import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type Props = VariantProps<typeof buttonVariants> & {
  href: string;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function ButtonLink({ href, children, className, variant, size, "aria-label": ariaLabel }: Props) {
  return (
    <Link href={href} aria-label={ariaLabel} className={cn(buttonVariants({ variant, size, className }))}>
      {children}
    </Link>
  );
}
