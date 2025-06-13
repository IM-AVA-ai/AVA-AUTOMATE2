"use client"

import { useState, useEffect, useRef } from "react"

export const useInView = (options: IntersectionObserverInit): [React.RefObject<HTMLTableRowElement>, boolean] => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setInView(entry.isIntersecting);
      });
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, inView];
};
