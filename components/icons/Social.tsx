/** Simplified platform marks, drawn as single-colour glyphs so they sit on any surface. */

type P = { size?: number; className?: string };

const wrap = (size: number, children: React.ReactNode, className?: string) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    {children}
  </svg>
);

export const InstagramIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <>
      <path
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Z"
        fillRule="evenodd"
      />
      <path d="M12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" fillRule="evenodd" />
      <circle cx="17.3" cy="6.7" r="1.2" />
    </>,
    className
  );

export const TikTokIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M16.6 2h-3v13.2a2.6 2.6 0 1 1-2-2.53V9.6a5.7 5.7 0 1 0 5 5.66V9.03a6.9 6.9 0 0 0 3.9 1.2V7.2a4 4 0 0 1-3.9-3.9V2Z" />,
    className
  );

export const FacebookIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />,
    className
  );

export const LinkedInIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <>
      <path d="M4.5 3A1.8 1.8 0 1 1 4.5 6.6 1.8 1.8 0 0 1 4.5 3ZM3 8.2h3v12.6H3V8.2Z" />
      <path d="M9 8.2h2.9v1.7h.05c.4-.75 1.4-1.55 2.9-1.55 3.1 0 3.65 2 3.65 4.65v6.8h-3v-6c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.55-2.3 3.2v6.1H9V8.2Z" />
    </>,
    className
  );

export const XIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.7 21H1.5l7.5-8.6L1.2 3h6.6l4.5 5.6L17.5 3Zm-1.1 16.1h1.8L7.7 4.8H5.8l10.6 14.3Z" />,
    className
  );

export const YouTubeIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.1V8.9l5.2 3.1L10 15.1Z" />,
    className
  );

export const PinterestIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M12 2a10 10 0 0 0-3.7 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.5-1.8-4.2-4.3-4.2-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2Z" />,
    className
  );

export const ThreadsIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M16.9 11.3c-.1 0-.2-.1-.3-.1-.2-3.2-1.9-5-4.8-5h-.1c-1.7 0-3.2.8-4 2.1l1.6 1.1c.6-1 1.6-1.2 2.4-1.2h.1c1 0 1.8.3 2.3.9.4.4.6 1 .7 1.7-.8-.1-1.6-.2-2.5-.1-2.6.1-4.3 1.7-4.2 3.8.1 1.1.6 2 1.5 2.6.8.5 1.8.8 2.8.7 1.4-.1 2.4-.6 3.2-1.6.6-.8.9-1.7 1.1-2.9.7.4 1.2 1 1.5 1.7.5 1.1.5 3-1 4.5-1.3 1.3-2.9 1.9-5.3 1.9-2.7 0-4.7-.9-6-2.6C4.7 16.9 4.1 14.7 4 12c.1-2.7.7-4.9 1.9-6.4C7.2 3.9 9.2 3 11.9 3c2.7 0 4.7.9 6 2.6.6.9 1.1 1.9 1.4 3.2l1.9-.5c-.3-1.6-.9-2.9-1.7-4C17.8 2.1 15.3 1 12 1S6.1 2.1 4.4 4.3C2.8 6.3 2 9 2 12c0 3 .8 5.7 2.4 7.7C6.1 21.9 8.6 23 11.9 23c3 0 5.1-.8 6.8-2.5 2.2-2.2 2.1-5 1.4-6.7-.5-1.2-1.5-2.1-2.9-2.7l-.3.2Zm-4.5 5.5c-1.1.1-2.3-.4-2.4-1.5-.1-.8.6-1.7 2.4-1.8h.5c.6 0 1.2.1 1.7.2-.2 2.4-1.4 3-2.2 3.1Z" />,
    className
  );

export const SnapchatIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M12 2.2c2.6 0 4.4 1.9 4.5 4.5 0 .6 0 1.3-.1 1.9.3.1.6.1.9 0 .3-.1.6-.2.9-.2.5 0 .9.3.9.8 0 .6-.6.9-1.2 1.1-.6.2-1.1.4-1.1.9 0 .2.1.4.2.6.6 1.3 1.7 2.4 3 2.9.4.2.6.4.6.7 0 .6-.9.9-1.7 1.1-.4.1-.5.2-.6.6-.1.4-.2.7-.6.7-.3 0-.6-.1-1-.1-.5 0-1 0-1.5.2-.5.2-.9.6-1.4 1-.6.5-1.2.9-2.1.9s-1.5-.4-2.1-.9c-.5-.4-.9-.8-1.4-1-.5-.2-1-.2-1.5-.2-.4 0-.7.1-1 .1-.4 0-.5-.3-.6-.7-.1-.4-.2-.5-.6-.6-.8-.2-1.7-.5-1.7-1.1 0-.3.2-.5.6-.7 1.3-.5 2.4-1.6 3-2.9.1-.2.2-.4.2-.6 0-.5-.5-.7-1.1-.9-.6-.2-1.2-.5-1.2-1.1 0-.5.4-.8.9-.8.3 0 .6.1.9.2.3.1.6.1.9 0-.1-.6-.1-1.3-.1-1.9C7.6 4.1 9.4 2.2 12 2.2Z" />,
    className
  );

export const WhatsAppIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2Zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.3-.7-2.2-1.2-3.1-2.7-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.7.7-.9 1.6-.6 2.6.3 1 1 2 1.2 2.2.1.2 1.9 3 4.7 4.1 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3Z" />,
    className
  );

export const GoogleIcon = ({ size = 20, className }: P) =>
  wrap(
    size,
    <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Zm-9.6 10c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22.2Zm-5.6-9.7a6 6 0 0 1 0-3.8V6.1H3.1a10 10 0 0 0 0 9l3.3-2.6Zm5.6-6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 6.1l3.3 2.6c.8-2.4 3-4.2 5.6-4.2Z" />,
    className
  );

export const PLATFORM_ICONS: Record<string, (p: P) => React.JSX.Element> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  pinterest: PinterestIcon,
  threads: ThreadsIcon,
  snapchat: SnapchatIcon,
  whatsapp: WhatsAppIcon,
  google: GoogleIcon,
};

export const PLATFORM_COLOR: Record<string, string> = {
  instagram: "#E1306C",
  tiktok: "#25F4EE",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  x: "#ECECF3",
  youtube: "#FF0033",
  pinterest: "#E60023",
  threads: "#ECECF3",
  snapchat: "#FFFC00",
  whatsapp: "#25D366",
  google: "#8AB4F8",
};

export function PlatformIcon({ platform, size = 20, className }: { platform: string } & P) {
  const Cmp = PLATFORM_ICONS[platform];
  if (!Cmp) return null;
  return <Cmp size={size} className={className} />;
}
