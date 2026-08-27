import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

export type SyntaxTokenType =
  | 'keyword'
  | 'function'
  | 'string'
  | 'number'
  | 'boolean'
  | 'operator'
  | 'punctuation'
  | 'comment'
  | 'class-name'
  | 'property'
  | 'plain';

export interface CharSyntaxInfo {
  char: string;
  index: number;
  tokenType: SyntaxTokenType;
}

export function getLanguageGrammar(lang: string) {
  switch (lang.toLowerCase()) {
    case 'typescript':
    case 'ts':
    case 'tsx':
      return Prism.languages.typescript || Prism.languages.javascript;
    case 'python':
    case 'py':
      return Prism.languages.python;
    case 'sql':
      return Prism.languages.sql;
    case 'bash':
    case 'git':
    case 'shell':
      return Prism.languages.bash;
    case 'javascript':
    case 'js':
    case 'jsx':
    default:
      return Prism.languages.javascript;
  }
}

export function tokenizeCodeToChars(code: string, language: string): CharSyntaxInfo[] {
  const grammar = getLanguageGrammar(language);
  const result: CharSyntaxInfo[] = [];

  try {
    const tokens = Prism.tokenize(code, grammar);

    const processToken = (token: string | Prism.Token, inheritedType: SyntaxTokenType = 'plain') => {
      if (typeof token === 'string') {
        for (const ch of token) {
          result.push({
            char: ch,
            index: result.length,
            tokenType: inheritedType,
          });
        }
      } else {
        let type: SyntaxTokenType = 'plain';
        if (typeof token.type === 'string') {
          if (token.type.includes('keyword')) type = 'keyword';
          else if (token.type.includes('function')) type = 'function';
          else if (token.type.includes('string')) type = 'string';
          else if (token.type.includes('number')) type = 'number';
          else if (token.type.includes('boolean')) type = 'boolean';
          else if (token.type.includes('operator')) type = 'operator';
          else if (token.type.includes('punctuation')) type = 'punctuation';
          else if (token.type.includes('comment')) type = 'comment';
          else if (token.type.includes('class-name')) type = 'class-name';
          else if (token.type.includes('property')) type = 'property';
          else type = 'plain';
        }

        if (Array.isArray(token.content)) {
          token.content.forEach((nested) => processToken(nested, type));
        } else if (typeof token.content === 'string' || (token.content && typeof token.content === 'object')) {
          processToken(token.content as string | Prism.Token, type);
        }
      }
    };

    tokens.forEach((t) => processToken(t));
  } catch {
    // Fallback if tokenization fails
    for (let i = 0; i < code.length; i++) {
      result.push({
        char: code[i],
        index: i,
        tokenType: 'plain',
      });
    }
  }

  // Safety fallback if length mismatch
  if (result.length !== code.length) {
    const fallback: CharSyntaxInfo[] = [];
    for (let i = 0; i < code.length; i++) {
      fallback.push({
        char: code[i],
        index: i,
        tokenType: 'plain',
      });
    }
    return fallback;
  }

  return result;
}

export function getTokenTailwindColor(tokenType: SyntaxTokenType, isTyped: boolean, isError: boolean): string {
  if (isError) {
    return 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 decoration-2';
  }

  if (isTyped) {
    // Character already typed correctly: crisp glowing emerald/cyan
    return 'text-emerald-400';
  }

  // Not typed yet: dim syntax highlighted colors like a code editor placeholder
  switch (tokenType) {
    case 'keyword':
      return 'text-purple-400/70';
    case 'function':
      return 'text-blue-400/70';
    case 'string':
      return 'text-amber-300/70';
    case 'number':
    case 'boolean':
      return 'text-orange-400/70';
    case 'operator':
      return 'text-pink-400/70';
    case 'punctuation':
      return 'text-slate-400/60';
    case 'class-name':
    case 'property':
      return 'text-teal-300/70';
    case 'comment':
      return 'text-slate-500/70 italic';
    case 'plain':
    default:
      return 'text-slate-300/60';
  }
}
