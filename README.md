# ⚡ DevTyping — Speed Coding & Typing Challenge

Uma aplicação moderna e interativa de treino e teste de velocidade de digitação para desenvolvedores e entusiastas de teclado. Pratique com códigos reais de programação (JavaScript, TypeScript, Python, HTML/CSS, React, SQL, etc.) ou com frases do cotidiano e listas de objetos.

---

## 🚀 Funcionalidades Principais

### 🎮 Modos de Jogo
- **Modo Solo (1 Jogador)**:
  - 5 fases progressivas por trilha.
  - Cronômetro progressivo em tempo real.
  - Sistema de penalidade dinâmica: **+5 segundos por erro cometido**.
  - Cálculo instantâneo de **WPM** (Palavras por Minuto), **CPM** (Caracteres por Minuto) e **Precisão (%)**.
- **Modo Dual (Duelo 1v1 Local)**:
  - Batalha em turnos no mesmo teclado para 2 jogadores (ex: *Dev 1 vs Dev 2*).
  - Ambos os jogadores digitam exatamente os mesmos desafios sob as mesmas regras.
  - Tela comparativa de resultado final com medalha de campeão, diferença de tempo e métricas detalhadas de cada competidor.

---

### 📚 Trilhas e Categorias de Desafio
1. **📝 Frases & Escrita Rápida**: Frases do cotidiano, provérbios e pensamentos com acentuação e pontuação comum (ideal para quem não programa).
2. **🎒 Objetos, Itens & Listas**: Sequências de utensílios, itens de escritório, cozinha, tecnologia e viagens para reflexos rápidos.
3. **⚡ JavaScript (5 Fases Guia)**: Funções clássicas, arrays, async/await e arrow functions.
4. **🟦 TypeScript**: Tipagem estática, interfaces, generics e type aliases.
5. **🐍 Python**: List comprehensions, decorators, funções e estruturas limpas.
6. **🌐 HTML & CSS Moderno**: Tags semânticas, seletores e classes utilitárias.
7. **⚛️ React Hooks & Components**: `useState`, `useEffect`, custom hooks e JSX.
8. **🗄️ SQL & Consultas**: `SELECT`, `JOIN`, `GROUP BY` e queries comuns.
9. **⚙️ Git & Comandos de Terminal**: Comandos essenciais de terminal e Git workflows.
10. **✨ Trilha Personalizada**: Crie e edite seus próprios códigos, funções ou frases diretamente na plataforma.

---

### ⌨️ Teclado Virtual & Guia de Dedos
- Mapa de teclado interativo em tempo real com indicação visual da próxima tecla a ser pressionada.
- Código de cores por dedo (mindinho, anelar, médio, indicador e polegar) para treino de digitação tátil (*touch typing*).
- Suporte a caracteres acentuados da língua portuguesa (`á`, `é`, `í`, `ó`, `ú`, `ã`, `õ`, `ç`, etc.).

---

### 🏆 Placar & Melhores Tempos (Leaderboard)
- Armazenamento local persistente de todas as partidas.
- Visualização dos melhores tempos e recordes por categoria no menu inicial.
- Filtros por trilha e ordenação por:
  - **Melhores Tempos** (menor tempo total com penalidades).
  - **Maior WPM**.
  - **Partidas Recentes**.
- Destaque para pódio com medalhas (🥇 Ouro, 🥈 Prata, 🥉 Bronze).
- Opção para excluir registros individuais ou limpar todo o histórico.

---

### 🔊 Efeitos Sonoros de Teclado
- Sintetizador Web Audio API com perfis sonoros realistas:
  - **Mecânico (Clicky)**
  - **Suave (Linear/Thock)**
  - **Click Clássico**
  - **Mudo**
- Efeitos sonoros para acertos, erros e vitórias.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** (com TypeScript)
- **Vite** (Build Tool)
- **Tailwind CSS** (Estilização responsiva com tema dark sofisticado)
- **Lucide React** (Ícones modernos e consistentes)
- **Web Audio API** (Sons mecânicos e feedback de áudio nativo)
- **Local Storage API** (Persistência de recordes e códigos customizados)

---

## 📦 Como Rodar o Projeto Localmente

1. Clone ou baixe os arquivos do repositório:
   ```bash
   git clone <url-do-repositorio>
   cd devtyping
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra no navegador:
   ```
   http://localhost:3000
   ```

5. Para gerar a build de produção:
   ```bash
   npm run build
   ```

---

## 🎯 Regras do Jogo
- Digite cada caractere correspondente na tela.
- **Acertos** avançam o cursor para o próximo caractere.
- **Erros** adicionam **+5 segundos** de penalidade ao seu tempo final.
- Conclua todas as 5 fases para registrar seu tempo no placar e desbloquear novos recordes!
