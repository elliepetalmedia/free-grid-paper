
import React from 'react';

export type PaperType = 'dot-grid' | 'graph-paper' | 'lined-paper' | 'music-staff' | 'checklist' | 'isometric-dots' | 'hex-grid' | 'knitting' | 'calligraphy' | 'handwriting' | 'guitar-tab' | 'bass-tab' | 'genkoyoushi' | 'perspective-grid' | 'comic-layout' | 'storyboard';

interface TemplateIconProps {
    type: PaperType;
    className?: string;
}

export const TemplateIcon: React.FC<TemplateIconProps> = ({ type, className = "w-full h-full" }) => {
    const stroke = "currentColor";

    switch (type) {
        case 'dot-grid':
            return (
                <svg viewBox="0 0 100 100" className={className} fill="none" stroke="none">
                    <circle cx="20" cy="20" r="4" fill={stroke} /> <circle cx="50" cy="20" r="4" fill={stroke} /> <circle cx="80" cy="20" r="4" fill={stroke} />
                    <circle cx="20" cy="50" r="4" fill={stroke} /> <circle cx="50" cy="50" r="4" fill={stroke} /> <circle cx="80" cy="50" r="4" fill={stroke} />
                    <circle cx="20" cy="80" r="4" fill={stroke} /> <circle cx="50" cy="80" r="4" fill={stroke} /> <circle cx="80" cy="80" r="4" fill={stroke} />
                </svg>
            );
        case 'graph-paper':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="6" fill="none">
                    <path d="M0 25 H100 M0 50 H100 M0 75 H100 M25 0 V100 M50 0 V100 M75 0 V100" />
                    <rect x="0" y="0" width="100" height="100" strokeWidth="8" />
                </svg>
            );
        case 'lined-paper':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="6" fill="none">
                    <line x1="0" y1="20" x2="100" y2="20" />
                    <line x1="0" y1="40" x2="100" y2="40" />
                    <line x1="0" y1="60" x2="100" y2="60" />
                    <line x1="0" y1="80" x2="100" y2="80" />
                    <line x1="20" y1="0" x2="20" y2="100" stroke="red" strokeOpacity="0.5" />
                </svg>
            );
        case 'music-staff':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="5" fill="none">
                    <path d="M10 20 H90 M10 35 H90 M10 50 H90 M10 65 H90 M10 80 H90" />
                    <path d="M25 20 Q 20 50 35 65" strokeWidth="3" opacity="0.7" />
                </svg>
            );
        case 'checklist':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="5" fill="none">
                    <rect x="10" y="15" width="15" height="15" rx="2" /> <line x1="35" y1="22" x2="90" y2="22" />
                    <rect x="10" y="45" width="15" height="15" rx="2" /> <line x1="35" y1="52" x2="90" y2="52" />
                    <rect x="10" y="75" width="15" height="15" rx="2" /> <line x1="35" y1="82" x2="90" y2="82" />
                </svg>
            );
        case 'isometric-dots':
            return (
                <svg viewBox="0 0 100 100" className={className} fill="none" stroke="none">
                    <circle cx="20" cy="20" r="4" fill={stroke} /> <circle cx="50" cy="20" r="4" fill={stroke} /> <circle cx="80" cy="20" r="4" fill={stroke} />
                    <circle cx="35" cy="35" r="4" fill={stroke} /> <circle cx="65" cy="35" r="4" fill={stroke} />
                    <circle cx="20" cy="50" r="4" fill={stroke} /> <circle cx="50" cy="50" r="4" fill={stroke} /> <circle cx="80" cy="50" r="4" fill={stroke} />
                </svg>
            );
        case 'hex-grid':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="5" fill="none">
                    <path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" />
                    <path d="M50 20 V5" /> <path d="M75 35 L90 25" /> <path d="M75 65 L90 75" />
                    <path d="M50 80 V95" /> <path d="M25 65 L10 75" /> <path d="M25 35 L10 25" />
                </svg>
            );
        case 'knitting':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="5" fill="none">
                    <path d="M10 30 Q 20 10 30 30 Q 40 50 50 30" />
                    <path d="M50 30 Q 60 10 70 30 Q 80 50 90 30" />
                    <path d="M10 60 Q 20 40 30 60 Q 40 80 50 60" />
                    <path d="M50 60 Q 60 40 70 60 Q 80 80 90 60" />
                </svg>
            );
        case 'calligraphy':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="4" fill="none">
                    <line x1="10" y1="30" x2="90" y2="30" />
                    <line x1="10" y1="70" x2="90" y2="70" />
                    <line x1="40" y1="90" x2="60" y2="10" strokeDasharray="5,5" />
                    <line x1="60" y1="90" x2="80" y2="10" strokeDasharray="5,5" />
                </svg>
            );
        case 'handwriting':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="5" fill="none">
                    <line x1="10" y1="20" x2="90" y2="20" />
                    <line x1="10" y1="50" x2="90" y2="50" strokeDasharray="10,5" strokeWidth="3" />
                    <line x1="10" y1="80" x2="90" y2="80" />
                </svg>
            );
        case 'guitar-tab':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="4" fill="none">
                    <line x1="10" y1="10" x2="90" y2="10" />
                    <line x1="10" y1="26" x2="90" y2="26" />
                    <line x1="10" y1="42" x2="90" y2="42" />
                    <line x1="10" y1="58" x2="90" y2="58" />
                    <line x1="10" y1="74" x2="90" y2="74" />
                    <line x1="10" y1="90" x2="90" y2="90" />
                    <text x="12" y="55" fontSize="20" stroke="none" fill={stroke} opacity="0.5">T</text>
                </svg>
            );
        case 'bass-tab':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="4" fill="none">
                    <line x1="10" y1="20" x2="90" y2="20" />
                    <line x1="10" y1="40" x2="90" y2="40" />
                    <line x1="10" y1="60" x2="90" y2="60" />
                    <line x1="10" y1="80" x2="90" y2="80" />
                    <text x="12" y="55" fontSize="20" stroke="none" fill={stroke} opacity="0.5">B</text>
                </svg>
            );
        case 'genkoyoushi':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="4" fill="none">
                    <rect x="25" y="10" width="50" height="80" />
                    <rect x="30" y="15" width="40" height="30" />
                    <rect x="30" y="55" width="40" height="30" />
                    <line x1="50" y1="15" x2="50" y2="45" strokeDasharray="3,3" strokeWidth="2" />
                    <line x1="30" y1="30" x2="70" y2="30" strokeDasharray="3,3" strokeWidth="2" />
                </svg>
            );
        case 'perspective-grid':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="3" fill="none">
                    <line x1="0" y1="50" x2="100" y2="50" />
                    <line x1="50" y1="50" x2="10" y2="10" />
                    <line x1="50" y1="50" x2="90" y2="10" />
                    <line x1="50" y1="50" x2="10" y2="90" />
                    <line x1="50" y1="50" x2="90" y2="90" />
                </svg>
            );
        case 'comic-layout':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="5" fill="none">
                    <rect x="10" y="10" width="35" height="35" />
                    <rect x="55" y="10" width="35" height="35" />
                    <rect x="10" y="55" width="35" height="35" />
                    <rect x="55" y="55" width="35" height="35" />
                </svg>
            );
        case 'storyboard':
            return (
                <svg viewBox="0 0 100 100" className={className} stroke={stroke} strokeWidth="4" fill="none">
                    <rect x="10" y="20" width="80" height="45" />
                    <line x1="10" y1="75" x2="90" y2="75" />
                    <line x1="10" y1="85" x2="90" y2="85" />
                </svg>
            );
        default:
            return null;
    }
};
