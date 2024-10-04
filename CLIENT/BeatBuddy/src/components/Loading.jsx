"use client";

import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Spinner aria-label="Center-aligned" size="xl" />
      </div>
    </div>
  );
}
