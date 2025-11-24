import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { Button } from './Button';
import { parseScheduleText } from '../utils/scheduleParser';
import { WeeklyAvailability } from '../types';

interface SmartSchedulerProps {
    onScheduleParsed: (availability: Partial<WeeklyAvailability>) => void;
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({ onScheduleParsed }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [parsed, setParsed] = useState<Partial<WeeklyAvailability> | null>(null);

    const handleProcess = () => {
        const result = parseScheduleText(text);
        setParsed(result);
    };

    const handleApply = () => {
        if (parsed) {
            onScheduleParsed(parsed);
            setIsOpen(false);
            setText('');
            setParsed(null);
        }
    };

    const hasResults = parsed && Object.keys(parsed).length > 0;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
                <Sparkles size={14} />
                Assistente IA
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Sparkles size={16} className="text-blue-500" />
                                Agendamento Inteligente
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-xs text-blue-200">
                                    Digite seus horários de forma natural. <br />
                                    Ex: <span className="font-mono text-blue-100">"Segunda e Terça das 20h as 23h, Sexta livre"</span>
                                </p>
                            </div>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Cole ou digite sua disponibilidade aqui..."
                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                            />

                            {hasResults && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detectado:</h4>
                                    <div className="bg-slate-950/50 rounded-lg border border-slate-800 p-3 max-h-40 overflow-y-auto space-y-1">
                                        {Object.entries(parsed!).map(([day, slots]) => {
                                            const dailySlots = slots as any;
                                            return (
                                                <div key={day} className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-300 capitalize">{day}</span>
                                                    <span className="font-mono text-blue-400">
                                                        {dailySlots?.slot1?.start ? `${dailySlots.slot1.start} - ${dailySlots.slot1.end}` : 'Livre'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                            {!hasResults ? (
                                <Button
                                    variant="primary"
                                    onClick={handleProcess}
                                    disabled={!text.trim()}
                                    className="w-full sm:w-auto"
                                >
                                    Processar Texto
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => { setParsed(null); setText(''); }}
                                        className="flex-1 sm:flex-none"
                                    >
                                        Limpar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleApply}
                                        className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
                                    >
                                        <Check size={16} className="mr-2" />
                                        Aplicar Horários
                                    </Button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
