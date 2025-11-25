import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, Trophy, LogOut } from 'lucide-react';
import { ViewMode, Opponent, MatchData } from './types';
import { INITIAL_MATCH_DATA } from './constants';
import { OpponentManager } from './components/OpponentManager';
import { ScheduleForm } from './components/ScheduleForm';
import { MessagePreview } from './components/MessagePreview';
import { OpponentService } from './services/opponentService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoginForm } from './components/LoginForm';
import { LanguageSelector } from './components/LanguageSelector';

function AppContent() {
  const { logout } = useAuth();

  // State for Opponents (fetched from Firebase)
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOpponents = async () => {
    try {
      const data = await OpponentService.getAll();
      setOpponents(data);
    } catch (error) {
      console.error("Failed to load opponents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpponents();
  }, []);

  const handleAddOpponent = async (opponent: Omit<Opponent, 'id'>) => {
    const newOpponent = await OpponentService.add(opponent);
    setOpponents(prev => [...prev, newOpponent]);
  };

  const handleUpdateOpponent = async (id: string | number, opponent: Partial<Opponent>) => {
    await OpponentService.update(id, opponent);
    setOpponents(prev => prev.map(op => String(op.id) === String(id) ? { ...op, ...opponent } as Opponent : op));
  };

  const handleDeleteOpponent = async (id: string | number) => {
    await OpponentService.delete(id);
    setOpponents(prev => prev.filter(op => String(op.id) !== String(id)));
  };

  const [view, setView] = useState<ViewMode>('form');
  const [formData, setFormData] = useState<MatchData>(INITIAL_MATCH_DATA);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);

  const generateMessage = () => {
    const opponent = opponents.find(o => String(o.id) === String(formData.opponentId));
    if (!opponent) return;

    const formatSlot = (start?: string, end?: string) => {
      if (!start && !end) return null;
      if (start && !end) return `${start} em diante`;
      if (!start && end) return `Até ${end}`;
      return `${start} às ${end}`;
    };

    const av = formData.availability;

    const daysMap: Array<{ key: keyof typeof av, label: string }> = [
      { key: 'monday', label: 'Segunda-feira' },
      { key: 'tuesday', label: 'Terça-feira' },
      { key: 'wednesday', label: 'Quarta-feira' },
      { key: 'thursday', label: 'Quinta-feira' },
      { key: 'friday', label: 'Sexta-feira' },
      { key: 'saturday', label: 'Sábado' },
      { key: 'sunday', label: 'Domingo' },
    ];

    const availabilityLines = daysMap.map(day => {
      const dayData = av[day.key];
      const s1 = formatSlot(dayData.slot1.start, dayData.slot1.end);
      const s2 = formatSlot(dayData.slot2.start, dayData.slot2.end);

      if (!s1 && !s2) return `${day.label}: Indisponível`;

      let slotsText = "";
      if (s1 && s2) {
        slotsText = `${s1} | ${s2}`;
      } else if (s1) {
        slotsText = s1;
      } else if (s2) {
        slotsText = s2;
      }

      return `${day.label}: ${slotsText}`;
    }).join('\n');

    const msg = `🎮 AGENDAMENTO OFICIAL DE PARTIDA – ${formData.championship}

👤 Mandante: ${formData.host}
🏴‍☠️ Clube: ${formData.hostClub}
⚔️ Adversário: ${opponent.name}
📞 Contato: ${formData.host} (via WhatsApp)

Disponibilidade:
${availabilityLines}

${formData.observation ? `📝 Observação: ${formData.observation}\n\n` : ''}Aguardo confirmação para a melhor data e horário.

Atenciosamente,
${formData.host}`;

    setGeneratedMessage(msg);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600/10 p-2 rounded-lg">
              <Trophy className="text-blue-500 w-5 h-5" />
            </div>
            <h1 className="text-base font-bold tracking-tight text-slate-100">
              Agendamentos <span className="text-blue-500">MLE</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800/50">
              <button
                onClick={() => setView('form')}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-2 ${view === 'form'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <CalendarDays size={14} />
                <span>Agendar</span>
              </button>
              <button
                onClick={() => setView('opponents')}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-2 ${view === 'opponents'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Users size={14} />
                <span>Adversários</span>
              </button>
            </nav>

            <LanguageSelector />

            <button
              onClick={logout}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-md hover:bg-slate-800"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-6">
        {view === 'opponents' ? (
          <OpponentManager
            opponents={opponents}
            onAdd={handleAddOpponent}
            onUpdate={handleUpdateOpponent}
            onDelete={handleDeleteOpponent}
            onBack={() => setView('form')}
          />
        ) : (
          <ScheduleForm
            data={formData}
            opponents={opponents}
            onChange={setFormData}
            onGenerate={generateMessage}
          />
        )}
      </main>

      {/* Footer simple */}
      <footer className="py-6 text-center text-slate-600 text-xs border-t border-slate-800/50 mt-auto">
        <p>&copy; {new Date().getFullYear()} Master League Elite</p>
      </footer>

      {/* Modal for Message */}
      {generatedMessage && (
        <MessagePreview
          message={generatedMessage}
          phoneNumber={opponents.find(o => String(o.id) === String(formData.opponentId))?.phone || ''}
          onClose={() => setGeneratedMessage(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppAuthWrapper />
      </AuthProvider>
    </LanguageProvider>
  );
}

function AppAuthWrapper() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <AppContent />;
}

export default App;