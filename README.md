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
- [ ] **M4** — Backend Supabase: autenticação dos pais, sincronização de progresso na nuvem.
- [ ] **M5** — Publicação: build Android (EAS), versionamento no GitHub.

## Notas técnicas

- TTS usa os idiomas `en-US`, `es-ES`, `it-IT`, `de-DE` via `expo-speech` — funciona sem
  assets de áudio, mas pode ser trocado por locuções gravadas depois.
- As "figuras" das palavras são emojis por enquanto (zero dependência de assets); trocar por
  ilustrações no estilo do mascote é o foco do M3.
- Avaliação de acerto/erro é manual (botões) até o M2 trazer reconhecimento de fala real.
