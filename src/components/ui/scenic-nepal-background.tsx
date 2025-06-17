import React from "react";

interface ScenicNepalBackgroundProps {
  className?: string;
}

export const ScenicNepalBackground: React.FC<ScenicNepalBackgroundProps> = ({
  className = "absolute inset-0 w-full h-full object-cover",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#98D8E8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#B0E0E6" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B7355" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5D4E37" stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="hillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#90EE90" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#228B22" stopOpacity="0.5" />
        </linearGradient>

        <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4682B4" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#87CEEB" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4682B4" stopOpacity="0.4" />
        </linearGradient>

        <pattern
          id="texturePattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="1" fill="#ffffff" opacity="0.1" />
          <circle cx="60" cy="40" r="1" fill="#ffffff" opacity="0.1" />
          <circle cx="40" cy="70" r="1" fill="#ffffff" opacity="0.1" />
          <circle cx="80" cy="90" r="1" fill="#ffffff" opacity="0.1" />
        </pattern>
      </defs>

      {/* Background base */}
      <rect width="1920" height="1080" fill="url(#skyGradient)" />

      {/* Distant mountains */}
      <path
        d="M0,400 Q200,350 400,380 T800,360 Q1000,340 1200,370 T1600,350 Q1800,330 1920,360 L1920,500 L0,500 Z"
        fill="url(#mountainGradient)"
        opacity="0.6"
      />

      {/* Second layer mountains */}
      <path
        d="M0,450 Q300,420 600,440 T1200,430 Q1500,410 1920,440 L1920,600 L0,600 Z"
        fill="url(#mountainGradient)"
        opacity="0.4"
      />

      {/* Rolling hills with terraces */}
      <path
        d="M0,600 Q200,580 400,600 Q600,580 800,600 Q1000,580 1200,600 Q1400,580 1600,600 Q1800,580 1920,600 L1920,800 L0,800 Z"
        fill="url(#hillGradient)"
      />

      {/* Terraced fields */}
      <g opacity="0.6">
        <path
          d="M100,650 Q300,640 500,650 Q700,640 900,650"
          stroke="#2F5233"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M200,680 Q400,670 600,680 Q800,670 1000,680"
          stroke="#2F5233"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M1100,660 Q1300,650 1500,660 Q1700,650 1900,660"
          stroke="#2F5233"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M1200,690 Q1400,680 1600,690 Q1800,680 1920,690"
          stroke="#2F5233"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
      </g>

      {/* River */}
      <path
        d="M0,800 Q200,780 400,800 Q600,820 800,800 Q1000,780 1200,800 Q1400,820 1600,800 Q1800,780 1920,800 L1920,820 Q1800,800 1600,820 Q1400,840 1200,820 Q1000,800 800,820 Q600,840 400,820 Q200,800 0,820 Z"
        fill="url(#riverGradient)"
      />

      {/* Traditional houses */}
      <g opacity="0.8">
        {/* House 1 */}
        <g transform="translate(300,700)">
          <rect
            x="0"
            y="20"
            width="40"
            height="30"
            fill="#8B4513"
            opacity="0.6"
          />
          <path d="M-5,20 L20,0 L45,20 Z" fill="#CD853F" opacity="0.7" />
          <rect
            x="15"
            y="35"
            width="10"
            height="15"
            fill="#654321"
            opacity="0.8"
          />
        </g>

        {/* House 2 */}
        <g transform="translate(1200,720)">
          <rect
            x="0"
            y="15"
            width="35"
            height="25"
            fill="#8B4513"
            opacity="0.6"
          />
          <path d="M-4,15 L17.5,0 L39,15 Z" fill="#CD853F" opacity="0.7" />
          <rect
            x="12"
            y="28"
            width="8"
            height="12"
            fill="#654321"
            opacity="0.8"
          />
        </g>

        {/* House 3 */}
        <g transform="translate(800,710)">
          <rect
            x="0"
            y="18"
            width="38"
            height="28"
            fill="#8B4513"
            opacity="0.6"
          />
          <path d="M-5,18 L19,2 L43,18 Z" fill="#CD853F" opacity="0.7" />
          <rect
            x="14"
            y="32"
            width="9"
            height="14"
            fill="#654321"
            opacity="0.8"
          />
        </g>
      </g>

      {/* Trees and vegetation */}
      <g opacity="0.7">
        {/* Tree 1 */}
        <g transform="translate(150,750)">
          <rect
            x="18"
            y="30"
            width="4"
            height="20"
            fill="#8B4513"
            opacity="0.6"
          />
          <circle cx="20" cy="30" r="12" fill="#228B22" opacity="0.5" />
        </g>

        {/* Tree 2 */}
        <g transform="translate(950,760)">
          <rect
            x="16"
            y="25"
            width="3"
            height="15"
            fill="#8B4513"
            opacity="0.6"
          />
          <circle cx="17.5" cy="25" r="10" fill="#32CD32" opacity="0.5" />
        </g>

        {/* Tree 3 */}
        <g transform="translate(1500,750)">
          <rect
            x="17"
            y="28"
            width="4"
            height="18"
            fill="#8B4513"
            opacity="0.6"
          />
          <circle cx="19" cy="28" r="11" fill="#228B22" opacity="0.5" />
        </g>
      </g>

      {/* Wildlife silhouettes */}
      <g opacity="0.4">
        {/* Goat 1 */}
        <g transform="translate(400,780)">
          <ellipse cx="8" cy="8" rx="6" ry="4" fill="#696969" />
          <circle cx="2" cy="6" r="2" fill="#696969" />
        </g>

        {/* Buffalo */}
        <g transform="translate(1100,790)">
          <ellipse cx="12" cy="6" rx="10" ry="5" fill="#2F2F2F" />
          <circle cx="2" cy="4" r="3" fill="#2F2F2F" />
        </g>

        {/* Goat 2 */}
        <g transform="translate(1400,785)">
          <ellipse cx="7" cy="7" rx="5" ry="3" fill="#696969" />
          <circle cx="2" cy="5" r="2" fill="#696969" />
        </g>
      </g>

      {/* Agricultural patterns */}
      <g opacity="0.3">
        <rect x="500" y="750" width="200" height="2" fill="#4F7942" />
        <rect x="520" y="760" width="180" height="2" fill="#4F7942" />
        <rect x="540" y="770" width="160" height="2" fill="#4F7942" />

        <rect x="1300" y="760" width="150" height="2" fill="#4F7942" />
        <rect x="1320" y="770" width="130" height="2" fill="#4F7942" />
        <rect x="1340" y="780" width="110" height="2" fill="#4F7942" />
      </g>

      {/* Clouds */}
      <g opacity="0.3">
        {/* Cloud 1 */}
        <g transform="translate(300,200)">
          <circle cx="0" cy="0" r="25" fill="white" />
          <circle cx="20" cy="0" r="30" fill="white" />
          <circle cx="40" cy="0" r="25" fill="white" />
        </g>

        {/* Cloud 2 */}
        <g transform="translate(1200,180)">
          <circle cx="0" cy="0" r="20" fill="white" />
          <circle cx="15" cy="0" r="25" fill="white" />
          <circle cx="30" cy="0" r="20" fill="white" />
        </g>

        {/* Cloud 3 */}
        <g transform="translate(1600,220)">
          <circle cx="0" cy="0" r="22" fill="white" />
          <circle cx="18" cy="0" r="28" fill="white" />
          <circle cx="36" cy="0" r="22" fill="white" />
        </g>
      </g>

      {/* Subtle texture overlay */}
      <rect
        width="1920"
        height="1080"
        fill="url(#texturePattern)"
        opacity="0.1"
      />
    </svg>
  );
};
