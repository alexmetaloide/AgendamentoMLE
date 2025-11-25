import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Locale } from '../contexts/LanguageContext';

const languages: { code: Locale; name: string; flag: string }[] = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' }
];

export const LanguageSelector: React.FC = () => {
    const { locale, setLocale } = useLanguage();
    const currentLang = languages.find(l => l.code === locale) || languages[0];

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                <span className="text-lg">{currentLang.flag}</span>
                <Globe size={16} />
            </button>

            <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-700 transition-colors first:rounded-t-md last:rounded-b-md ${lang.code === locale ? 'bg-slate-700 text-white' : 'text-slate-300'
                            }`}
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
