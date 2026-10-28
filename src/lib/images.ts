import type { StaticImageData } from "next/image";
import footerLight from "@/assets/images/footer-light.jpg";
import mvpLight from "@/assets/images/mvp-light.jpg";
import megagen from "@/assets/images/megagen.jpg";
import suvvy from "@/assets/images/suvvy.jpg";
import alloca from "@/assets/images/alloca.jpg";
import ecoflightPoster from "@/assets/images/ecoflight-poster.jpg";
import topSoftwareDevelopers from "@/assets/images/top-software-developers.jpg";
import logoEcoflight from "@/assets/images/logo-ecoflight.jpg";
import revIgor from "@/assets/images/rev-igor.jpg";
import zoom from "@/assets/images/zoom.png";

/** Реестр растровых изображений: ключи используются в контенте. */
export const images = {
  "footer-light": footerLight,
  "mvp-light": mvpLight,
  megagen,
  suvvy,
  alloca,
  "ecoflight-poster": ecoflightPoster,
  "top-software-developers": topSoftwareDevelopers,
  "logo-ecoflight": logoEcoflight,
  "rev-igor": revIgor,
  zoom,
} satisfies Record<string, StaticImageData>;

export type ImageKey = keyof typeof images;

export function img(key: string): StaticImageData {
  const found = (images as Record<string, StaticImageData>)[key];
  if (!found) throw new Error(`Unknown image key: ${key}`);
  return found;
}

/** SVG-иконки отдаются из /public без оптимизации. */
export const icons = {
  star: "/icons/icon-reacto.svg",
  logo: "/icons/logo-reacto.svg",
} as const;
