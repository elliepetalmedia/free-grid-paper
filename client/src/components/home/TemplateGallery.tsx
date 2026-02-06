
import React from 'react';
import { TemplateIcon, PaperType } from './TemplateIcon';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface GalleryItem {
    label: string;
    type: PaperType;
    route: string;
    category: 'General' | 'Art & Design' | 'Music' | 'Specialty';
    description?: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
    // General
    { label: 'Dot Grid', type: 'dot-grid', route: '/dot-grid', category: 'General', description: 'Flexible dot pattern for bullet journaling.' },
    { label: 'Graph Paper', type: 'graph-paper', route: '/graph', category: 'General', description: 'Standard grid for math and engineering.' },
    { label: 'Lined Paper', type: 'lined-paper', route: '/lined-paper', category: 'General', description: 'Classic ruled lines for writing.' },
    { label: 'Checklist', type: 'checklist', route: '/checklist', category: 'General', description: 'Lined paper with checkboxes.' },

    // Art & Design
    { label: 'Perspective Grid', type: 'perspective-grid', route: '/perspective-1', category: 'Art & Design', description: '1-point and 2-point perspective guides.' },
    { label: 'Isometric Dots', type: 'isometric-dots', route: '/isometric-dots', category: 'Art & Design', description: 'Triangular grid for 3D sketching.' },
    { label: 'Hexagon Grid', type: 'hex-grid', route: '/hex-paper', category: 'Art & Design', description: 'Honeycomb pattern for gaming and chemistry.' },
    { label: 'Comic Layout', type: 'comic-layout', route: '/comic-2x3', category: 'Art & Design', description: 'Panel templates for comics and manga.' },
    { label: 'Storyboard', type: 'storyboard', route: '/storyboard', category: 'Art & Design', description: '16:9 frames with note space.' },

    // Music
    { label: 'Music Staff', type: 'music-staff', route: '/music-staff', category: 'Music', description: 'Blank sheet music staves.' },
    { label: 'Guitar Tab', type: 'guitar-tab', route: '/guitar-tab', category: 'Music', description: '6-line tablature for guitar.' },
    { label: 'Bass Tab', type: 'bass-tab', route: '/bass-tab', category: 'Music', description: '4-line tablature for bass.' },

    // Specialty
    { label: 'Handwriting', type: 'handwriting', route: '/handwriting', category: 'Specialty', description: '3-line guides for penmanship practice.' },
    { label: 'Calligraphy', type: 'calligraphy', route: '/calligraphy', category: 'Specialty', description: 'Slanted guides for script writing.' },
    { label: 'Genkoyoushi', type: 'genkoyoushi', route: '/genkoyoushi', category: 'Specialty', description: 'Japanese manuscript paper squares.' },
    { label: 'Knitting Graph', type: 'knitting', route: '/knitting', category: 'Specialty', description: 'Grid for fiber arts patterns.' },
];

interface TemplateGalleryProps {
    onSelect: (route: string) => void;
    className?: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect, className }) => {
    const categories: GalleryItem['category'][] = ['General', 'Art & Design', 'Music', 'Specialty'];

    return (
        <div className={cn("flex flex-col gap-8 pb-4", className)}>
            {categories.map((category) => (
                <div key={category} className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                        {category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {GALLERY_ITEMS.filter(item => item.category === category).map((item) => (
                            <Button
                                key={item.route}
                                variant="outline"
                                className="h-auto flex flex-col items-center p-4 gap-3 bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group text-wrap"
                                onClick={() => onSelect(item.route)}
                            >
                                <div className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors">
                                    <TemplateIcon type={item.type} />
                                </div>
                                <div className="space-y-1 text-center">
                                    <span className="font-medium text-sm block">{item.label}</span>
                                    {item.description && (
                                        <span className="text-xs text-muted-foreground line-clamp-2 font-normal opacity-80">
                                            {item.description}
                                        </span>
                                    )}
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
