"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface TurnstileHandle {
  /** Reset the Cloudflare widget so a fresh challenge is required. */
  reset: () => void;
}

/** Reusable Cloudflare Turnstile widget.
 *
 * Loads the Turnstile script once, renders the widget explicitly, and
 * provides the verification token to the parent component. The site key is
 * read from NEXT_PUBLIC_TURNSTILE_SITE_KEY (visible in page source — not a
 * secret). The secret key never reaches the browser.
 */
export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileProps>(
  function TurnstileWidget(
    { onVerify, onError, disabled = false, className }: TurnstileProps,
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const siteKey = typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "")
      : "";

    // Expose an imperative reset so callers can clear the widget after a
    // failed submission and require a fresh challenge.
    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          if (typeof window === "undefined") return;
          const turnstile = (window as any).turnstile;
          const id = widgetIdRef.current;
          if (turnstile && id != null) {
            try {
              turnstile.reset(id);
            } catch {
              // Ignore reset errors.
            }
          }
        },
      }),
      [],
    );

    // Load Turnstile script on mount.
    useEffect(() => {
      if (!siteKey || typeof window === "undefined") {
        setReady(false);
        return;
      }
      const scriptId = "codeyaar-turnstile";
      const existing = document.getElementById(scriptId);
      if (existing) {
        setTimeout(() => setReady(true), 0);
        return;
      }
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => setReady(true);
      script.onerror = () => {
        setReady(false);
        setError("Security verification could not load.");
      };
      document.head.appendChild(script);
    }, [siteKey]);

    // Render the widget when ready.
    useEffect(() => {
      if (!ready || !siteKey || !containerRef.current || typeof window === "undefined") return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const turnstile = (window as any).turnstile;
      if (!turnstile) return;

      const widgetId = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          setError(null);
          onVerify(token);
        },
        "error-callback": () => {
          const msg = "Turnstile verification failed. Please try again.";
          setError(msg);
          onError?.(msg);
        },
        "expired-callback": () => {
          const msg = "Verification token expired. Please verify again.";
          setError(msg);
          onError?.(msg);
        },
      });
      widgetIdRef.current = widgetId;

      return () => {
        try {
          turnstile.remove(widgetId);
        } catch {
          // Ignore removal errors.
        }
        widgetIdRef.current = null;
      };
    }, [ready, siteKey, onVerify, onError]);

    if (disabled) return null;

    if (!siteKey) {
      return (
        <div className={className}>
          <p className="text-[0.8125rem] text-ink-muted">
            Turnstile site key not configured — verification disabled.
          </p>
        </div>
      );
    }

    return (
      <div className={className}>
        <div ref={containerRef} aria-label="Turnstile bot protection" />
        {error && (
          <p className="mt-2 text-[0.8125rem] text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TurnstileWidget.displayName = "TurnstileWidget";
