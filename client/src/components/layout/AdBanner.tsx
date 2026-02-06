import { FC } from 'react';

interface AdBannerProps {
    slotId?: string;
    format?: 'horizontal' | 'rectangle';
    className?: string;
}

export const AdBanner: FC<AdBannerProps> = ({ slotId, format = 'horizontal', className = '' }) => {
    // In development/no-ads mode, we show a clean placeholder or nothing
    // For now, we will render a subtle placeholder structure where an ad WILL go

    const isDev = false; // Set to true to see debug placeholders

    if (!isDev) {
        // In production (before actual ad code is inserted), we might want to collapse this or show a "Support Us" banner
        // For this phase, the user requested "unobtrusive ads, likely at the bottom".
        // We will render a semantic container that can be targeted later.
        return (
            <div className={`w-full flex justify-center py-6 min-h-[100px] bg-slate-50 border-t border-slate-100 ${className}`}>
                {/* Future AdSense Code will go here */}
                <div className="w-[728px] max-w-full h-[90px] bg-slate-100 rounded-md flex items-center justify-center text-slate-300 text-xs uppercase tracking-widest">

                </div>
            </div>
        );
    }

    return (
        <div className={`w-full flex justify-center py-4 my-8 bg-slate-50 ${className}`}>
            <div
                className={`
          flex items-center justify-center bg-slate-200 text-slate-400 border-2 border-dashed border-slate-300 rounded-lg
          ${format === 'horizontal' ? 'w-[728px] h-[90px]' : 'w-[300px] h-[250px]'}
        `}
            >
                <span className="text-xs font-mono">AD SPACE {slotId}</span>
            </div>
        </div>
    );
};
