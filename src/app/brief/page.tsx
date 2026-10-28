import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Brief } from "@/components/forms/Brief";

export const metadata: Metadata = { title: getDictionary().meta.briefTitle };

export default function BriefPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <PageHeader maxWidth={1440} />
      <Brief />
    </div>
  );
}
