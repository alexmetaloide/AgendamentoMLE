import React, { useState } from 'react';
import { Opponent } from '../types';
import { Button } from './Button';
import { Trash2, Edit2, Plus, Save, X, Search, Users, Phone, Shield } from 'lucide-react';

interface OpponentManagerProps {
  opponents: Opponent[];
  onAdd: (opponent: Omit<Opponent, 'id'>) => Promise<void>;
  onUpdate: (id: string | number, opponent: Partial<Opponent>) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
  onBack: () => void;
}

export const OpponentManager: React.FC<OpponentManagerProps> = ({ opponents, onAdd, onUpdate, onDelete, onBack }) => {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Opponent>>({});
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Tem certeza que deseja excluir este adversário?')) {
      try {
        setLoading(true);
        await onDelete(id);
      } catch (error) {
        alert('Erro ao excluir adversário');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditStart = (opponent: Opponent) => {
    setEditingId(opponent.id);
    setEditForm(opponent);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editForm.name || !editForm.phone) return;

    try {
      setLoading(true);
      if (editingId === 0) {
        // New Item
        await onAdd(editForm as Omit<Opponent, 'id'>);
      } else {
        // Update Item
        if (editingId) {
          await onUpdate(editingId, editForm);
        }
      }
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      alert('Erro ao salvar adversário');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(0);
    setEditForm({ name: '', phone: '', club: '', observation: '' });
  };

  const inputClass = "w-full border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 border";

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Users className="text-blue-500" size={18} /> Gerenciar Adversários
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Cadastre os contatos para agilizar.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} size="sm" className="h-9 text-xs">Voltar</Button>
          <Button onClick={handleAddNew} variant="primary" size="sm" className="h-9 text-xs flex items-center gap-1">
            <Plus size={14} /> Novo
          </Button>
        </div>
      </div>

      {/* Edit Form (New or Existing) */}
      {(editingId === 0 || (editingId && opponents.find(op => op.id === editingId))) && (
        <div className="bg-slate-800/80 border border-blue-500/30 rounded-lg p-4 animate-in slide-in-from-top-2">
          <h4 className="text-sm font-medium text-blue-400 mb-3">
            {editingId === 0 ? 'Novo Adversário' : 'Editar Adversário'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nome</label>
              <input
                type="text"
                placeholder="Nome"
                className={inputClass}
                autoFocus
                value={editForm.name || ''}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Telefone</label>
              <input
                type="text"
                placeholder="558599999999"
                className={inputClass}
                value={editForm.phone || ''}
                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Clube</label>
              <input
                type="text"
                placeholder="Time"
                className={inputClass}
                value={editForm.club || ''}
                onChange={e => setEditForm({ ...editForm, club: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={handleEditCancel} disabled={loading}>Cancelar</Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={loading} className="min-w-[80px]">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opponents.length === 0 && editingId !== 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
            Nenhum adversário cadastrado.
          </div>
        )}

        {opponents.map((opponent) => (
          <div
            key={opponent.id}
            className={`bg-slate-900/50 border border-slate-800 rounded-lg p-3 flex flex-col justify-between group hover:border-slate-700 transition-colors ${editingId === opponent.id ? 'hidden' : ''}`}
          >
            <div className="mb-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-200">{opponent.name}</h4>
                <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{opponent.club || 'Sem clube'}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-400 font-mono">
                <Phone size={12} /> {opponent.phone}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/50">
              <button
                onClick={() => handleEditStart(opponent)}
                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                title="Editar"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => handleDelete(e, opponent.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                title="Excluir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};