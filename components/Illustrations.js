// Small hand-drawn style illustrations used in the hero. Each accepts normal <svg> props
// (x, y, width, height, className) so they can be nested inside a larger scene.

const INK = "#1a1710";

export function WineGlass({ wine = "#c0485f", ...props }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" {...props}>
      <path
        d="M27 6h46c2 28-6 50-23 52C33 56 25 34 27 6z"
        fill="#fff"
        fillOpacity=".6"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M29.5 26h41c-1 17-8 28-20.5 30-12.5-2-19.5-13-20.5-30z" fill={wine} fillOpacity=".85" />
      <path d="M50 58v42" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="50" cy="105" rx="21" ry="5.5" fill="#fff" fillOpacity=".7" stroke={INK} strokeWidth="2.5" />
      <path d="M35 13c0 11 2 19 5 25" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Tumbler(props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <path
        d="M24 12h52l-5 78c-.2 4-3 6-7 6H36c-4 0-6.800-2-7-6z"
        fill="#fff"
        fillOpacity=".6"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M27.200 40h45.600l-2.600 50c-.2 3.400-2.800 5-6.200 5H36c-3.400 0-6-1.600-6.200-5z" fill="#7fc4b5" fillOpacity=".75" />
      <path d="M35 20l2.500 48" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Jar(props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <rect x="28" y="6" width="44" height="14" rx="4" fill="#d2a548" stroke={INK} strokeWidth="2.5" />
      <path
        d="M26 24h48c3 3 5 6 5 12v46c0 7-5 12-12 12H33c-7 0-12-5-12-12V36c0-6 2-9 5-12z"
        fill="#fff"
        fillOpacity=".6"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M22 60h56v22c0 6.500-5 11-11.500 11h-33C27 93 22 88.500 22 82z" fill="#e8bf7e" fillOpacity=".85" />
      <g fill="#c98d3d">
        <circle cx="34" cy="72" r="3" />
        <circle cx="48" cy="80" r="3" />
        <circle cx="62" cy="70" r="3" />
        <circle cx="42" cy="66" r="2.500" />
        <circle cx="66" cy="84" r="2.500" />
      </g>
      <path d="M30 34v18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Vase(props) {
  return (
    <svg viewBox="0 0 100 140" fill="none" {...props}>
      <g stroke="#3d7a5f" strokeWidth="2.500" strokeLinecap="round">
        <path d="M50 60C47 42 38 30 30 20" />
        <path d="M50 60C53 40 62 28 72 18" />
        <path d="M50 60V14" />
      </g>
      <circle cx="30" cy="18" r="8" fill="#d2a548" stroke={INK} strokeWidth="2" />
      <circle cx="72" cy="16" r="8" fill="#e8708a" stroke={INK} strokeWidth="2" />
      <circle cx="50" cy="10" r="7" fill="#fff" stroke={INK} strokeWidth="2" />
      <path
        d="M41 58h18v10c0 7 17 12 17 40 0 17-9 28-26 28s-26-11-26-28c0-28 17-33 17-40z"
        fill="#f3d9bd"
        stroke={INK}
        strokeWidth="2.500"
        strokeLinejoin="round"
      />
      <path d="M26 100h48" stroke="#e0b184" strokeWidth="3" />
      <path d="M32 82c-2 8-2 14 0 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Candle(props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <path d="M50 54V40" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 10c8 9 9 16 0 25-9-9-8-16 0-25z" fill="#d2a548" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 42h52v42c0 7-5 12-12 12H36c-7 0-12-5-12-12z" fill="#fff" fillOpacity=".6" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M26.500 54h47v30c0 6-4 10-10 10H36.500c-6 0-10-4-10-10z" fill="#f4e3b8" />
      <path d="M32 50v30" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Plates(props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <ellipse cx="50" cy="68" rx="40" ry="14" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <path d="M10 56v12M90 56v12" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="50" cy="56" rx="40" ry="14" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="50" cy="56" rx="26" ry="8" fill="#f6ecd2" stroke="#d9bf72" strokeWidth="2" />
    </svg>
  );
}