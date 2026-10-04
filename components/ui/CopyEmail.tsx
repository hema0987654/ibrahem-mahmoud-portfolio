"use client";

import { useEffect, useRef, useState } from "react";

/** Copies the address and confirms in the button label and to assistive tech. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the mailto link next to this button still works.
    }
  };

  return (
    <button type="button" onClick={copy} className="btn btn-ghost cursor-pointer" aria-live="polite">
      <span aria-hidden="true">
        {copied ? "✓" : "⧉"}
      </span>
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}
