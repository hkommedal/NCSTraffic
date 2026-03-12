"use client";

/**
 * Animated puffin bird SVG that bobs gently and blinks.
 * Used as the tutorial guide mascot.
 */
export default function PuffinGuide({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="puffin-bob"
      aria-hidden="true"
    >
      <style>{`
        .puffin-bob {
          animation: puffinBob 2s ease-in-out infinite;
        }
        @keyframes puffinBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .puffin-blink {
          animation: puffinBlink 4s ease-in-out infinite;
        }
        @keyframes puffinBlink {
          0%, 42%, 46%, 100% { transform: scaleY(1); }
          44% { transform: scaleY(0.05); }
        }
        .puffin-wing {
          animation: puffinWing 2s ease-in-out infinite;
          transform-origin: 45px 68px;
        }
        @keyframes puffinWing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-4deg); }
        }
      `}</style>

      {/* Body — black */}
      <ellipse cx="60" cy="72" rx="28" ry="32" fill="#1a1a2e" />

      {/* Belly — white */}
      <ellipse cx="60" cy="78" rx="18" ry="24" fill="#f8f8f8" />

      {/* Left wing */}
      <ellipse
        cx="35"
        cy="68"
        rx="10"
        ry="22"
        fill="#1a1a2e"
        className="puffin-wing"
      />

      {/* Right wing (mirrored) */}
      <ellipse
        cx="85"
        cy="68"
        rx="10"
        ry="22"
        fill="#1a1a2e"
        style={{
          animation: "puffinWing 2s ease-in-out infinite",
          transformOrigin: "85px 68px",
        }}
      />

      {/* Head — black */}
      <circle cx="60" cy="38" r="22" fill="#1a1a2e" />

      {/* White face patch */}
      <ellipse cx="60" cy="42" rx="15" ry="14" fill="#f0f0f0" />

      {/* Left eye */}
      <g className="puffin-blink" style={{ transformOrigin: "52px 35px" }}>
        <circle cx="52" cy="35" r="4.5" fill="white" />
        <circle cx="52" cy="35" r="2.8" fill="#1a1a2e" />
        <circle cx="53.2" cy="33.8" r="1" fill="white" />
      </g>

      {/* Right eye */}
      <g className="puffin-blink" style={{ transformOrigin: "68px 35px" }}>
        <circle cx="68" cy="35" r="4.5" fill="white" />
        <circle cx="68" cy="35" r="2.8" fill="#1a1a2e" />
        <circle cx="69.2" cy="33.8" r="1" fill="white" />
      </g>

      {/* Beak base — orange/red */}
      <path d="M52 44 L60 54 L68 44 Z" fill="#e85d04" />

      {/* Beak stripe — yellow */}
      <path d="M54 44 L60 51 L66 44 Z" fill="#ffbe0b" />

      {/* Beak tip — red */}
      <path d="M57 48 L60 54 L63 48 Z" fill="#d00000" />

      {/* Feet — orange */}
      <ellipse cx="50" cy="103" rx="8" ry="3.5" fill="#e85d04" />
      <ellipse cx="70" cy="103" rx="8" ry="3.5" fill="#e85d04" />

      {/* Legs */}
      <line x1="52" y1="97" x2="50" y2="103" stroke="#e85d04" strokeWidth="3" strokeLinecap="round" />
      <line x1="68" y1="97" x2="70" y2="103" stroke="#e85d04" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
