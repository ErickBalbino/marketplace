"use client";

import Image, { ImageProps } from "next/image";
import { resolveImageSrc } from "@/lib/images";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function SmartImage({
  src: raw,
  alt,
  className,
  style,
  width,
  height,
  ...rest
}: Props) {
  const src = resolveImageSrc(raw);
  console.log("teste");
  console.log(src);

  const isExternalOrDataUrl =
    /^https?:\/\//i.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("blob:");

  if (isExternalOrDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      {...rest}
    />
  );
}
