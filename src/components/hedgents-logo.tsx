import Image from "next/image";
import Link from "next/link";

type HedgentsLogoProps = {
  href?: string;
  compact?: boolean;
  inverse?: boolean;
  className?: string;
};

export function HedgentsLogo({
  href = "/",
  compact = false,
  className = "",
}: HedgentsLogoProps) {
  const asset = compact
    ? "/brand/hedgents-source-app-icon.png"
    : "/brand/hedgents-source-lockup.png";

  return (
    <Link
      href={href}
      aria-label="Hedgents home"
      className={`group inline-flex items-center ${className}`}
    >
      <Image
        src={asset}
        alt=""
        aria-hidden="true"
        width={compact ? 330 : 1275}
        height={compact ? 330 : 355}
        className={`h-auto transition-opacity duration-200 group-hover:opacity-80 ${
          compact ? "w-10" : "w-[184px] sm:w-[202px]"
        }`}
        priority
      />
    </Link>
  );
}
