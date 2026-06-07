"use client";

import * as React from "react";
import { Check, Copy, Mail, Share2 } from "lucide-react";
import { BrandDialog } from "@/components/ui/brand-dialog";
import { SITE_LOGO_URL } from "@/lib/content/site";
import { cn } from "@/lib/utils";

function QrCode({ url }: { url: string }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(url)}`;
  return (
    <div className="mx-auto flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded-xl border border-[#1f2a7c]/10 bg-white p-2 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="QR code pour partager cet article"
          width={160}
          height={160}
          className="block"
        />
      </div>
      <p className="text-[11px] text-[#1f2a7c]/45">Scannez pour partager</p>
    </div>
  );
}

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
};

export function ShareModal({ open, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, "_blank");
  };

  const shareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`À lire : ${title}`)}&body=${encodeURIComponent(`Je te partage cet article :\n\n${title}\n${url}`)}`;
  };

  return (
    <BrandDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title="Partager"
      description={`« ${title} »`}
      backdropLabel="Fermer la fenêtre de partage"
      maxWidthClass="max-w-sm"
    >
      <div className="overflow-hidden rounded-xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE_LOGO_URL} alt="Lefèvre Conseil" className="mx-auto h-6 w-auto object-contain" />
      </div>

      <QrCode url={url} />

      <div className="mt-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1f2a7c]/45">
          Lien direct
        </p>
        <div className="flex items-center gap-2 overflow-hidden rounded-xl border border-[#1f2a7c]/12 bg-[#1f2a7c]/[0.03] px-3 py-2">
          <span className="flex-1 truncate text-[12px] text-[#1f2a7c]/60">{url}</span>
          <button
            type="button"
            onClick={copyLink}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors",
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-[#1f2a7c] text-white hover:bg-[#18226b]",
            )}
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={shareWhatsApp}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>
        <button
          type="button"
          onClick={shareEmail}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#1f2a7c]/12 bg-white py-3 text-[13px] font-semibold text-[#1f2a7c] transition-colors hover:bg-[#1f2a7c]/[0.04]"
        >
          <Mail className="size-4" aria-hidden />
          E-mail
        </button>
      </div>
    </BrandDialog>
  );
}

export function ShareButton({ title, url, className }: { title: string; url: string; className?: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[#1f2a7c]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#1f2a7c] shadow-sm transition-colors hover:bg-[#1f2a7c]/[0.04]",
          className,
        )}
      >
        <Share2 className="size-4" aria-hidden />
        Partager
      </button>
      <ShareModal open={open} onClose={() => setOpen(false)} title={title} url={url} />
    </>
  );
}
