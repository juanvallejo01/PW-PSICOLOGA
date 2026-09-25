type IconName =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "whatsapp"
  | "phone"
  | "mail"
  | "arrow-right"
  | "check"
  | "menu"
  | "close"
  | "quote"
  | "child"
  | "teen"
  | "adult"
  | "couple"
  | "family"
  | "heart"
  | "leaf"
  | "compass"
  | "sun"
  | "lock"
  | "gift"
  | "download"
  | "card";

const paths: Record<IconName, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14 9h2V6h-2c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.4l.6-3H13v-2c0-.6.4-1 1-1Z" />
  ),
  tiktok: (
    <path d="M15 3v10.5a2.8 2.8 0 1 1-2.6-2.8M15 3c.3 2.2 2 3.9 4 4.1v3c-1.6 0-3-.5-4-1.4" />
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="8" y1="10.5" x2="8" y2="16" />
      <circle cx="8" cy="7.2" r="0.2" fill="currentColor" />
      <path d="M12 16v-3.2c0-1.4 1-2.3 2.2-2.3S16 11.4 16 12.8V16" />
    </>
  ),
  whatsapp: (
    <path d="M7 17.5 5.5 21l3.6-1.4A8 8 0 1 0 6 15.8L7 17.5Zm2.3-8.2c.3-.7 1-.6 1.4 0l.6 1c.2.4.1.8-.1 1.1l-.5.6c.4.9 1.2 1.7 2.1 2.1l.6-.5c.3-.2.7-.3 1.1-.1l1 .6c.6.4.7 1.1 0 1.4-1.4.7-3.3.2-4.9-1.4-1.6-1.6-2.1-3.5-1.3-4.8Z" />
  ),
  phone: (
    <path d="M6 4h3l1.5 4L9 9.5a10 10 0 0 0 5.5 5.5L16 13.5l4 1.5v3c0 1-.9 1.8-1.9 1.6C11.5 18.6 5.4 12.5 4.4 5.9 4.2 4.9 5 4 6 4Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  check: <path d="m5 13 4 4 10-10" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  quote: (
    <path d="M8 9c-2 0-3.5 1.5-3.5 3.5S6 16 8 16v2c-3.3 0-6-2.7-6-6s2.2-6 5-6l1 1.5C7.4 7.8 8 8.3 8 9Zm10 0c-2 0-3.5 1.5-3.5 3.5S16 16 18 16v2c-3.3 0-6-2.7-6-6s2.2-6 5-6l1 1.5c-.6.3-1 .8-1 1.5Z" />
  ),
  child: (
    <>
      <circle cx="12" cy="6" r="2.4" />
      <path d="M8 20v-4.5a4 4 0 0 1 8 0V20" />
    </>
  ),
  teen: (
    <>
      <circle cx="12" cy="5.5" r="2.2" />
      <path d="M7 20v-3a5 5 0 0 1 10 0v3M9 11v3M15 11v3" />
    </>
  ),
  adult: (
    <>
      <circle cx="12" cy="6" r="2.6" />
      <path d="M6 20v-2.5a6 6 0 0 1 12 0V20" />
    </>
  ),
  couple: (
    <>
      <circle cx="8.5" cy="6" r="2.2" />
      <circle cx="15.5" cy="6" r="2.2" />
      <path d="M4 20v-2a4.5 4.5 0 0 1 9 0M11 20v-2a4.5 4.5 0 0 1 9 0" />
    </>
  ),
  family: (
    <>
      <circle cx="6.5" cy="6" r="1.8" />
      <circle cx="17.5" cy="6" r="1.8" />
      <circle cx="12" cy="8" r="1.6" />
      <path d="M3 20v-2a3.5 3.5 0 0 1 7 0M14 20v-1.5a3 3 0 0 1 6 0V20M10.5 20v-2a3 3 0 0 1 3-1.5" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.5 1.2 4 2.7.5-1.5 2-2.7 4-2.7 3.5 0 5 3.5 3.5 6.5C19 15.6 12 20 12 20Z" />,
  leaf: <path d="M5 19c8 1 13-4 14-14-8-1-13 4-14 14Zm0 0c1-4 3-7 7-9" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-5 2 2-5Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 15v2" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="4" rx="1.2" />
      <path d="M5 13v7h14v-7M12 9v11M12 9c-1.5-4.5-6-4-6-1.5C6 9 9 9 12 9Zm0 0c1.5-4.5 6-4 6-1.5 0 1.5-3 1.5-6 1.5Z" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  download: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
};

export function Icon({
  name,
  className = "w-5 h-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export type { IconName };
