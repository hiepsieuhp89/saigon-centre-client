"use client";

import ConfirmRechargePage from "@/components/Pages/ConfirmRechargePage";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ConfirmRechargePage />
    </Suspense>
  );
}
