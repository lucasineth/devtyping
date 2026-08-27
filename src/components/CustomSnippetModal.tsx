import React, { useState } from 'react';
import { Plus, Trash2, X, Code2, Sparkles, Check } from 'lucide-react';
import { CodeChallenge } from '../types';

interface CustomSnippetModalProps {
  isOpen: boolean;
  customChallenges: CodeChallenge[];
  onSaveChallenges: (challenges: CodeChallenge[]) => void;
  onClose: () => void;
}

export const CustomSnippetModal: React.FC<CustomSnippetModalProps> = ({
  isOpen,
  customChallenges,
  onSaveChallenges,
  onClose
}) => {
  const [snippets, setSnippets] = useState<CodeChallenge[]>(
    customChallenges.length > 0
      ? customChallenges
      : [
          {
            id: 'custom-1',
            title: 'Meu Comando 1',
            code: 'const result = await db.query("SELECT * FROM users");',
            description: 'Treino de query',
            language: 'javascript',
            difficulty: 'medium'
          },
          {
            id: 'custom-2',
            title: 'Meu Comando 2',
            code: 'docker-compose up -d --build',
            description: 'Comando de container',
            language: 'bash',
            difficulty: 'easy'
          }
        ]
  );

  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newLang, setNewLang] = useState('javascript');

  if (!isOpen) return null;

  const handleAddSnippet = () => {
    if (!newCode.trim()) return;
    const newItem: CodeChallenge = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim() || `Desafio ${snippets.length + 1}`,
      code: newCode.trim(),
      description: 'Snippet personalizado',
      language: newLang,
      difficulty: 'medium'
    };
    const updated = [...snippets, newItem];
    setSnippets(updated);
    setNewTitle('');
    setNewCode('');
  };

  const handleRemove = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  const handleSaveAndApply = () => {
    onSaveChallenges(snippets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161922] border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Treinar Códigos Personalizados
              </h2>
              <p className="text-xs text-slate-400">
                Cole comandos do seu trabalho, estudos ou entrevistas técnicas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add New Input */}
        <div className="my-4 p-4 bg-[#0d1017] rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Título (ex: Hook useDebounce)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#161922] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
            />
            <select
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              className="px-3 py-2 bg-[#161922] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="bash">Bash / Git</option>
              <option value="sql">SQL</option>
            </select>
          </div>

          <textarea
            placeholder="Cole o código a praticar (uma linha recomendada por fase)..."
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-[#161922] border border-slate-700 rounded-xl text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 resize-none"
          />

          <button
            onClick={handleAddSnippet}
            disabled={!newCode.trim()}
            className="w-full py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar à Lista
          </button>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-48">
          {snippets.map((snip, index) => (
            <div
              key={snip.id}
              className="p-3 bg-[#0e1117] border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-300 flex items-center gap-2">
                  <span>#{index + 1} {snip.title}</span>
                  <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 bg-slate-800 rounded">
                    {snip.language}
                  </span>
                </div>
                <div className="text-slate-400 font-mono text-[11px] truncate mt-1 text-cyan-200/80">
                  {snip.code}
                </div>
              </div>
              <button
                onClick={() => handleRemove(snip.id)}
                className="p-2 text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                title="Remover desafio"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {snippets.length} desafios configurados
          </span>
          <button
            onClick={handleSaveAndApply}
            disabled={snippets.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40"
          >
            <Check className="w-4 h-4" />
            Salvar e Jogar Trilha Personalizada
          </button>
        </div>
      </div>
    </div>
  );
};
