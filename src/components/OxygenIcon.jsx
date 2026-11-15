"use client";

import React, { useState } from "react";

// Authentic KDE Oxygen Icon Theme Mapping
// Direct mapping to /icons/oxygen/*.svg assets
const ICON_MAP = {
  // Primary brand / core downloader types
  download: "/icons/oxygen/download.svg",
  "oxygen-download": "/icons/oxygen/download.svg",
  video: "/icons/oxygen/video.svg",
  "video-x-generic": "/icons/oxygen/video.svg",
  image: "/icons/oxygen/image.svg",
  "image-x-generic": "/icons/oxygen/image.svg",
  photo: "/icons/oxygen/photo.svg",
  reels: "/icons/oxygen/camera-video.svg",
  "camera-video": "/icons/oxygen/camera-video.svg",
  "media-playlist": "/icons/oxygen/camera-video.svg",
  story: "/icons/oxygen/gif.svg",
  gif: "/icons/oxygen/gif.svg",
  carousel: "/icons/oxygen/carousel.svg",
  "view-media-album-cover": "/icons/oxygen/carousel.svg",
  viewer: "/icons/oxygen/viewer.svg",
  igtv: "/icons/oxygen/igtv.svg",

  // System features & benefits
  security: "/icons/oxygen/security.svg",
  "security-high": "/icons/oxygen/security-high.svg",
  shield: "/icons/oxygen/shield.svg",
  speed: "/icons/oxygen/speed.svg",
  speedometer: "/icons/oxygen/speedometer.svg",
  chronometer: "/icons/oxygen/speed.svg",
  devices: "/icons/oxygen/devices.svg",
  computer: "/icons/oxygen/computer.svg",
  phone: "/icons/oxygen/phone.svg",
  smartphone: "/icons/oxygen/smartphone.svg",
  multimedia: "/icons/oxygen/multimedia.svg",

  // Navigation & UI controls
  navigation: "/icons/oxygen/navigation.svg",
  "arrow-right": "/icons/oxygen/arrow-right.svg",
  "arrow-left": "/icons/oxygen/arrow-left.svg",
  "arrow-down": "/icons/oxygen/arrow-down.svg",
  "arrow-up": "/icons/oxygen/arrow-up.svg",
  "go-next": "/icons/oxygen/go-next.svg",
  "go-home": "/icons/oxygen/home.svg",
  chevronRight: "/icons/oxygen/arrow-right.svg",
  chevronLeft: "/icons/oxygen/arrow-left.svg",
  chevronDown: "/icons/oxygen/arrow-down.svg",
  home: "/icons/oxygen/home.svg",
  menu: "/icons/oxygen/menu.svg",
  search: "/icons/oxygen/search.svg",
  "edit-find": "/icons/oxygen/edit-find.svg",
  check: "/icons/oxygen/check.svg",
  "dialog-ok-apply": "/icons/oxygen/dialog-ok-apply.svg",
  close: "/icons/oxygen/close.svg",
  "dialog-warning": "/icons/oxygen/dialog-warning.svg",
  refresh: "/icons/oxygen/refresh.svg",
  "view-refresh": "/icons/oxygen/view-refresh.svg",
  paste: "/icons/oxygen/paste.svg",
  copy: "/icons/oxygen/copy.svg",
  "edit-copy": "/icons/oxygen/edit-copy.svg",
  "copy-tool": "/icons/oxygen/copy-tool.svg",
  "document-edit": "/icons/oxygen/copy-tool.svg",
  "text-editor": "/icons/oxygen/copy-tool.svg",
  "format-list-ordered": "/icons/oxygen/copy-tool.svg",
  folder: "/icons/oxygen/folder-downloads.svg",
  "folder-downloads": "/icons/oxygen/folder-downloads.svg",
  "document-new": "/icons/oxygen/insert-image.svg",
  "mail-message-new": "/icons/oxygen/help.svg",

  // Utility & system
  play: "/icons/oxygen/play.svg",
  globe: "/icons/oxygen/globe.svg",
  "applications-internet": "/icons/oxygen/applications-internet.svg",
  sun: "/icons/oxygen/sun.svg",
  moon: "/icons/oxygen/moon.svg",
  settings: "/icons/oxygen/settings.svg",
  configure: "/icons/oxygen/settings.svg",
  "applications-system": "/icons/oxygen/applications-system.svg",
  "system-log-out": "/icons/oxygen/system-log-out.svg",
  help: "/icons/oxygen/help.svg",
  "help-browser": "/icons/oxygen/help-browser.svg",
  "help-contents": "/icons/oxygen/help-contents.svg",
  crop: "/icons/oxygen/crop.svg",
  "crop-resize": "/icons/oxygen/crop-resize.svg",
  resize: "/icons/oxygen/resize.svg",
  rotate: "/icons/oxygen/rotate.svg",
  convert: "/icons/oxygen/convert.svg",
  compress: "/icons/oxygen/compress.svg",

  // Creator niches
  favorite: "/icons/oxygen/help.svg",
  star: "/icons/oxygen/help.svg",
  heart: "/icons/oxygen/help.svg",
  plane: "/icons/oxygen/navigation.svg",
  fitness: "/icons/oxygen/speed.svg",
  food: "/icons/oxygen/multimedia.svg",
  fashion: "/icons/oxygen/photo.svg",
  business: "/icons/oxygen/computer.svg",
  smile: "/icons/oxygen/help.svg",
};

export default function OxygenIcon({
  name,
  size,
  className = "",
  alt = "",
  title = "",
}) {
  const [hasError, setHasError] = useState(false);

  // Determine path from verified Oxygen icon map
  const iconSrc = ICON_MAP[name] || `/icons/oxygen/${name}.svg`;

  // Sizing resolution:
  // If an explicit size prop is given, use it.
  // If no size prop is given, but className has w-* or h-*, let CSS control the dimensions.
  // If neither is present, default to 18px.
  const hasDimensionClass = /\b(w-|h-)/.test(className);
  const effectiveSize = size || (!hasDimensionClass ? 18 : undefined);
  const inlineStyle = effectiveSize
    ? { width: `${effectiveSize}px`, height: `${effectiveSize}px` }
    : undefined;

  if (hasError) {
    // Elegant fallback: SVG diamond/bullet dot so page layout never shows broken image icon
    return (
      <span
        style={inlineStyle}
        className={`inline-flex items-center justify-center shrink-0 text-current opacity-70 ${className}`}
        title={title || alt || name}
      >
        <svg
          viewBox="0 0 24 24"
          width={effectiveSize || 18}
          height={effectiveSize || 18}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="6" />
        </svg>
      </span>
    );
  }

  return (
    <img
      src={iconSrc}
      alt={alt || `${name} icon`}
      title={title || alt || undefined}
      width={effectiveSize || 18}
      height={effectiveSize || 18}
      style={inlineStyle}
      className={`inline-block shrink-0 object-contain select-none pointer-events-none drop-shadow-xs ${className}`}
      loading="eager"
      decoding="async"
      onError={() => {
        setHasError(true);
      }}
    />
  );
}

export { ICON_MAP };
