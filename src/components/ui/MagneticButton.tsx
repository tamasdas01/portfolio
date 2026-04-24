"use client";

import {
  useRef,
  useCallback,
  cloneElement,
  isValidElement,
  type ReactElement,
} from "react";
import { useIsMobile } from "@/lib/use-mobile";

// ─────────────────────────────────────────────────────────────
// MagneticButton
//
// Wraps any single child element (a, button, div…) and adds a
// physical "magnetic pull" when the user hovers near it.
//
// How it works:
//   • onMouseMove  → measure offset from center → translate child
//   • onMouseLeave → spring-back to origin via CSS transition
//
// strength: 0.38 (matches the Therapix guide — feels natural)
// snap-back: 0.5s cubic-bezier spring
//
// Mobile: passthrough — no effect, no event overhead.
// ─────────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: ReactElement;
  /** How strongly the element is pulled toward the cursor (0–1). Default 0.38 */
  strength?: number;
  /** className applied to the invisible hit-area wrapper */
  wrapperClassName?: string;
}

export function MagneticButton({
  children,
  strength = 0.38,
  wrapperClassName = "",
}: MagneticButtonProps) {
  const isMobile = useIsMobile();
  const innerRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * strength;
      const dy = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transition = "transform 0.1s ease";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
    el.style.transform = "translate(0px, 0px)";
  }, []);

  // On mobile — just render the child as-is
  if (isMobile) return children;

  if (!isValidElement(children)) return children;

  // Clone child so we can attach a ref without owning the element
  const child = cloneElement(children as ReactElement<{ ref?: React.Ref<HTMLElement> }>, {
    ref: (node: HTMLElement | null) => {
      innerRef.current = node;
      // Forward the original ref if present
      const originalRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof originalRef === "function") originalRef(node);
      else if (originalRef && typeof originalRef === "object")
        (originalRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
  });

  return (
    // The hitArea is slightly larger than the child so the magnetic effect
    // activates before the cursor actually touches the button.
    <div
      className={`inline-flex items-center justify-center ${wrapperClassName}`}
      style={{ padding: "12px", margin: "-12px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {child}
    </div>
  );
}
