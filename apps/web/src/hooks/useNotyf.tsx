"use client";

import { useMemo } from "react";
import { Notyf } from "notyf";

export function useNotyf() {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    return new Notyf();
  }, []);
}
