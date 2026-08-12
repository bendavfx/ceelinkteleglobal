import { useCallback, useEffect, useState } from "react";

const KEY = "tripple-gadgets-wishlist-v1";

export function useWishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
    const onChange = () => {
      try {
        setSlugs(JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as string[]);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("wishlist-change", onChange);
    return () => window.removeEventListener("wishlist-change", onChange);
  }, []);

  const toggle = useCallback((slug: string) => {
    let next: string[] = [];
    try {
      const current = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as string[];
      next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    } catch {
      next = [slug];
    }
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("wishlist-change"));
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, toggle, has };
}
