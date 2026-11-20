import Image from "next/image";
import Link from "next/link";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      aria-label="Code Yaar Home"
    >
      <div className="relative h-6 w-6 shrink-0">
        <Image src="/brand/logo-mark.png" alt="" fill sizes="24px" className="object-contain" />
      </div>
      <span className={className}>Code Yaar</span>
    </Link>
  );
}
