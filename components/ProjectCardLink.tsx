"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackProjectClick } from "@/lib/analytics";

export default function ProjectCardLink({
  slug,
  client,
  className,
  children,
}: {
  slug: string;
  client: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={className}
      onClick={() => trackProjectClick(slug, client)}
    >
      {children}
    </Link>
  );
}
