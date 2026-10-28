import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { ContactDrawerProvider } from "@/components/layout/ContactDrawer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BlogList } from "@/components/blog/BlogList";

const t = getDictionary();

export const metadata: Metadata = { title: t.meta.blogTitle };

export default function BlogPage() {
  return (
    <ContactDrawerProvider>
      <div className="min-h-screen bg-surface text-ink">
        <PageHeader />
        <main>
          <section className="container-site pt-[110px] pb-[140px] max-md:pt-14 max-md:pb-20">
            <div className="grid grid-cols-2 items-end gap-20 max-tb:grid-cols-1 max-tb:gap-7">
              <div className="anim-rise" style={{ animationDuration: ".8s" }}>
                <SectionLabel size={14} className="mb-[26px]">
                  {t.blog.label}
                </SectionLabel>
                <h1 className="m-0 max-w-[640px] text-[50px] leading-[1.05] font-medium tracking-[-.02em] text-pretty text-ink max-md:text-[38px]">
                  {t.blog.title}
                </h1>
              </div>
              <p
                className="anim-rise m-0 max-w-[400px] text-[17px] leading-7 text-pretty text-muted"
                style={{ animationDuration: ".8s", animationDelay: ".12s" }}
              >
                {t.blog.text}
              </p>
            </div>
            <BlogList />
          </section>
        </main>
        <Footer variant="inline" />
      </div>
    </ContactDrawerProvider>
  );
}
