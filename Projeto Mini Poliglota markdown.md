# Projeto: Mini Poliglota (Language Learning App para Crianças)

## 1. Visão Geral do Projeto
Você é um Engenheiro de Software Sênior encarregado de construir um aplicativo mobile educativo para uma criança de 5 anos aprender 4 idiomas (Inglês, Francês, Italiano e Alemão).
O usuário não sabe ler e tem um tempo limite de **10 minutos por dia**. 

**Diferenciais e Restrições:**
- **Baseado em Voz:** O aprendizado não usa botões de "Fácil/Difícil". O app reproduz o som, a criança repete, e o app avalia a pronúncia via STT (Speech-to-Text) com tolerância a erros infantis.
- **Spaced Repetition System (SRS):** O motor do app é baseado no método Anki (SuperMemo-2), mas adaptado para inputs binários (Acertou/Errou).
- **Time-gated:** O app trava suavemente após 10 minutos de uso diário.

## 2. Stack Tecnológico
- **Frontend:** React Native com Expo (TypeScript).
- **Backend/DB:** Supabase (PostgreSQL).
- **Text-to-Speech (TTS):** `expo-speech` (offline, nativo).
- **Speech-to-Text (STT):** `@react-native-voice/voice` (requer Custom Dev Client via `expo run:android` / `expo run:ios`).
- **Navegação:** React Navigation (Native & Stack).

## 3. Guias de UI/UX (Tema: "O Pequeno Urso")
- **Paleta de Cores (Low-Stimulus):** 
  - Fundo: `#F4F1EA` (Bege papel)
  - Botão Primário/Sucesso: `#8A9A5B` (Verde musgo pastel)
  - Botão Secundário/Neutro: `#E0B589` (Marrom terra claro)
- **Estilo:** Bordas arredondadas, sombras muito suaves (elevation leve), sem animações excessivas (sem confetes). Recompensas visuais são sutis (ex: imagem da palavra dá um leve pulo ao acertar, som de xilofone suave).

---

## 4. Esquema de Banco de Dados (Supabase SQL)
Execute este script no Supabase para inicializar o banco de dados:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language TEXT NOT NULL CHECK (language IN ('en', 'es', 'it', 'de')),
  target_word TEXT NOT NULL,
  image_url TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  interval INTEGER NOT NULL DEFAULT 0,
  repetition INTEGER NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, word_id)
);
CREATE INDEX idx_progress_next_review ON progress(user_id, next_review_date);

CREATE TABLE review_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_review_logs_date ON review_logs(user_id, created_at);



Local: src/utils/srsAlgorithm.ts
export interface ProgressState {
  interval: number;
  repetition: number;
  easeFactor: number;
}

export function calculateNextReview(isCorrect: boolean, currentState: ProgressState) {
  let { interval, repetition, easeFactor } = currentState;

  if (isCorrect) {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 2;
    else interval = Math.round(interval * easeFactor);
    repetition += 1;
    easeFactor += 0.1;
  } else {
    repetition = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    interval,
    repetition,
    easeFactor,
    nextReviewDate: nextReviewDate.toISOString().split('T')[0]
  };
}


Local: src/utils/stringSimilarity.ts
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}

export function isPronunciationCorrect(spoken: string, target: string): boolean {
  const cleanSpoken = spoken.toLowerCase().trim();
  const cleanTarget = target.toLowerCase().trim();
  if (cleanSpoken.includes(cleanTarget)) return true;

  const distance = levenshtein(cleanSpoken, cleanTarget);
  const maxLength = Math.max(cleanSpoken.length, cleanTarget.length);
  const similarity = (maxLength - distance) / maxLength;
  
  return similarity >= 0.6; // 60% de tolerância para dicção infantil
}


Plano de Execução (Milestones)

Agente, por favor, execute as seguintes fases passo a passo. 
Ao terminar uma fase, faça um commit e prossiga para a próxima.

Fase 1: Setup do Projeto e Supabase

Inicialize um projeto Expo com TypeScript (Template Blank).
Instale dependências de navegação (@react-navigation/native, @react-navigation/native-stack).
Instale @supabase/supabase-js.
Crie src/services/supabaseClient.ts e configure as credenciais via variáveis de ambiente.
Crie tipos globais TypeScript correspondentes ao banco de dados fornecido no item 4.

Fase 2: Serviços de Busca (Query Diária)

Crie src/services/sessionService.ts.
Implemente a função fetchDailySession(userId, language, limit = 10) que:
Busca palavras na tabela progress onde next_review_date <= TODAY.
Se o resultado for menor que o limite, busca palavras aleatórias na tabela words que NÃO estejam na tabela progress do usuário.
Retorna um array unificado (palavras para revisão + palavras novas formatadas com progresso zerado).
Implemente a função processWordResult(userId, wordId, language, isCorrect, currentState) que calcula o novo progresso com calculateNextReview, atualiza a tabela progress e insere um log na tabela review_logs.

Fase 3: Módulos de Voz (STT e TTS)

Instale expo-speech e @react-native-voice/voice.
Adicione os plugins no app.json configurando microphonePermission.
Implemente src/utils/tts.ts usando expo-speech (ajustar pitch: 1.1, rate: 0.85).
Crie o componente src/components/VoiceButton.tsx gerenciando o ciclo de vida do @react-native-voice/voice, recebendo targetWord, processando pelo isPronunciationCorrect e disparando um evento onResult(isCorrect).

Fase 4: Interface da Criança (Learning Screen) e Trava de Tempo

Crie src/screens/LearningScreen.tsx usando as diretrizes de UI (Fundo bege, ilustração centralizada grande, sombra sutil, sem textos).
Implemente o fluxo de sessão: Mostrar primeira palavra -> Tocar áudio automático -> Aguardar criança apertar microfone e falar -> Validar -> Feedback sonoro/visual -> Passar para a próxima palavra.
Implemente o Time-Gate: Use um timer de 10 minutos ou um limite de, por exemplo, 10 palavras por dia. Ao atingir o limite, exiba uma tela amigável (ex: ícone de urso dormindo) bloqueando o app para o dia, sem botões de escape visíveis para a criança.

Fase 5: Dashboard dos Pais

Crie src/screens/ParentDashboard.tsx focado na análise da tabela review_logs.
Inclua KPIs: Taxa de acerto (accuracy) da semana, total de revisões feitas, e lista das "Top 3 palavras com mais erros".
Crie um mecanismo de entrada seguro na Home: Um pequeno ícone opaco em um canto da tela inicial, exigindo um long press de 3 segundos para navegar até o Dashboard, garantindo que a criança não entre por engano.

Instrução Final para o Agente: Comece lendo todo este documento. Inicie o setup do ambiente e prossiga fase por fase rigorosamente, sem misturar responsabilidades. Peça confirmação do usuário (humano) ao final da Fase 2 para garantir que as credenciais do DB estão corretas.