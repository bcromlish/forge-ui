"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SidebarMenuButton } from "../primitives/sidebar";

/** Props for {@link SidebarBack}. */
interface SidebarBackProps {
  /** Target URL to navigate to. */
  href: string;
  /** Optional label text (defaults to "Back"). */
  label?: string;
}

/**
 * Reusable sidebar header back button.
 * Renders a left arrow + label inside a SidebarMenuButton styled as a link.
 * Generic -- not hardcoded to settings; accepts any href.
 */
export function SidebarBack({ href, label = "Back" }: SidebarBackProps) {
  return (
    <Link href={href} className="flex items-center">
      <SidebarMenuButton size="lg" className="w-full">
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span className="text-body font-medium">{label}</span>
      </SidebarMenuButton>
    </Link>
  );
}
