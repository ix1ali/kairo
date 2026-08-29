/** One stroke-based icon set used across the whole product. */

export type IconName =
  | "check" | "checkCircle" | "clock" | "calendar" | "sparkle" | "bolt" | "target"
  | "layers" | "image" | "video" | "text" | "hash" | "download" | "upload"
  | "link" | "store" | "tag" | "star" | "heart" | "eye" | "chart" | "arrowRight"
  | "arrowDown" | "plus" | "close" | "edit" | "trash" | "copy" | "shuffle"
  | "brain" | "megaphone" | "users" | "shield" | "globe" | "palette" | "wand"
  | "grid" | "list" | "filter" | "play" | "send" | "lock" | "skip" | "flag";

const P: Record<IconName, React.ReactNode> = {
  check: <path d="M4 10.5 8 14.5 16 5.5" />,
  checkCircle: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.6 10.2 9 12.6l4.4-5" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.8V10l2.8 1.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="2.8" y="4" width="14.4" height="13.2" rx="2.4" />
      <path d="M2.8 8h14.4M6.8 2.4v3.2M13.2 2.4v3.2" />
    </>
  ),
  sparkle: <path d="M10 2.5 11.7 7.4 16.6 9.1 11.7 10.8 10 15.7 8.3 10.8 3.4 9.1 8.3 7.4 10 2.5ZM15.6 13.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z" />,
  bolt: <path d="M11 2.2 4.6 11.2h4.2l-.8 6.6 6.4-9h-4.2l.8-6.6Z" />,
  target: (
    <>
      <circle cx="10" cy="10" r="7.4" />
      <circle cx="10" cy="10" r="4" />
      <circle cx="10" cy="10" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  layers: <path d="M10 2.6 2.8 6.4 10 10.2l7.2-3.8L10 2.6ZM3 10.4 10 14l7-3.6M3 14.2 10 17.8l7-3.6" />,
  image: (
    <>
      <rect x="2.8" y="3.6" width="14.4" height="12.8" rx="2.4" />
      <circle cx="7.4" cy="8" r="1.5" />
      <path d="M3.4 14.2 7.8 10l3 2.8 2.6-2.2 3.4 3" />
    </>
  ),
  video: (
    <>
      <rect x="2.4" y="4.8" width="10.6" height="10.4" rx="2.4" />
      <path d="M13 9.4l4.6-2.7v6.6L13 10.6" />
    </>
  ),
  text: <path d="M4 5h12M4 10h9M4 15h6" />,
  hash: <path d="M7.4 3 6 17M14 3l-1.4 14M3.4 7.2h13.2M2.8 12.8H16" />,
  download: <path d="M10 3v9m0 0 3.4-3.4M10 12 6.6 8.6M3.4 13.4v1.8a2 2 0 0 0 2 2h9.2a2 2 0 0 0 2-2v-1.8" />,
  upload: <path d="M10 15V6m0 0L6.6 9.4M10 6l3.4 3.4M3.4 13.4v1.8a2 2 0 0 0 2 2h9.2a2 2 0 0 0 2-2v-1.8" />,
  link: <path d="M8.4 11.6a3.4 3.4 0 0 0 5 .4l2-2a3.4 3.4 0 0 0-4.8-4.8l-1.1 1.1M11.6 8.4a3.4 3.4 0 0 0-5-.4l-2 2a3.4 3.4 0 0 0 4.8 4.8l1.1-1.1" />,
  store: <path d="M3 7.6 4.4 3.4h11.2L17 7.6M3 7.6h14v8a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 15.6v-8ZM3 7.6a2.4 2.4 0 0 0 4.7 0 2.4 2.4 0 0 0 4.6 0 2.4 2.4 0 0 0 4.7 0" />,
  tag: (
    <>
      <path d="M3 3h6.2l7.6 7.6a1.6 1.6 0 0 1 0 2.3l-4 4a1.6 1.6 0 0 1-2.3 0L3 9.2V3Z" />
      <circle cx="6.6" cy="6.6" r="1.1" />
    </>
  ),
  star: <path d="m10 2.8 2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1L2.5 8.3l5.2-.8L10 2.8Z" />,
  heart: <path d="M10 16.6S3 12.7 3 7.9a3.7 3.7 0 0 1 7-1.8 3.7 3.7 0 0 1 7 1.8c0 4.8-7 8.7-7 8.7Z" />,
  eye: (
    <>
      <path d="M1.8 10S4.8 4.6 10 4.6 18.2 10 18.2 10 15.2 15.4 10 15.4 1.8 10 1.8 10Z" />
      <circle cx="10" cy="10" r="2.5" />
    </>
  ),
  chart: <path d="M3 17h14M5.6 14V9M10 14V4.6M14.4 14v-6" />,
  arrowRight: <path d="M3.6 10h12.8M11.6 5.2 16.4 10l-4.8 4.8" />,
  arrowDown: <path d="M10 3.6v12.8M5.2 11.6 10 16.4l4.8-4.8" />,
  plus: <path d="M10 4.2v11.6M4.2 10h11.6" />,
  close: <path d="M5.4 5.4l9.2 9.2M14.6 5.4l-9.2 9.2" />,
  edit: <path d="M12.6 3.6 16.4 7.4M3.2 16.8l.7-3.3L13 4.4a1.6 1.6 0 0 1 2.3 0l.3.3a1.6 1.6 0 0 1 0 2.3l-9.1 9.1-3.3.7Z" />,
  trash: <path d="M3.4 5.4h13.2M8 5.4V3.8h4v1.6M5.2 5.4l.8 10.4a1.6 1.6 0 0 0 1.6 1.5h4.8a1.6 1.6 0 0 0 1.6-1.5l.8-10.4" />,
  copy: (
    <>
      <rect x="6.6" y="6.6" width="10" height="10" rx="2" />
      <path d="M13.4 6.6V5a1.6 1.6 0 0 0-1.6-1.6H5A1.6 1.6 0 0 0 3.4 5v6.8A1.6 1.6 0 0 0 5 13.4h1.6" />
    </>
  ),
  shuffle: <path d="M3 5.4h2.8L14 14.6h3M14.4 12l2.6 2.6-2.6 2.6M3 14.6h2.8l2.4-2.7M12.2 7.9l1.8-2.5h3M14.4 2.8 17 5.4l-2.6 2.6" />,
  brain: <path d="M8.4 3.2a2.6 2.6 0 0 0-2.6 2.6 2.4 2.4 0 0 0-1.4 4.3 2.5 2.5 0 0 0 1.5 4.2 2.5 2.5 0 0 0 4.5 1.5V4.9a2.4 2.4 0 0 0-2-1.7ZM11.6 3.2a2.6 2.6 0 0 1 2.6 2.6 2.4 2.4 0 0 1 1.4 4.3 2.5 2.5 0 0 1-1.5 4.2 2.5 2.5 0 0 1-4.1 1.7" />,
  megaphone: <path d="M3.4 8.2v3.6a1.4 1.4 0 0 0 1.4 1.4h1.4l7.6 3.6V3.2L6.2 6.8H4.8a1.4 1.4 0 0 0-1.4 1.4ZM6.2 13.2v3.4M16 7.6a3 3 0 0 1 0 4.8" />,
  users: (
    <>
      <circle cx="7.6" cy="6.8" r="2.8" />
      <path d="M2.6 16.6a5 5 0 0 1 10 0M13.4 4.4a2.8 2.8 0 0 1 0 5.4M14.4 11.8a5 5 0 0 1 3 4.8" />
    </>
  ),
  shield: <path d="M10 2.6 16 5v4.6c0 3.6-2.4 6.6-6 7.8-3.6-1.2-6-4.2-6-7.8V5l6-2.4Z" />,
  globe: (
    <>
      <circle cx="10" cy="10" r="7.4" />
      <path d="M2.8 10h14.4M10 2.6a12 12 0 0 1 0 14.8 12 12 0 0 1 0-14.8Z" />
    </>
  ),
  palette: (
    <>
      <path d="M10 2.6a7.4 7.4 0 0 0 0 14.8c1 0 1.6-.7 1.6-1.5 0-.9-.7-1.4-.7-2.1 0-.8.6-1.4 1.5-1.4h1.4a3.6 3.6 0 0 0 3.6-3.6c0-3.4-3.3-6.2-7.4-6.2Z" />
      <circle cx="6.6" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.4" cy="6.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="13" cy="7.4" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  wand: <path d="M4 16 13.4 6.6M15 3l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7L15 3ZM5.6 3.6l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" />,
  grid: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1.6" />
      <rect x="11" y="3" width="6" height="6" rx="1.6" />
      <rect x="3" y="11" width="6" height="6" rx="1.6" />
      <rect x="11" y="11" width="6" height="6" rx="1.6" />
    </>
  ),
  list: <path d="M7 5.4h9.6M7 10h9.6M7 14.6h9.6M3.6 5.4h.01M3.6 10h.01M3.6 14.6h.01" />,
  filter: <path d="M3 4.6h14L11.6 11v5l-3.2-1.8V11L3 4.6Z" />,
  play: <path d="M6.4 4.2 15.2 10l-8.8 5.8V4.2Z" />,
  send: <path d="M17.4 2.6 9.2 10.8M17.4 2.6 12 17.4l-2.8-6.6-6.6-2.8 14.8-5.4Z" />,
  lock: (
    <>
      <rect x="4" y="8.6" width="12" height="8.4" rx="2.2" />
      <path d="M6.8 8.6V6.4a3.2 3.2 0 0 1 6.4 0v2.2" />
    </>
  ),
  skip: <path d="M5 5v10M15 5v10M14.4 10 6.6 15V5l7.8 5Z" />,
  flag: <path d="M4.4 17V3.6M4.4 4.2h9.2l-1.4 3 1.4 3H4.4" />,
};

export function Icon({
  name,
  size = 18,
  className = "",
  strokeWidth = 1.6,
  filled = false,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}
