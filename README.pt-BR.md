# Best Prompt Ever

[English](README.md)

Best Prompt Ever é uma skill para agentes que entrevista você e transforma um pedido vago num prompt completo, com qualidade de ticket, que um agente de código consegue executar de primeira. Prompts vagos obrigam o agente a adivinhar: ele mexe nos arquivos errados, copia o padrão errado, ignora casos de borda e termina sem provar que o trabalho está feito. O retrabalho que vem depois custa mais do que as perguntas que o teriam evitado.

## O que a diferencia

- **Perguntas informadas pelo repositório.** Antes de perguntar, a skill lê o código. As perguntas vêm com opções concretas tiradas do repositório, por exemplo: "Achei fluxos parecidos em `src/billing/export.ts` e `src/reports/csv.ts`; qual seguir?" Você escolhe em vez de descrever de memória.
- **Um prompt executável com validação.** O resultado não é um resumo da conversa. Ele traz os arquivos a alterar, os padrões a seguir e a evitar, o plano de execução (branches, PRs, ordem das migrations) e cenários de validação numerados com a evidência que o agente precisa mostrar.

## Como funciona

```
entrada → reconhecimento silencioso → análise de lacunas → rodadas de perguntas → entrega
```

1. **Entrada.** Seu pedido inicial. Se vier vazio, a skill pergunta só *o que* e *onde*.
2. **Reconhecimento silencioso.** Só leitura. Lê os arquivos de instrução de agentes (`CLAUDE.md`, `AGENTS.md`), stack e versões, a área da mudança, fluxos parecidos e as convenções de branch e commit. Nunca pergunta o que consegue descobrir sozinha.
3. **Análise de lacunas.** Avalia cada ponto do prompt final, dá um palpite do tipo e do tamanho da tarefa e decide quais pontos são obrigatórios.
4. **Rodadas de perguntas.** De 1 a 4 perguntas por rodada, do geral para o específico, cada uma com opções concretas e uma sugestão. Resposta vaga recebe uma pergunta de acompanhamento; se o ponto continuar vago, ele é estacionado e retomado depois.
5. **Entrega.** Mostra o prompt final e pergunta se pode executar.

### Níveis por ponto

Cada ponto do prompt (objetivo, arquivos a alterar, cenários de validação etc.) tem um nível:

| Nível | Significado |
|---|---|
| vazio | Nada conhecido ainda. |
| vago | Algo foi dito, mas o agente ainda teria que adivinhar. |
| parcial | Dá para agir em parte do trabalho. |
| completo | O agente consegue agir sem perguntar. |
| delegado | Você disse "decide você"; o prompt registra o critério que o agente vai usar. |
| não se aplica | Não vale para esta tarefa. |

### Tamanho da tarefa

A skill estima o tamanho a partir do objetivo, da área e das unidades de trabalho, e ajusta conforme você responde.

| Tamanho | Limite de rodadas | Efeito |
|---|---|---|
| small | 2 | Pontos com um padrão claro no repositório (branch base, convenção de commit, como verificar, evidência esperada) são preenchidos com o que ela encontrou, mostrando a fonte, em vez de perguntados. |
| medium | 4 | Esses padrões viram sugestões e são confirmados com você. |
| large | 6 | Igual ao medium e, no fim, ela oferece levar o prompt para uma sessão nova. |

O nome da branch é sempre escolha sua: a skill oferece 2 ou 3 nomes no padrão do repositório, ou você escreve o seu.

### O painel

Antes de cada rodada, a skill mostra em que pé as coisas estão:

```
Type: feature (guess) · Size: medium · Units: 1) migration 2) feature · Round 2/4
complete   objective, area, stack, similar flows
partial    files, validation scenarios
vague      patterns to follow
empty      risks
parked     forbidden patterns (2 tries)
n/a        migration order (unit 2)
```

(Numa conversa em português, o painel sai em português.)

### O fim

A entrevista termina quando todos os pontos obrigatórios estão resolvidos, quando você diz "chega" ou quando o limite de rodadas é atingido. O que ficou em aberto vai para a seção "Perguntas em aberto e suposições". A skill então mostra o prompt na conversa, diz que já tem o contexto necessário e pergunta se pode executar. Em tarefas grandes, também oferece copiar o prompt para uma sessão nova. Nenhum arquivo é salvo.

## Instalação

> A skill ainda está em desenvolvimento: o `SKILL.md` não foi escrito, então estes comandos só vão instalar uma skill funcional depois que ele existir.

**Plugin do Claude Code**

```
/plugin marketplace add lfelipearruda1/best-prompt-ever
/plugin install best-prompt-ever@best-prompt-ever
```

**CLI skills** (Claude Code, Codex, Cursor e outros agentes)

```
npx skills add lfelipearruda1/best-prompt-ever
```

**Manual**

Copie `skills/best-prompt-ever/` para `~/.claude/skills/`.

## Como usar

Comece com um pedido vago dentro de um repositório:

> Adiciona exportação CSV na página de relatórios.

A skill lê o repositório, mostra o painel e pergunta algo como:

> Achei dois fluxos de exportação: `src/billing/export.ts` (faz streaming das linhas, tem testes) e `src/legacy/csv.js` (sem testes). Qual seguir?
> 1. `src/billing/export.ts` (sugestão: mais novo e testado)
> 2. `src/legacy/csv.js`
> 3. Nenhum dos dois

Depois de algumas rodadas, ela mostra um prompt mais ou menos assim:

```
Objetivo: um usuário logado consegue exportar a tabela do relatório atual em CSV pela página
do relatório, com as mesmas colunas e filtros da tela.
Contexto do repositório: seguir src/billing/export.ts; alterar src/reports/ReportPage.tsx e
src/reports/api.ts; criar src/reports/exportCsv.ts e o teste dele. Fora do escopo: exportar PDF.
Execução: base main, branch feat/report-csv-export (escolhida), um PR.
Validação:
  1. Relatório com filtros → Exportar → o CSV tem só as linhas filtradas.
  2. Relatório sem linhas → o arquivo tem só o cabeçalho.
  3. Usuário sem acesso → 403, nenhum arquivo.
  Evidência: saída dos testes passando para 1–3 e do lint nos arquivos alterados.
Perguntas em aberto e suposições: …
```

E pergunta se pode executar.

## Língua

A skill responde na língua da sua primeira mensagem. Perguntas, painel e prompt final saem nessa língua; nomes de arquivos, funções e comandos ficam como estão no código. Você pode pedir o prompt em outra língua.

## Privacidade e segurança

- **Entrevista só de leitura.** Nada é escrito durante a entrevista: nenhuma edição, branch, commit ou arquivo. A implementação só começa depois que você confirma, como trabalho normal do agente, sob as regras dele.
- **Nenhum arquivo de segredo.** O reconhecimento nunca abre arquivos `.env*` (exceto modelos como `.env.example`), credenciais, chaves privadas ou arquivos `*.pem`.
- **Nenhum segredo no prompt.** O prompt cita arquivos pelo caminho e nunca inclui tokens, senhas, strings de conexão ou dados pessoais.

## Status

Em desenvolvimento. O design (`DESIGN.md`) e a referência da anatomia (`skills/best-prompt-ever/references/anatomy.md`) estão escritos; o `SKILL.md` ainda não.

Contribuições são bem-vindas: abra uma issue ou um pull request. O `DESIGN.md` é a fonte da verdade, então propostas que mudam comportamento devem começar por ele.

## Licença

[MIT](LICENSE)
