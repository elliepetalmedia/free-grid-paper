import React from 'react';
import { Link } from 'wouter';
import { TemplateIcon, PaperType } from './TemplateIcon';
import { cn } from '@/lib/utils';
import { categories, getTemplatesForCategory } from '@/content';

interface TemplateGalleryProps {
  onSelect: (route: string) => void;
  className?: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect, className }) => {
  return (
    <div className={cn("flex flex-col gap-8 pb-4", className)}>
      {categories.map((category) => {
        const categoryTemplates = getTemplatesForCategory(category.id);
        return (
          <div key={category.id} className="space-y-4">
            <div>
              <Link href={category.path} className="text-sm font-bold text-primary uppercase tracking-widest hover:underline">
                {category.h1}
              </Link>
              <p className="text-sm text-slate-500 mt-1">{category.summary}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categoryTemplates.map((template) => (
                <Link key={template.path} href={template.path} onClick={() => onSelect(template.path)}>
                  <a className="group relative flex flex-col rounded-lg overflow-hidden border-2 border-slate-600 hover:border-primary transition-all shadow-md hover:shadow-xl hover:scale-[1.02] bg-slate-800 cursor-pointer text-left block">
                    <div className="flex items-center justify-center p-4 h-28 bg-slate-700 group-hover:bg-slate-600 transition-colors">
                      <div className="w-full h-full max-w-[100px] text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <TemplateIcon type={template.settings.paperType as PaperType} />
                      </div>
                    </div>
                    <div className="px-3 py-2 bg-slate-800 text-center">
                      <span className="font-semibold text-sm text-white block truncate">{template.label}</span>
                      <span className="text-xs text-slate-400 line-clamp-1">{template.summary}</span>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
