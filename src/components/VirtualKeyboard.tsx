import React from 'react';
import { Keyboard as KeyboardIcon, Eye, EyeOff } from 'lucide-react';

interface VirtualKeyboardProps {
  nextChar: string | null;
  showKeyboard: boolean;
  onToggleShow: () => void;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

// Map characters to main key name on standard layout
function normalizeKey(char: string | null): string {
  if (!char) return '';
  if (char === ' ') return 'Space';
  if (char === '\n') return 'Enter';
  if (char === '\t') return 'Tab';
  
  const upperMap: Record<string, string> = {
    '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
    '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-',
    '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'",
    '<': ',', '>': '.', '?': '/',
    'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'Á': 'a', 'À': 'a', 'Ã': 'a', 'Â': 'a',
    'é': 'e', 'ê': 'e', 'É': 'e', 'Ê': 'e',
    'í': 'i', 'Í': 'i',
    'ó': 'o', 'ô': 'o', 'õ': 'o', 'Ó': 'o', 'Ô': 'o', 'Õ': 'o',
    'ú': 'u', 'ü': 'u', 'Ú': 'u', 'Ü': 'u',
    'ç': 'c', 'Ç': 'c'
  };

  if (upperMap[char]) return upperMap[char];
  return char.toLowerCase();
}

function getFingerForChar(char: string | null): string {
  if (!char) return '';
  const key = normalizeKey(char);
  
  if (key === 'Space') return 'Polegar';
  if (['1', 'q', 'a', 'z', '`', 'Tab', 'Caps', 'Shift'].includes(key)) return 'Mindinho Esquerdo';
  if (['2', 'w', 's', 'x'].includes(key)) return 'Anelar Esquerdo';
  if (['3', 'e', 'd', 'c'].includes(key)) return 'Médio Esquerdo';
  if (['4', '5', 'r', 't', 'f', 'g', 'v', 'b'].includes(key)) return 'Indicador Esquerdo';
  if (['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'].includes(key)) return 'Indicador Direito';
  if (['8', 'i', 'k', ','].includes(key)) return 'Médio Direito';
  if (['9', 'o', 'l', '.'].includes(key)) return 'Anelar Direito';
  if (['0', '-', '=', 'p', '[', ']', '\\', ';', "'", '/', 'Enter', 'Backspace'].includes(key)) return 'Mindinho Direito';
  
  return 'Indicador';
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  nextChar,
  showKeyboard,
  onToggleShow
}) => {
  const targetKey = normalizeKey(nextChar);
  const fingerGuide = getFingerForChar(nextChar);
  const isShiftNeeded = nextChar && '~!@#$%^&*()_+{}|:"<>?'.includes(nextChar);

  if (!showKeyboard) {
    return (
      <div className="w-full flex justify-center mb-6">
        <button
          onClick={onToggleShow}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 transition-colors cursor-pointer"
        >
          <KeyboardIcon className="w-3.5 h-3.5" />
          <span>Exibir Guia Visual do Teclado &amp; Memória Muscular</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#161922] border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <KeyboardIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Guia de Teclas &amp; Dedo Recomendado:</span>
          {nextChar && (
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
              {nextChar === ' ' ? 'Espaço' : nextChar} {isShiftNeeded ? '(com Shift)' : ''} &rarr; {fingerGuide}
            </span>
          )}
        </div>
        <button
          onClick={onToggleShow}
          className="text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
          title="Ocultar teclado"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Ocultar</span>
        </button>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 max-w-2xl mx-auto select-none">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const isTarget = targetKey === key.toLowerCase() || (key === 'Space' && targetKey === 'Space') || (key === 'Shift' && isShiftNeeded);
              
              let widthClass = 'w-8 sm:w-10';
              if (key === 'Backspace' || key === 'Enter') widthClass = 'w-16 sm:w-20';
              if (key === 'Tab' || key === 'Caps') widthClass = 'w-12 sm:w-14';
              if (key === 'Shift') widthClass = 'w-14 sm:w-16';
              if (key === 'Space') widthClass = 'w-48 sm:w-64';
              if (key === 'Ctrl' || key === 'Alt') widthClass = 'w-10 sm:w-12';

              return (
                <div
                  key={key}
                  className={`h-8 sm:h-9 ${widthClass} rounded-lg flex items-center justify-center font-mono text-[11px] sm:text-xs font-semibold transition-all duration-100 border ${
                    isTarget
                      ? 'bg-cyan-500 text-black border-cyan-300 font-bold shadow-[0_0_12px_rgba(34,211,238,0.6)] transform -translate-y-0.5 scale-105'
                      : 'bg-[#0d1017] text-slate-400 border-slate-800/80 shadow-inner'
                  }`}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
