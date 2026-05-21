import { SITE_PUBLIC_FAQ_ITEMS } from "@/lib/content/site-faq";

export function ContactMiniFaq() {
  return (
    <section
      aria-labelledby="contact-faq-title"
      className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm"
    >
      <div className="border-b border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:px-6 sm:py-5">
        <h2 id="contact-faq-title" className="text-sm font-semibold text-neutral-900">
          Questions fréquentes
        </h2>
      </div>
      <ul className="divide-y divide-neutral-100">
        {SITE_PUBLIC_FAQ_ITEMS.map((item) => (
          <li key={item.q}>
            <details className="group px-5 py-3.5 sm:px-6 sm:py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-left text-sm font-medium text-neutral-900 outline-none marker:content-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/20 focus-visible:ring-offset-2">
                <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
                <span
                  className="mt-0.5 shrink-0 text-neutral-400 transition-transform duration-200 ease-out group-open:rotate-180"
                  aria-hidden
                >
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
