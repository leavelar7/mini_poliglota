# Mini Poliglota

App infantil (Android, Expo/React Native) para ensinar palavras em inglês, francês,
italiano e alemão a uma criança de 5 anos em fase de alfabetização. Mascote: um pato,
no estilo pastel de "O Pequeno Urso" (TV Cultura). Sessão diária com trava rígida de
10 minutos (ou 10 palavras) por dia, interface quase sem texto — só a palavra-alvo
escrita fica visível, o resto é ícone/áudio/cor.

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

## Gerando um APK para testar no celular (EAS Build)

Esse é o caminho recomendado se você **não** tem o Android Studio/SDK instalado
localmente — o build roda na nuvem da Expo e você só instala o `.apk` gerado no
celular. Passos (feitos uma vez por pessoa, precisam de login interativo, por
isso não foram automatizados):

```bash
npx eas-cli login          # cria conta grátis na Expo ou faz login na existente
npm run build:android      # builda um APK de teste (perfil "preview") na nuvem
```

O comando `build:android` vai perguntar (na primeira vez) se quer criar um
projeto EAS vinculado a este app — aceite. Ao terminar (alguns minutos), ele
mostra um link para baixar o `.apk` direto no celular (ou um QR code). Depois
de instalado, o app funciona sozinho, sem precisar do computador conectado —
é o jeito mais fiel de testar o reconhecimento de voz de verdade.

`eas.json` já está configurado com os perfis `development` (development
client, para iterar rápido com o Metro conectado), `preview` (APK
standalone, recomendado para testar com a criança) e `production`. As
variáveis do Supabase estão embutidas no `eas.json` (são só a URL e a chave
pública/anon, não segredos) já que o build na nuvem não tem acesso ao `.env`
local (que fica fora do Git).

## Arquitetura

- `src/data/words.ts` + `src/data/wordbank/*.ts` — banco de **1023 palavras** por idioma,
  organizado por tema (animais, casa, comida, corpo, verbos, adjetivos, etc). Substantivos em
  alemão sempre carregam o artigo (`der`/`die`/`das`) — a criança aprende a palavra já com o
  gênero certo. Só as 41 palavras "core" têm ilustração própria; o resto usa emoji automático.
- `src/lib/srs.ts` — repetição espaçada **SuperMemo-2** (`interval`/`repetition`/`easeFactor`),
  adaptada para acerto/erro binário: acerto aumenta o intervalo (multiplicando pelo ease
  factor), erro zera a repetição e volta pra revisão amanhã. Decide quais palavras aparecem:
  em revisão (`due`, vencidas primeiro) ou novas.
- `src/lib/dailyLimit.ts` — trava diária rígida: 10 palavras **ou** 10 minutos, o que vier
  primeiro. Persistido em AsyncStorage por dia (`YYYY-MM-DD`); ao bater o limite, a Home mostra
  o pato dormindo em vez do botão "Começar" (sem saída visível pra criança).
- `src/lib/storage.ts` — persistência local (AsyncStorage) do progresso e da sequência de dias.
- `src/screens/SessionScreen.tsx` — sessão diária: cartões divididos entre os 4 idiomas até o
  orçamento diário restante, áudio via `expo-speech` (TTS nativo). Interface quase sem texto:
  só a palavra-alvo escrita e a bandeira do idioma aparecem: sem legendas de instrução, sem
  "você disse", sem contagem "idioma X de 4" — feedback é ícone (✅/🔁) e cor.
- `src/screens/DashboardScreen.tsx` — painel para os pais: palavras dominadas/em aprendizado
  por idioma e lista das palavras com mais erros. Acesso pela Home exige **pressionar e segurar
  por 3 segundos** o ícone de engrenagem (opaco, canto superior direito) — não abre com um toque.
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
- [x] **M5** — Alinhamento com o novo documento de spec: idioma trocado de espanhol para
      **francês** em todo o banco de 1023 palavras; SRS trocado de caixas de Leitner para
      **SM-2** (`interval`/`repetition`/`easeFactor`); trava diária rígida de 10 palavras/10
      minutos (`dailyLimit.ts`, tela do pato dormindo); ícone do painel dos pais agora exige
      long press de 3s em vez de toque; interface de sessão simplificada para quase-sem-texto
      (só a palavra-alvo escrita permanece, por pedido explícito).
- [ ] **M6** — Publicação: build Android (EAS), versionamento no GitHub.
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

- TTS usa os idiomas `en-US`, `fr-FR`, `it-IT`, `de-DE` via `expo-speech` — funciona sem
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
  Text-to-Speech` se en-US/fr-FR/it-IT/de-DE estão instalados.
- **Banco de 1023 palavras**: as traduções (inclusive os artigos em alemão e o francês, trocado
  do espanhol nesta rodada) foram geradas por mim com base no meu conhecimento dos 4 idiomas,
  sem dicionário/tradutor externo para verificação automática. Para vocabulário comum a
  confiança é alta, mas recomendo uma revisão por um falante nativo (principalmente do alemão,
  pelo peso pedagógico do `der`/`die`/`das`) antes de confiar 100% nisso para uso diário.

## Desvios propositais do documento de spec

O documento novo (`Projeto Mini Poliglota markdown.md`) foi seguido à risca, exceto nestes
pontos — mantidos de propósito, por já estarem implementados e serem tecnicamente superiores
para este caso de uso:

- **STT**: mantido `expo-speech-recognition` em vez de `@react-native-voice/voice` sugerido no
  doc — é mais moderno, ativamente mantido, e tem polyfill web (permite testar no preview do
  navegador, o que `@react-native-voice/voice` não oferece).
- **Correspondência de pronúncia**: mantido `matchWord.ts` (distância de Levenshtein com janela
  deslizante, suporta alvos de mais de uma palavra como `"die Sonne"`) em vez do
  `stringSimilarity.ts` mais simples do doc (substring + 60% de tolerância) — o atual já lida
  com os artigos alemães, que o do doc não cobre.
- **Schema do Supabase**: as tabelas continuam `children`/`word_progress`/`sessions`
  (`supabase/migrations/0001_init.sql`) em vez de `words`/`progress`/`review_logs` do doc — como
  a tela de login foi removida (pedido de uma rodada de feedback anterior) e o painel dos pais
  lê tudo localmente, essa camada de nuvem está dormente hoje; renomear as tabelas não muda o
  comportamento do app agora. Posso migrar se algum dia a sincronização em nuvem voltar a ser
  usada de fato.
