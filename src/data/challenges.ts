import { CategoryTrack } from '../types';

export const DEFAULT_TRACKS: CategoryTrack[] = [
  {
    id: 'general-text',
    name: 'Frases & Escrita Rápida',
    icon: '📝',
    description: 'Frases do dia a dia, provérbios e pensamentos para quem quer treinar digitação sem código.',
    defaultTimer: 35,
    challenges: [
      {
        id: 'gen-1',
        title: 'Frase Curta do Cotidiano',
        description: 'Frase simples para treinar velocidade e ritmo básico',
        code: 'A prática constante leva à perfeição e rapidez ao digitar.',
        language: 'texto',
        difficulty: 'easy'
      },
      {
        id: 'gen-2',
        title: 'Sabedoria & Ritmo',
        description: 'Frase com pontuação comum e palavras fluídas',
        code: 'Quem cultiva a paciência colhe bons frutos todos os dias.',
        language: 'texto',
        difficulty: 'easy'
      },
      {
        id: 'gen-3',
        title: 'Foco & Produtividade',
        description: 'Texto intermediário com acentuação e vírgulas',
        code: 'O segredo de progredir é começar, um passo de cada vez com calma.',
        language: 'texto',
        difficulty: 'medium'
      },
      {
        id: 'gen-4',
        title: 'Tecnologia & Vida',
        description: 'Frase mais longa exercitando dedos em todas as fileiras',
        code: 'Escrever sem olhar para o teclado economiza tempo precioso na rotina.',
        language: 'texto',
        difficulty: 'medium'
      },
      {
        id: 'gen-5',
        title: 'Desafio de Agilidade',
        description: 'Frase completa com pontuação e variedade de letras',
        code: 'A velocidade dos seus dedos aumenta quando sua mente está tranquila e focada.',
        language: 'texto',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'items-words',
    name: 'Objetos, Itens & Listas',
    icon: '🎒',
    description: 'Sequências de nomes de objetos, itens de escritório, casa e mercado para reflexos rápidos.',
    defaultTimer: 30,
    challenges: [
      {
        id: 'item-1',
        title: 'Mesa de Trabalho',
        description: 'Objetos comuns sobre a mesa de trabalho',
        code: 'caderno, caneta, luminária, garrafa de água, fone de ouvido',
        language: 'palavras',
        difficulty: 'easy'
      },
      {
        id: 'item-2',
        title: 'Itens de Casa & Cozinha',
        description: 'Nomes de utensílios do dia a dia',
        code: 'xícara de café, prato, talheres, toalha de mesa, geladeira',
        language: 'palavras',
        difficulty: 'easy'
      },
      {
        id: 'item-3',
        title: 'Tecnologia do Cotidiano',
        description: 'Dispositivos e acessórios modernos',
        code: 'mouse sem fio, teclado mecânico, monitor curvo, carregador rápido',
        language: 'palavras',
        difficulty: 'medium'
      },
      {
        id: 'item-4',
        title: 'Lista de Mercado & Feira',
        description: 'Alimentos e itens variados com acentuação',
        code: 'maçã fresca, pão quentinho, leite integral, café torrado, queijo',
        language: 'palavras',
        difficulty: 'medium'
      },
      {
        id: 'item-5',
        title: 'Mochila de Viagem',
        description: 'Lista completa de pertences para agilidade total',
        code: 'passaporte, óculos de sol, protetor solar, câmera fotográfica, mochila',
        language: 'palavras',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'js-classic',
    name: 'JavaScript (5 Fases Guia)',
    icon: '⚡',
    description: 'Os 5 desafios essenciais do guia oficial para praticar funções, arrays e async.',
    defaultTimer: 35,
    challenges: [
      {
        id: 'js-c-1',
        title: 'Função Simples',
        description: 'Declaração básica de função com saída no console',
        code: 'function hello() { console.log("Oi"); }',
        language: 'javascript',
        difficulty: 'easy'
      },
      {
        id: 'js-c-2',
        title: 'Arrow Function',
        description: 'Sintaxe concisa de arrow function com retorno implícito',
        code: 'const sum = (a, b) => a + b;',
        language: 'javascript',
        difficulty: 'easy'
      },
      {
        id: 'js-c-3',
        title: 'Loop / Array Map',
        description: 'Mapeamento de array para extração de propriedades',
        code: 'array.map(item => item.id);',
        language: 'javascript',
        difficulty: 'medium'
      },
      {
        id: 'js-c-4',
        title: 'Condicional & Controle',
        description: 'Verificação booleana e chamada de redirecionamento',
        code: 'if (user.isLogged) { redirect(); }',
        language: 'javascript',
        difficulty: 'medium'
      },
      {
        id: 'js-c-5',
        title: 'Async / Await',
        description: 'Função assíncrona consumindo uma promise de API',
        code: 'async function load() { await api.get(); }',
        language: 'javascript',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript Moderno',
    icon: '🟨',
    description: 'Desestruturação, closures, promises, encadeamento opcional e operadores modernos.',
    defaultTimer: 45,
    challenges: [
      {
        id: 'js-mod-1',
        title: 'Desestruturação de Objeto',
        description: 'Extraindo dados com valores default',
        code: 'const { id, name = "Anônimo" } = user;',
        language: 'javascript',
        difficulty: 'easy'
      },
      {
        id: 'js-mod-2',
        title: 'Encadeamento Opcional & Nullish',
        description: 'Acessando propriedades aninhadas com segurança',
        code: 'const city = user?.address?.city ?? "N/A";',
        language: 'javascript',
        difficulty: 'medium'
      },
      {
        id: 'js-mod-3',
        title: 'Spread & Rest Operator',
        description: 'Imutabilidade na clonagem e mescla de objetos',
        code: 'const updated = { ...state, count: state.count + 1 };',
        language: 'javascript',
        difficulty: 'medium'
      },
      {
        id: 'js-mod-4',
        title: 'Array Reduce & Agrupamento',
        description: 'Calculando total acumulado em arrays de objetos',
        code: 'const total = items.reduce((acc, cur) => acc + cur.price, 0);',
        language: 'javascript',
        difficulty: 'hard'
      },
      {
        id: 'js-mod-5',
        title: 'Promise.all & Tratamento',
        description: 'Execução paralela de múltiplas requisições assíncronas',
        code: 'const [users, posts] = await Promise.all([getUsers(), getPosts()]);',
        language: 'javascript',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript & Tipagem',
    icon: '🔷',
    description: 'Interfaces, Generics, Union Types, Utility Types e Type Guards.',
    defaultTimer: 45,
    challenges: [
      {
        id: 'ts-1',
        title: 'Interface com Opcional',
        description: 'Definição de contrato de dados tipados',
        code: 'interface User { id: string; name: string; age?: number; }',
        language: 'typescript',
        difficulty: 'easy'
      },
      {
        id: 'ts-2',
        title: 'Função Genérica',
        description: 'Tipagem flexível com generics parametrizados',
        code: 'function identity<T>(arg: T): T { return arg; }',
        language: 'typescript',
        difficulty: 'medium'
      },
      {
        id: 'ts-3',
        title: 'Record & Readonly',
        description: 'Utility types para dicionários imutáveis',
        code: 'type ConfigMap = Readonly<Record<string, boolean>>;',
        language: 'typescript',
        difficulty: 'medium'
      },
      {
        id: 'ts-4',
        title: 'Type Guard Customizado',
        description: 'Validação em runtime com narrowing de tipo',
        code: 'function isString(val: unknown): val is string { return typeof val === "string"; }',
        language: 'typescript',
        difficulty: 'hard'
      },
      {
        id: 'ts-5',
        title: 'Tipo Condicional & Infer',
        description: 'Extração avançada de tipos de retorno',
        code: 'type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;',
        language: 'typescript',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'react',
    name: 'React & Hooks',
    icon: '⚛️',
    description: 'useState, useEffect, useMemo, custom hooks e renderização condicional.',
    defaultTimer: 40,
    challenges: [
      {
        id: 'react-1',
        title: 'useState Hook',
        description: 'Estado local com setter reativo',
        code: 'const [count, setCount] = useState<number>(0);',
        language: 'typescript',
        difficulty: 'easy'
      },
      {
        id: 'react-2',
        title: 'useEffect com Dependências',
        description: 'Ciclo de vida e sincronização de efeitos colaterais',
        code: 'useEffect(() => { fetchProfile(id); }, [id]);',
        language: 'typescript',
        difficulty: 'medium'
      },
      {
        id: 'react-3',
        title: 'useCallback Memoization',
        description: 'Estabilização de referência para otimização de render',
        code: 'const handleClick = useCallback(() => setOpen(prev => !prev), []);',
        language: 'typescript',
        difficulty: 'medium'
      },
      {
        id: 'react-4',
        title: 'Custom Hook de LocalStorage',
        description: 'Encapsulamento de lógica reutilizável',
        code: 'export function useStorage<T>(key: string, initial: T) { ... }',
        language: 'typescript',
        difficulty: 'hard'
      },
      {
        id: 'react-5',
        title: 'useReducer Pattern',
        description: 'Gerenciamento de estado complexo com dispatch e actions',
        code: 'const [state, dispatch] = useReducer(reducer, { loading: false, data: [] });',
        language: 'typescript',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'python',
    name: 'Pythonic Code',
    icon: '🐍',
    description: 'List comprehensions, decorators, context managers e manipulação de dicionários.',
    defaultTimer: 40,
    challenges: [
      {
        id: 'py-1',
        title: 'Função com F-String',
        description: 'Interpolação direta de variáveis em strings',
        code: 'def greet(name: str) -> str: return f"Olá, {name}!"',
        language: 'python',
        difficulty: 'easy'
      },
      {
        id: 'py-2',
        title: 'List Comprehension com Filtro',
        description: 'Transformação funcional concisa em Python',
        code: 'evens = [x ** 2 for x in numbers if x % 2 == 0]',
        language: 'python',
        difficulty: 'medium'
      },
      {
        id: 'py-3',
        title: 'Context Manager (with open)',
        description: 'Gerenciamento seguro de recursos e arquivos',
        code: 'with open("data.json", "r", encoding="utf-8") as f: data = json.load(f)',
        language: 'python',
        difficulty: 'medium'
      },
      {
        id: 'py-4',
        title: 'Dict Comprehension & Enumerate',
        description: 'Mapeamento indexado de elementos',
        code: 'index_map = {item: idx for idx, item in enumerate(items)}',
        language: 'python',
        difficulty: 'hard'
      },
      {
        id: 'py-5',
        title: 'Decorator Customizado',
        description: 'Funções de alta ordem para interceptar chamadas',
        code: 'def timer_decorator(func): return lambda *args, **kw: func(*args, **kw)',
        language: 'python',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'git',
    name: 'Git & Terminal Comandos',
    icon: '🐙',
    description: 'Comandos essenciais de versionamento e fluxo diário de desenvolvimento.',
    defaultTimer: 35,
    challenges: [
      {
        id: 'git-1',
        title: 'Status & Add',
        description: 'Verificando e indexando arquivos modificados',
        code: 'git add . && git commit -m "feat: initial commit"',
        language: 'bash',
        difficulty: 'easy'
      },
      {
        id: 'git-2',
        title: 'Criar e Mudar de Branch',
        description: 'Troca de ramificação de desenvolvimento',
        code: 'git checkout -b feature/auth-module',
        language: 'bash',
        difficulty: 'easy'
      },
      {
        id: 'git-3',
        title: 'Git Stash com Mensagem',
        description: 'Guardando alterações em progresso temporariamente',
        code: 'git stash save "WIP: refactor table styles" && git stash pop',
        language: 'bash',
        difficulty: 'medium'
      },
      {
        id: 'git-4',
        title: 'Log Formatado em Uma Linha',
        description: 'Visualização compacta do histórico de commits',
        code: 'git log --oneline --graph --decorate --all -n 10',
        language: 'bash',
        difficulty: 'medium'
      },
      {
        id: 'git-5',
        title: 'Git Rebase Interativo',
        description: 'Organizando histórico antes de abrir pull request',
        code: 'git rebase -i HEAD~3 --autosquash',
        language: 'bash',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'sql',
    name: 'SQL & Banco de Dados',
    icon: '🗄️',
    description: 'Consultas relacionais, JOINs, agregações e subqueries.',
    defaultTimer: 45,
    challenges: [
      {
        id: 'sql-1',
        title: 'Select Simples com Filtro',
        description: 'Busca condicional básica com ordenação',
        code: 'SELECT id, email FROM users WHERE is_active = TRUE ORDER BY created_at DESC;',
        language: 'sql',
        difficulty: 'easy'
      },
      {
        id: 'sql-2',
        title: 'Inner Join & Agregação',
        description: 'Combinação de tabelas com contagem agrupada',
        code: 'SELECT u.name, COUNT(o.id) AS total_orders FROM users u INNER JOIN orders o ON u.id = o.user_id GROUP BY u.name;',
        language: 'sql',
        difficulty: 'medium'
      },
      {
        id: 'sql-3',
        title: 'Group By & Having',
        description: 'Filtro em grupos calculados',
        code: 'SELECT category, SUM(price) FROM products GROUP BY category HAVING SUM(price) > 500;',
        language: 'sql',
        difficulty: 'medium'
      },
      {
        id: 'sql-4',
        title: 'Upsert com On Conflict',
        description: 'Inserção ou atualização atômica',
        code: 'INSERT INTO settings (key, val) VALUES ("theme", "dark") ON CONFLICT (key) DO UPDATE SET val = "dark";',
        language: 'sql',
        difficulty: 'hard'
      },
      {
        id: 'sql-5',
        title: 'Window Function com ROW_NUMBER',
        description: 'Rankeamento e paginação analítica em SQL',
        code: 'SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank FROM employees;',
        language: 'sql',
        difficulty: 'hard'
      }
    ]
  }
];
