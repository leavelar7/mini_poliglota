# Mini Poliglota

App infantil (Android, Expo/React Native) para ensinar palavras em inglês, espanhol,
italiano e alemão a uma criança de 5 anos em fase de alfabetização. Mascote: um pato,
no estilo pastel de "O Pequeno Urso" (TV Cultura).

## Como rodar

```bash
npm install
npm run android   # dispositivo/emulador Android
npm run web        # preview rápido no navegador
```

## Arquitetura

- `src/data/words.ts` — banco de palavras (pt + traduções en/es/it/de + emoji). Fácil de expandir.
- `src/lib/srs.ts` — algoritmo de repetição espaçada (caixas de Leitner) que decide quais
  palavras aparecem: novas, em revisão (`due`) ou esquecidas (`forgotten`, prioridade máxima).
- `src/lib/storage.ts` — persistência local (AsyncStorage) do progresso e da sequência de dias.
- `src/screens/SessionScreen.tsx` — sessão diária: ~30 cartões divididos entre os 4 idiomas,
  áudio via `expo-speech` (TTS nativo, sem depender de arquivos de áudio).
- `src/screens/DashboardScreen.tsx` — painel para os pais: palavras dominadas/em aprendizado
  por idioma e lista das palavras com mais erros.

## Roteiro de milestones

- [x] **M1** — App base: design system, banco de palavras, sessão diária com TTS,
      algoritmo de repetição espaçada local, dashboard local para os pais.
- [ ] **M2** — Captura e avaliação da fala da criança (gravação + verificação de pronúncia).
- [ ] **M3** — Ilustrações reais no lugar dos emojis, polimento de animações/mascote.
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
- Avaliação de acerto/erro é manual (botões) até o M2 trazer reconhecimento de fala real.
