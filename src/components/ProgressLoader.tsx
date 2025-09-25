"use client";

import NextTopLoader from "nextjs-toploader";

export default function ProgressLoader() {
  return (
    <NextTopLoader
      color="#1F3CE1"
      height={6}
      showSpinner={false}
      crawlSpeed={120}
      shadow={false}
    />
  );
}
