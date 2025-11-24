import React from 'react';
import { MatchData, Opponent, WeeklyAvailability, DailyAvailability } from '../types';
import { CHAMPIONSHIPS } from '../constants';
import { Button } from './Button';
import { Calendar, Clock, User, Hash, MessageCircle, Shield, Info } from 'lucide-react';
import { SmartScheduler } from './SmartScheduler';

interface ScheduleFormProps {
  data: MatchData;
  opponents: Opponent[];
  onChange: (data: MatchData) => void;
  onGenerate: () => void;
}

interface DayRowProps {
  label: string;
  dayData: DailyAvailability;
  isLast?: boolean;
  onChange: (slot: 'slot1' | 'slot2', field: 'start' | 'end', value: string) => void;
}

const inputBaseStyles = "w-full px-3 py-2 border border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors";
const selectBaseStyles = "w-full px-3 py-2 border border-slate-700 bg-slate-900/50 text-white rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer hover:bg-slate-800/50";

const generateTimeOptions = () => {
  const options = [{ value: '', label: '--:--' }];
  for (let h = 0; h < 24; h++) {
    const hour = h.toString().padStart(2, '0');
    options.push({ value: `${hour}:00`, label: `${hour}:00` });
    options.push({ value: `${hour}:30`, label: `${hour}:30` });
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

const DayRow: React.FC<DayRowProps> = ({ label, dayData, isLast, onChange }) => {
  const isOptionDisabled = (startTime: string, optionValue: string) => {
    if (!startTime || !optionValue) return false;
    return optionValue <= startTime;
  };

  const isActive = dayData.slot1.start || dayData.slot2.start;

  return (
    <div className={`py-3 ${!isLast ? 'border-b border-slate-800/50' : ''} transition-colors`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center min-w-[100px]">
          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
          <span className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>{label}</span>
        </div>

        <div className="flex-grow grid grid-cols-2 gap-2">
          {/* Slot 1 */}
          <div className="flex items-center gap-1 bg-slate-900/30 p-1 rounded border border-slate-800/50">
            <div className="relative w-full">
              <select
                className="w-full bg-transparent text-xs text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono"
                value={dayData.slot1.start}
                onChange={(e) => onChange('slot1', 'start', e.target.value)}
              >
                {TIME_OPTIONS.map(opt => <option key={`s1-start-${opt.value}`} value={opt.value} className="bg-slate-800">{opt.label}</option>)}
              </select>
            </div>
            <span className="text-slate-600 text-[10px]">➜</span>
            <div className="relative w-full">
              <select
                className="w-full bg-transparent text-xs text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono disabled:opacity-30"
                value={dayData.slot1.end}
                onChange={(e) => onChange('slot1', 'end', e.target.value)}
              >
                {TIME_OPTIONS.map(opt => (
                  <option
                    key={`s1-end-${opt.value}`}
                    value={opt.value}
                    disabled={isOptionDisabled(dayData.slot1.start, opt.value)}
                    className={isOptionDisabled(dayData.slot1.start, opt.value) ? "text-slate-500 bg-slate-800" : "bg-slate-800"}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slot 2 */}
          <div className="flex items-center gap-1 bg-slate-900/30 p-1 rounded border border-slate-800/50">
            <div className="relative w-full">
              <select
                className="w-full bg-transparent text-xs text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono"
                value={dayData.slot2.start}
                onChange={(e) => onChange('slot2', 'start', e.target.value)}
              >
                {TIME_OPTIONS.map(opt => <option key={`s2-start-${opt.value}`} value={opt.value} className="bg-slate-800">{opt.label}</option>)}
              </select>
            </div>
            <span className="text-slate-600 text-[10px]">➜</span>
            <div className="relative w-full">
              <select
                className="w-full bg-transparent text-xs text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono disabled:opacity-30"
                value={dayData.slot2.end}
                onChange={(e) => onChange('slot2', 'end', e.target.value)}
              >
                {TIME_OPTIONS.map(opt => (
                  <option
                    key={`s2-end-${opt.value}`}
                    value={opt.value}
                    disabled={isOptionDisabled(dayData.slot2.start, opt.value)}
                    className={isOptionDisabled(dayData.slot2.start, opt.value) ? "text-slate-500 bg-slate-800" : "bg-slate-800"}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ data, opponents, onChange, onGenerate }) => {

  const updateAvailability = (day: keyof WeeklyAvailability, slot: 'slot1' | 'slot2', field: 'start' | 'end', value: string) => {
    const newAvailability = { ...data.availability };

    newAvailability[day] = {
      ...newAvailability[day],
      [slot]: {
        ...newAvailability[day][slot],
        [field]: value
      }
    };

    if (field === 'start') {
      const currentEnd = newAvailability[day][slot].end;
      if (currentEnd && value && value >= currentEnd) {
        newAvailability[day][slot].end = '';
      }
    }

    onChange({ ...data, availability: newAvailability });
  };

  const selectedOpponent = opponents.find(o => String(o.id) === String(data.opponentId));

  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ] as const;

  return (
    <div className="space-y-6">

      {/* Basic Info & Opponent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Info Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <Info size={16} /> Informações
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Campeonato</label>
              <select
                value={data.championship}
                onChange={(e) => onChange({ ...data, championship: e.target.value })}
                className={selectBaseStyles}
              >
                {CHAMPIONSHIPS.map(c => <option key={c} value={c} className="bg-slate-800 text-white">{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Seu Nick (Mandante)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    list="host-suggestions"
                    value={data.host}
                    onChange={(e) => {
                      const newHost = e.target.value;
                      const found = opponents.find(o => o.name === newHost);

                      let newClub = data.hostClub;
                      if (newHost === '') {
                        newClub = '';
                      } else if (found) {
                        newClub = found.club || '';
                      }

                      onChange({
                        ...data,
                        host: newHost,
                        hostClub: newClub
                      });
                    }}
                    className={`${inputBaseStyles} pl-10`}
                    placeholder="Seu usuário ou selecione"
                  />
                  <datalist id="host-suggestions">
                    {opponents.map(op => (
                      <option key={op.id} value={op.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Seu Clube</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={data.hostClub}
                    onChange={(e) => onChange({ ...data, hostClub: e.target.value })}
                    className={`${inputBaseStyles} pl-10`}
                    placeholder="Seu time"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opponent Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
            <Shield size={16} /> Adversário
          </h3>

          <div className="flex-grow flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Selecionar</label>
              <select
                value={data.opponentId}
                onChange={(e) => onChange({ ...data, opponentId: e.target.value })}
                className={selectBaseStyles}
              >
                <option value="" className="bg-slate-800 text-slate-400">-- Selecione --</option>
                {opponents.map(op => (
                  <option key={op.id} value={op.id} className="bg-slate-800 text-white">{op.name}</option>
                ))}
              </select>
            </div>

            {selectedOpponent ? (
              <div className="bg-slate-800/50 rounded p-3 border border-slate-700/50 text-sm space-y-2 animate-in fade-in">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nome:</span>
                  <span className="text-slate-200 font-medium">{selectedOpponent.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clube:</span>
                  <span className="text-slate-200">{selectedOpponent.club || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tel:</span>
                  <span className="text-blue-400 font-mono">{selectedOpponent.phone}</span>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-600 text-xs border border-dashed border-slate-800 rounded p-4">
                Selecione para ver detalhes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Disponibilidade
          </h3>
          <SmartScheduler
            onScheduleParsed={(parsed) => {
              onChange({
                ...data,
                availability: {
                  ...data.availability,
                  ...parsed
                }
              });
            }}
          />
        </div>

        <div>
          <div className="space-y-1">
            {days.map((day, index) => (
              <DayRow
                key={day.key}
                label={day.label}
                dayData={data.availability[day.key]}
                onChange={(slot, field, val) => updateAvailability(day.key, slot, field, val)}
                isLast={index === days.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Observações</label>
          <textarea
            rows={2}
            value={data.observation}
            onChange={(e) => onChange({ ...data, observation: e.target.value })}
            className={`${inputBaseStyles} resize-none`}
            placeholder="Ex: Confirme até 2h antes..."
          />
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={onGenerate}
          disabled={!data.opponentId}
          className="h-12 text-base font-bold tracking-wide shadow-lg shadow-blue-500/10"
        >
          <MessageCircle className="mr-2" size={20} /> Gerar Mensagem
        </Button>
      </div>
    </div>
  );
};