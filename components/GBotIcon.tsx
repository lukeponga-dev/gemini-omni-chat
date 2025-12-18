import React from 'react';

interface GBotIconProps {
    size?: number;
    isAnimating?: boolean;
    className?: string;
}

const GBotIcon: React.FC<GBotIconProps> = ({ size = 64, isAnimating = false, className = '' }) => {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-blue-600/30 blur-xl animate-pulse"></div>

            {/* Main sphere */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 shadow-2xl shadow-cyan-500/50">
                {/* Inner highlight */}
                <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] rounded-full bg-white/40 blur-md"></div>

                {/* Energy swirl overlay */}
                <svg
                    className={`absolute inset-0 w-full h-full ${isAnimating ? 'animate-spin-slow' : ''}`}
                    viewBox="0 0 100 100"
                    style={{ animationDuration: '8s' }}
                >
                    <defs>
                        <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>

                    {/* Energy swirl path - "G" shape */}
                    <path
                        d="M 50 20 
               A 30 30 0 1 1 50 80
               A 30 30 0 0 1 50 20
               M 50 35
               L 65 50
               L 50 50
               Z"
                        fill="none"
                        stroke="url(#energyGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.9"
                    />

                    {/* Additional energy particles */}
                    <circle cx="50" cy="20" r="2" fill="#22d3ee" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="50" r="2" fill="#3b82f6" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="80" r="2" fill="#1e40af" opacity="0.7">
                        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
                    </circle>
                </svg>

                {/* "G" letter */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className="font-bold text-white drop-shadow-lg"
                        style={{ fontSize: size * 0.5 }}
                    >
                        G
                    </span>
                </div>
            </div>

            {/* Rotating ring when animating */}
            {isAnimating && (
                <div className="absolute inset-[-10%] rounded-full border-2 border-cyan-400/50 animate-spin" style={{ animationDuration: '3s' }}></div>
            )}
        </div>
    );
};

export default GBotIcon;
