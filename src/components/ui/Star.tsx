import Image from "next/image";
import { icons } from "@/lib/images";

type Props = { size?: number; dark?: boolean; className?: string; priority?: boolean };

/** Звезда-символ Reacto (icon-reacto.svg). `dark` — чёрная версия для светлого фона. */
export function Star({ size = 14, dark = false, className = "", priority }: Props) {
  return (
    <Image
      src={icons.star}
      alt=""
      aria-hidden
      width={size}
      height={size}
      unoptimized
      priority={priority}
      className={`block flex-none ${dark ? "brightness-0" : ""} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
