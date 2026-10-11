# Retomada — Office Game

Checkpoint da etapa 08: modelo local de tarefas ligado aos agentes.
Registro preparado em 10/10/2026. Leia este arquivo e AGENTS.md antes de continuar.

## Objetivo do produto

Escritório virtual 3D temático e gamificado para organizar os trabalhos da empresa,
com pessoas e agentes de IA como responsáveis. O escritório deverá mostrar quem
está trabalhando, o que está bloqueado, o que exige atenção e o que foi entregue.
Execução real por agentes e colaboração entre pessoas são objetivos futuros.

- Pasta: C:\PROJETOS_CODEX\office-game
- Repositório: https://github.com/tekk1a/office-game
- Branch: main, acompanhando origin/main.
- Domínio futuro: office.tekkia.com.br. Publicação e DNS ainda não realizados.
- Mensagem do checkpoint: feat: connect local tasks to office agents
- Base anterior: 9d19e92 — feat: establish premium office visual direction.
- Para obter o hash deste checkpoint: git log -1 --format="%H %s" -- RETOMADA.md.

## Estado concluído

- React, TypeScript, Vite, React Three Fiber, Drei, Three.js e Zustand.
- Escritório premium de 12 × 9 m, três estações, reunião, café e circulação livre.
- Câmera ortográfica diagonal com limites de rotação, deslocamento e zoom.
- Developer, Marketing e Research em primitivas, aproximadamente 1,76–1,78 m.
- Hover, seleção, painel HTML, fechamento, Escape e restauração da câmera.
- Caminhada de 1,15 m/s, rotação suave e animação leve por waypoints existentes.
- Demonstração: rotinas locais com início, pausa e retorno às mesas por caminhada.
- Tarefas: cinco exemplos com id, título, descrição, responsável, progresso,
  motivo de atenção e datas de criação/alteração.
- Ciclo de tarefa: inbox → scheduled → working → needs_attention → working → done.
  Working também pode ir diretamente a done. Scheduled é fila de início manual.
- Uma tarefa working ou needs_attention por agente; outras atribuições ficam na fila.
- Iniciar/retomar leva à mesa e ao monitor. Dúvida/revisão resultam em idle;
  erro resulta em error; conclusão resulta em finished e progresso de 100%.
- A tarefa pode estar working enquanto o personagem está walking. Alterações
  durante o deslocamento preservam a rota e são reconsideradas na chegada.
- Progresso manual de 0 a 99%; Concluir define 100%. Não há avanço automático.
- Demonstração e Tarefas são modos separados. Rotina/Mover somente na demonstração;
  comandos de tarefa somente em Tarefas. Troca de modo aguarda todas as rotas.
- Escritório, câmera, geometria dos personagens, waypoints e animação preservados
  na implementação desta etapa. Não houve nova dependência ou segundo scheduler.

O ciclo foi inspirado no Hermes3D; a implementação é própria e local. Não foram
importados o backend, os executores ou integrações do projeto de referência.

## Limitações reais

- É um protótipo interativo com tarefas demonstrativas. Não executa trabalho real.
- Tarefas ficam em memória: recarregar restaura os exemplos. O checkpoint Git salva
  o código e a documentação, não as alterações transitórias feitas na interface.
- Ainda não há criação/edição livre de tarefas, persistência local, histórico,
  registro de entregas ou visão geral da fila para gestão da empresa.
- Conversar, Ver tarefa e Parar são placeholders que registram ações no console.
- Não há cadastro de pessoas, autenticação, permissões, colaboração ou multiplayer.
- Não há IA real, backend, Supabase, n8n ou APIs externas.
- Pontos de movimento são definidos. Não há pathfinding nem colisão dinâmica entre
  agentes; personagens enviados ao mesmo ponto podem se sobrepor.
- Personagens são provisórios. Não há modelos oficiais importados.

## Onde ficam as responsabilidades

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| src/tasks/taskTypes.ts | Tipos, estados, modos e rótulos de tarefa |
| src/tasks/taskData.ts | Cinco tarefas iniciais de exemplo |
| src/tasks/taskTransitions.ts | Validação pura das transições e progresso |
| src/agents/useAgentStore.ts | Fonte de verdade: tarefas, agentes, seleção e modos |
| src/agents/agentTaskBehavior.ts | Tradução da tarefa para estado visual e retorno à mesa |
| src/agents/agentNavigation.ts e officeWaypoints.ts | Única navegação e integração por delta time |
| src/agents/agentRoutine.ts, agentBehavior.ts e useAgentBehavior.ts | Demonstração e seu único scheduler |
| src/components/ui/TaskControls.tsx | Controles locais de atribuição, execução, atenção e conclusão |
| src/components/ui/AgentPanel.tsx | Painel derivado da store, sem duplicação de tarefa/progresso |
| src/components/office/ e src/theme/officeTheme.ts | Ambiente aprovado, dimensões, câmera e visual |
| tests/ | Dez testes de rotina/navegação e treze testes de tarefas |
| docs/ASSET_INVENTORY.md | Inventário, análise do manequim e candidatos para personagens futuros |

## Assets e Git

ELEMENTOS 3D/ contém originais locais; está ignorada pelo Git e não entra no
checkpoint. Não modificar, converter, importar ou enviar esses assets sem escopo
específico. O inventário é documentação; os modelos e suas licenças precisam ser
avaliados antes de uma futura integração. O manequim analisado no Blender não foi
importado para o Office Game e não possui clips prontos úteis identificados.

node_modules/, dist/, artifacts/, logs, .env locais e arquivos tsbuildinfo também
ficam ignorados. package-lock.json permanece versionado. O checkpoint inclui o
inventário e a proteção da pasta original, que estavam pendentes localmente.

## Validação

Na implementação da etapa 08: typecheck, lint, 23 testes e build aprovados;
desenvolvimento e preview conferidos no navegador, incluindo movimento, fila,
atenção, conclusão durante caminhada, seleção, câmera, placeholders e Escape.
Tela de 390 × 844 px conferida sem transbordamento horizontal.

Neste checkpoint, typecheck, lint, os 23 testes e build foram repetidos e aprovados.
A renderização foi conferida novamente no navegador, com o painel de tarefas
preservado e sem erros de console capturados. As sequências completas de interação
e o teste de celular pertencem à validação da implementação descrita acima.

O salvamento segue commit na main e push normal para origin/main. Antes de retomar,
conferir o histórico e comparar git rev-parse HEAD com git ls-remote origin refs/heads/main;
mudanças posteriores podem ter avançado o checkpoint.

Avisos conhecidos: THREE.Clock depreciado na dependência Fiber; chunk 3D do Vite
de aproximadamente 947 kB / 251 kB gzip, carregado sob demanda. Não foram ocultados
avisos nem alteradas dependências para silenciá-los.

## Próxima etapa proposta — ainda não implementada

Prioridade sugerida: criação/edição de tarefas reais + salvamento local + visão da
fila. Definir o escopo com o usuário na retomada; este checkpoint não autoriza
começar a próxima implementação automaticamente.

Fluxo alvo do primeiro MVP: criar tarefa → atribuir responsável → acompanhar
execução → registrar entrega → revisar → concluir.

Evolução proposta, por etapas:

1. Gestão local: formulário de tarefa, edição, prioridade/prazo e visão compacta da fila.
2. Persistência local com exportação/importação para avaliar o fluxo com trabalhos reais.
3. Pessoas e agentes como tipos de responsáveis; registro de entregas e mudanças.
4. Uso compartilhado: armazenamento remoto, login e permissões, após autorização.
5. Um agente real em piloto delimitado, com entrega e revisão humana; ampliar depois.

Preservar o ambiente aprovado durante esse caminho. Personagens oficiais, novos
ambientes, chat completo, gamificação avançada e multiplayer podem vir depois do
piloto; não são requisitos para testar o ciclo de gestão local.

## Procedimento de retomada

1. Ler RETOMADA.md e AGENTS.md; executar git status --short e git log -3 --oneline.
2. Preservar qualquer mudança posterior. Não executar reset, clean ou sobrescrever
   arquivos para forçar o retorno ao checkpoint.
3. Confirmar qual próximo escopo o usuário quer iniciar; não repetir a etapa 08.
4. Se dependências estiverem ausentes, instalar com npm.cmd ci.
5. Conferir se localhost:5173 já está ativo. Se necessário, executar npm.cmd run dev.
   Preview: npm.cmd run preview em localhost:4173. Não presumir processos ativos
   após fechar/reabrir o app ou reiniciar a máquina.
6. Para explorar o protótipo: escolher Tarefas abaixo do escritório, selecionar um
   personagem e usar a seção Tarefas locais no painel. Demonstração mantém a rotina.
7. Depois de uma nova implementação, executar typecheck, lint, testes, build e
   validar no navegador. Commit, push e publicação seguem o novo escopo autorizado.

Prompt sugerido: "Retome o Office Game lendo RETOMADA.md e AGENTS.md. Parta do
checkpoint das tarefas locais, preserve escritório/câmera/painel e implemente
somente a próxima etapa que eu especificar."
