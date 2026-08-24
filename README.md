# Mini Poliglota

App infantil (Android, Expo/React Native) para ensinar palavras em inglês, espanhol,
italiano e alemão a uma criança de 5 anos em fase de alfabetização. Mascote: um pato,
no estilo pastel de "O Pequeno Urso" (TV Cultura).

## Como rodar

```bash
npm install
npm run web              # preview rápido no navegador (sem reconhecimento de fala nativo)
npx expo run:android     # build de desenvolvimento no Android — necessário p/ o microfone
```

> A partir do M2, o app usa um módulo nativo de reconhecimento de fala
> (`expo-speech-recognition`), então **o Expo Go não funciona mais** — é preciso
> gerar um development build (`npx expo run:android`, exige Android Studio/SDK
> instalado) ou usar o EAS Build.

## Arquitetura

- `src/data/words.ts` — banco de palavras (pt + traduções en/es/it/de + emoji). Fácil de expandir.
- `src/lib/srs.ts` — algoritmo de repetição espaçada (caixas de Leitner) que decide quais
  palavras aparecem: novas, em revisão (`due`) ou esquecidas (`forgotten`, prioridade máxima).
- `src/lib/storage.ts` — persistência local (AsyncStorage) do progresso e da sequência de dias.
- `src/screens/SessionScreen.tsx` — sessão diária: ~30 cartões divididos entre os 4 idiomas,
  áudio via `expo-speech` (TTS nativo, sem depender de arquivos de áudio).
- `src/screens/DashboardScreen.tsx` — painel para os pais: palavras dominadas/em aprendizado
  por idioma e lista das palavras com mais erros.
- `src/lib/matchWord.ts` — compara o que o reconhecimento de fala ouviu com a palavra-alvo
  (distância de Levenshtein por palavra, com limiar mais rígido para palavras curtas).
- `src/components/SpeechAnswer.tsx` — grava a criança falando (`expo-speech-recognition`),
  pontua com `matchWord` e mostra o veredito; sempre com um atalho para responder manualmente
  caso o microfone falhe ou a permissão seja negada.
- `src/illustrations/` — ilustrações vetoriais próprias (contorno "à mão", paleta da tela)
  para cada palavra do banco (`WordIllustration.tsx`), com peças reutilizáveis em `shapes.tsx`
  (cabeça de bichinho, orelhas, olhos, etc.) para manter as 41 ilustrações consistentes entre si.

## Roteiro de milestones

- [x] **M1** — App base: design system, banco de palavras, sessão diária com TTS,
      algoritmo de repetição espaçada local, dashboard local para os pais.
- [x] **M2** — Captura e avaliação da fala da criança: `expo-speech-recognition` ouve a
      palavra falada, `matchWord.ts` pontua a transcrição contra o alvo, com fallback manual
      sempre disponível (mic indisponível/negado, ou erro de reconhecimento).
- [x] **M3** — paleta e cenário no estilo pastel/aquarela de "O Pequeno Urso" (parchment +
      tons de floresta/lagoa, `NatureBackdrop.tsx`), mascote com contorno "desenhado à mão"
      (`DuckMascot.tsx`), e as 41 palavras do banco agora têm ilustração própria em vez de
      emoji (`src/illustrations/`), com fallback automático para emoji se uma palavra nova
      for adicionada sem ilustração.
- [x] **M4** — Backend Supabase: autenticação dos pais (email/senha), schema com RLS
      (`supabase/migrations/0001_init.sql`), sincronização best-effort ao fim de cada sessão,
      dashboard lendo da nuvem com fallback automático para os dados locais.
- [ ] **M5** — Publicação: build Android (EAS), versionamento no GitHub.

## Configurando o Supabase

1. Rode o SQL de `supabase/migrations/0001_init.sql` no **SQL Editor** do painel do Supabase
   (cria as tabelas `children`, `word_progress`, `sessions` com row-level security).
2. Copie `.env.example` para `.env` e preencha com a URL e a chave publicável do seu projeto
   (`Project Settings → API`).
3. Por padrão o Supabase exige confirmação de email antes de liberar o login — para um app
   familiar isso pode ser desligado em `Authentication → Providers → Email → Confirm email`.

## Notas técnicas

- TTS usa os idiomas `en-US`, `es-ES`, `it-IT`, `de-DE` via `expo-speech` — funciona sem
  assets de áudio, mas pode ser trocado por locuções gravadas depois.
- As "figuras" das palavras são emojis por enquanto (zero dependência de assets); trocar por
  ilustrações no estilo do mascote é o foco do M3.
- Reconhecimento de fala: on-device no Android/iOS (via `SpeechRecognizer`/`SFSpeechRecognizer`,
  sem custo por chamada), com fallback manual sempre visível. Ainda não testado num Android
  físico — vale validar a precisão com a fala real da criança e ajustar os limiares em
  `matchWord.ts` se necessário.
