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

- `src/data/words.ts` + `src/data/wordbank/*.ts` — banco de **1023 palavras** por idioma,
  organizado por tema (animais, casa, comida, corpo, verbos, adjetivos, etc). Substantivos em
  alemão sempre carregam o artigo (`der`/`die`/`das`) — a criança aprende a palavra já com o
  gênero certo. Só as 41 palavras "core" têm ilustração própria; o resto usa emoji automático.
- `src/lib/srs.ts` — algoritmo de repetição espaçada (caixas de Leitner) que decide quais
  palavras aparecem: novas, em revisão (`due`) ou esquecidas (`forgotten`, prioridade máxima).
- `src/lib/storage.ts` — persistência local (AsyncStorage) do progresso e da sequência de dias.
- `src/screens/SessionScreen.tsx` — sessão diária: ~30 cartões divididos entre os 4 idiomas,
  áudio via `expo-speech` (TTS nativo, sem depender de arquivos de áudio).
- `src/screens/DashboardScreen.tsx` — painel para os pais: palavras dominadas/em aprendizado
  por idioma e lista das palavras com mais erros.
- `src/lib/matchWord.ts` — compara o que o reconhecimento de fala ouviu com a palavra-alvo
  (distância de Levenshtein, com limiar mais rígido para palavras curtas). Suporta alvos de
  mais de uma palavra (ex.: "die Sonne"): tenta casar a frase completa e também aceita só o
  substantivo (criança pode "engolir" o artigo sem perder o ponto).
- `src/components/SpeechAnswer.tsx` — grava a criança falando (`expo-speech-recognition`) e
  pontua com `matchWord`. O microfone é o único jeito de responder (sem botão manual); se a
  permissão for negada, mostra um botão "Tentar novamente" para pedir de novo.
- `src/lib/ttsVoice.ts` — escolhe explicitamente uma voz nativa instalada no aparelho para
  cada idioma (via `Speech.getAvailableVoicesAsync`), em vez de confiar só no parâmetro
  `language`, que em alguns aparelhos silenciosamente cai pra voz padrão (inglês) mesmo pedindo
  outro idioma.
- `src/illustrations/` — ilustrações vetoriais próprias (contorno "à mão", paleta da tela)
  para cada palavra do banco (`WordIllustration.tsx`), com peças reutilizáveis em `shapes.tsx`
  (cabeça de bichinho, orelhas, olhos, etc.) para manter as 41 ilustrações consistentes entre si.

## Roteiro de milestones

- [x] **M1** — App base: design system, banco de palavras, sessão diária com TTS,
      algoritmo de repetição espaçada local, dashboard local para os pais.
- [x] **M2** — Captura e avaliação da fala da criança: `expo-speech-recognition` ouve a
      palavra falada, `matchWord.ts` pontua a transcrição contra o alvo. O microfone é o único
      jeito de responder (não tem mais botão manual); vozes de TTS agora são escolhidas
      explicitamente por idioma (`ttsVoice.ts`) pra soar nativo, não só com sotaque americano.
      Antes de cada bloco de idioma, aparece uma tela com a bandeira e o nome do idioma por
      ~1,5s, deixando a troca óbvia.
- [x] **M3** — paleta e cenário no estilo pastel/aquarela de "O Pequeno Urso" (parchment +
      tons de floresta/lagoa, `NatureBackdrop.tsx`), mascote com contorno "desenhado à mão"
      (`DuckMascot.tsx`), e as 41 palavras "core" têm ilustração própria em vez de emoji
      (`src/illustrations/`). Paleta revisada para tons bem dessaturados/pastel (baixo
      estímulo visual — o foco deve ficar na pronúncia), e o `NatureBackdrop` foi removido da
      tela de sessão (fica só no Início e no painel dos pais).
- [x] **Banco de palavras** — expandido de 41 para **1023 palavras por idioma**, cobrindo
      dezenas de categorias (veja `src/data/wordbank/`). Alemão sempre com artigo correto.
- [x] **M4** — Backend Supabase: schema com RLS (`supabase/migrations/0001_init.sql`) e
      sincronização best-effort ao fim de cada sessão (`cloudSync.ts`). A tela de login foi
      removida — o painel dos pais (ícone ⚙️ no canto do Início) sempre lê os dados locais
      deste aparelho direto; a infra de sync na nuvem fica pronta pra um login futuro, mas
      hoje não é usada.
- [ ] **M5** — Publicação: build Android (EAS), versionamento no GitHub.
- [x] **Preview web** — https://mini-poliglota.vercel.app (deploy manual via Vercel; mostra o
      design e o fluxo, mas sem microfone — reconhecimento de fala é nativo e não roda em
      navegador). ⚠️ Sem o GitHub linkado (ver nota abaixo), cada deploy é manual e trabalhoso
      — pode estar um ou dois commits atrasado em relação ao `master`. O código-fonte no
      GitHub é sempre a fonte da verdade.

## Configurando o Supabase

1. Rode o SQL de `supabase/migrations/0001_init.sql` no **SQL Editor** do painel do Supabase
   (cria as tabelas `children`, `word_progress`, `sessions` com row-level security).
2. Copie `.env.example` para `.env` e preencha com a URL e a chave publicável do seu projeto
   (`Project Settings → API`).
3. Por padrão o Supabase exige confirmação de email antes de liberar o login — para um app
   familiar isso pode ser desligado em `Authentication → Providers → Email → Confirm email`.

## Deploy no Vercel

O projeto Vercel `mini-poliglota` ainda não está conectado ao GitHub (a conta Vercel logada
está associada a um usuário GitHub diferente de `leavelar7`, dono deste repositório — dá pra
resolver reconectando a integração de Git nas configurações da conta Vercel). Até lá, deploys
são feitos manualmente. Quando conectar:

1. Configure `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` como **Environment
   Variables** do projeto no painel do Vercel (`Settings → Environment Variables`) — o
   `vercel.json` sozinho não injeta essas variáveis no passo de build.
2. Build command: `npm run build` · Output directory: `dist`.

## Notas técnicas

- TTS usa os idiomas `en-US`, `es-ES`, `it-IT`, `de-DE` via `expo-speech` — funciona sem
  assets de áudio, mas pode ser trocado por locuções gravadas depois.
- As "figuras" das palavras são emojis por enquanto (zero dependência de assets); trocar por
  ilustrações no estilo do mascote é o foco do M3.
- Reconhecimento de fala: on-device no Android/iOS (via `SpeechRecognizer`/`SFSpeechRecognizer`,
  sem custo por chamada). É o único jeito de responder — sem botão manual. Se a permissão for
  negada, um botão "Tentar novamente" pede de novo; se o aparelho não suportar reconhecimento
  de fala, a sessão fica travada nessa palavra (limitação conhecida, aceita a pedido). Ainda não
  testado num Android físico — vale validar a precisão com a fala real da criança e ajustar os
  limiares em `matchWord.ts` se necessário.
- Vozes de TTS: a seleção explícita de voz nativa (`ttsVoice.ts`) depende do aparelho ter a
  voz daquele idioma instalada. Em alguns Android sem os pacotes de idioma baixados, ainda vai
  cair na voz padrão — vale conferir em `Configurações → Idioma e voz de saída → Google
  Text-to-Speech` se en-US/es-ES/it-IT/de-DE estão instalados.
- **Banco de 1023 palavras**: as traduções (inclusive os artigos em alemão) foram geradas por
  mim com base no meu conhecimento dos 4 idiomas, sem dicionário/tradutor externo para
  verificação automática. Para vocabulário comum a confiança é alta, mas recomendo uma
  revisão por um falante nativo (principalmente do alemão, pelo peso pedagógico do
  `der`/`die`/`das`) antes de confiar 100% nisso para uso diário.
