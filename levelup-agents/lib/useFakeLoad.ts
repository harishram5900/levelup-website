"use client";
import { useEffect, useState } from "react";

/** Simulates a short network load so skeleton states are visible in the demo. */
export function useFakeLoad(ms = 650) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), ms); return () => clearTimeout(t); }, [ms]);
  return ready;
}
