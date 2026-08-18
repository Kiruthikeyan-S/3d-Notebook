

export const GeometricIllustration = () => (
  <svg
    viewBox="0 0 200 120"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="geom-grad-1" x1="0" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="geom-grad-2" x1="200" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <rect width="200" height="120" fill="url(#geom-grad-1)" />
    <circle cx="60" cy="60" r="45" fill="url(#geom-grad-2)" />
    <path d="M120 120 L160 40 L200 120 Z" fill="rgba(255,255,255,0.25)" />
    <circle cx="150" cy="35" r="12" fill="rgba(255,255,255,0.6)" />
    <path d="M10 110 Q 80 20 190 100" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
  </svg>
);

export const WaveIllustration = () => (
  <svg
    viewBox="0 0 200 120"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 40 C 50 10, 100 70, 200 30 L 200 120 L 0 120 Z" fill="rgba(255, 255, 255, 0.15)" />
    <path d="M0 70 C 60 40, 130 90, 200 50 L 200 120 L 0 120 Z" fill="rgba(255, 255, 255, 0.25)" />
    <path d="M0 95 C 40 80, 150 110, 200 85 L 200 120 L 0 120 Z" fill="rgba(255, 255, 255, 0.35)" />
  </svg>
);

export const ConstellationIllustration = () => (
  <svg
    viewBox="0 0 200 120"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="30" cy="30" r="3" fill="#fff" />
    <circle cx="80" cy="50" r="4" fill="#fff" />
    <circle cx="140" cy="25" r="3" fill="#fff" opacity="0.9" />
    <circle cx="170" cy="75" r="5" fill="#fff" />
    <circle cx="110" cy="95" r="3" fill="#fff" opacity="0.7" />
    <circle cx="45" cy="85" r="4" fill="#fff" />

    <line x1="30" y1="30" x2="80" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="80" y1="50" x2="140" y2="25" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="140" y1="25" x2="170" y2="75" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="170" y1="75" x2="110" y2="95" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="110" y1="95" x2="45" y2="85" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="45" y1="85" x2="30" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />

    <path d="M80 50 L 110 95" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
  </svg>
);

export const TechGridIllustration = () => (
  <svg
    viewBox="0 0 200 120"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
    </pattern>
    <rect width="200" height="120" fill="url(#grid)" />
    <circle cx="100" cy="60" r="35" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" strokeDasharray="4 2" />
    <circle cx="100" cy="60" r="18" fill="rgba(255, 255, 255, 0.2)" />
    <path d="M 70 60 L 130 60 M 100 30 L 100 90" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
  </svg>
);

export const MinimalLinesIllustration = () => (
  <svg
    viewBox="0 0 200 120"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="20" y1="20" x2="180" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
    <line x1="20" y1="40" x2="140" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    <line x1="20" y1="60" x2="160" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    <line x1="20" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    <circle cx="170" cy="80" r="10" fill="rgba(255,255,255,0.3)" />
  </svg>
);
