"use client";

import { BrandDialog, type BrandDialogProps } from "@/components/ui/brand-dialog";

export type BottomSheetProps = BrandDialogProps;

/** @deprecated Utiliser `BrandDialog` --- conservé pour compatibilité. */
export function BottomSheet(props: BottomSheetProps) {
  return <BrandDialog {...props} />;
}
