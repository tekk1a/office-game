# Retomada — Office Game

Estado de desenvolvimento em 14/10/2026: etapa 09 e sequência local de entregas,
revisão e cadastro de pessoas. Ler este arquivo e AGENTS.md antes de continuar.

## Objetivo

Escritório virtual 3D temático para organizar trabalhos da empresa, mostrando quem
está trabalhando, o que está bloqueado, o que precisa de atenção e as entregas.
O produto deverá reunir pessoas e agentes reais no futuro. Hoje o andamento é
registrado manualmente; o escritório traduz esses estados visualmente.

- Pasta: C:\PROJETOS_CODEX\office-game
- Repositório: https://github.com/tekk1a/office-game
- Branch: main
- Último checkpoint enviado: 510a0b6d8a407228ac2ebc96851bf352920f5fd1
  (feat: connect local tasks to office agents).
- Esta evolução é local; commit/push não foram solicitados nesta implementação.
- Domínio futuro: office.tekkia.com.br. Sem publicação/DNS neste escopo.

## O que foi preservado

Escritório premium de 12 × 9 m, três estações e agentes provisórios (Developer,
Marketing, Research), câmera ortográfica limitada, hover/seleção/painel, waypoints,
velocidade de 1,15 m/s, animação leve e rotina de demonstração. Não foram adicionados
modelos externos, avatares humanos, outra navegação ou outro scheduler.
Conversar, Ver tarefa e Parar continuam placeholders do painel.

## Gestão local implementada

- Criar/editar tarefas com título, descrição, responsável, prioridade e prazo opcional.
- Fila compacta com filtros de estado, responsável e prioridade; detalhes inline.
- Responsáveis: os três agentes fixos e cadastro/edição local de pessoas (nome/função).
- Task.assigneeId é o vínculo único; agente guarda somente currentTaskId.
- Uma tarefa working/needs_attention por responsável. Outra atribuição fica na fila.
- Estados: inbox, scheduled (fila manual), working, needs_attention e done.
- Editar metadados não reinicia movimento. Trocar responsável exige tarefa recebida/
  na fila e ausência de rota ligada a essa tarefa; não roubar tarefa ativa de outro.
- Início/retomada de agente reutiliza retorno à mesa; pessoa usa os mesmos estados
  sem avatar ou movimento. Progresso permanece manual, de 0 a 99.
- Entrega com texto/link opcional gera needs_attention/review. Aprovar gera done/100%;
  ajustes exigem motivo, preservam versões anteriores e permitem nova entrega.
- Não permitir pular revisão de entrega pendente. Concluir manualmente continua
  possível em tarefas sem entrega pendente.
- Histórico local de criação, edição, atribuição, andamento, atenção, entregas e revisão.
- Mudanças durante caminhada preservam a rota; chegada consulta a tarefa atual.

## Salvamento e backup

- localStorage: office-game.workspace.v1 (chave estável); payload/backup versão 2.
- Gravar apenas tarefas, pessoas e currentTaskId, quando mudam. Não gravar frames,
  seleção/hover, câmera, posição, rotina ou timers.
- Recarregar restaura gestão no modo Tarefas e personagens nas posições iniciais;
  a tarefa determina o estado visual. Não restaurar uma rota incompleta.
- Exportar backup gera JSON. Importar valida/pré-visualiza; Restaurar substitui
  tarefas, pessoas e vínculos atuais, mantendo posições e seleção durante essa ação.
- Restauração bloqueada durante qualquer rota ou rotina não parada.
- Backup v1 de agentes migra para v2; manter ids/progresso/vínculos.
- Backup inválido não altera a gestão. Armazenamento corrompido permanece intacto e
  bloqueado para gravação automática; Baixar dados anteriores auxilia recuperação.
- Quota/leitura indisponível mantém trabalho em memória e orienta baixar backup.
- Mudança em outra aba pausa o salvamento para evitar sobrescrever trabalho alheio.
  Não há sincronização colaborativa automática: exportar e recarregar.
- Limites locais: backup de 2 MB, 1.000 tarefas, 197 pessoas além dos três agentes.
- Links de entrega só HTTP/HTTPS, sem credenciais. Histórico é local, sem identidade
  autenticada ou garantia de auditoria.

## Organização

- src/tasks/taskTypes.ts, taskData.ts, taskValidation.ts: contratos, exemplos e metadados.
- taskTransitions.ts e taskHistory.ts: ciclo, entregas/revisão e histórico.
- taskBackup.ts e taskStorage.ts: schema, integridade, migração e persistência.
- src/participants/: responsáveis locais, sem contas/avatares.
- src/agents/useAgentStore.ts: fonte de verdade e coordenação; agentTaskBehavior.ts
  interpreta tarefa para os agentes físicos. Navegação/rotina existentes são reutilizadas.
- src/components/ui/TaskWorkspace, TaskForm, TaskBackupControls, TaskActivity,
  PeopleControls: gestão abaixo do escritório. AgentPanel/TaskControls permanecem.
- tests/taskWorkspace.test.mjs: criação/edição, pessoas, entregas, backup e persistência.
- docs/ASSET_INVENTORY.md: pesquisa de assets. ELEMENTOS 3D continua ignorada;
  não converter, importar ou publicar originais sem novo escopo.

## Validação

Validação geral executada em 14/10/2026, após concluir todo este bloco local:

- Typecheck, lint e build aprovados; 46 testes aprovados (23 anteriores + 23 novos).
- Chrome: dev localhost:5173 e preview localhost:4173 com WebGL funcionando.
  CRUD/filtros/pessoas, entregas/ajustes/aprovação, recarga, backups v1/v2 e
  inválidos, conflito entre abas, seleção/câmera/retorno à mesa/rotina conferidos.
- Mobile 390 × 844 sem transbordamento horizontal; formulários e controles
  acessíveis. O painel existente pode ser fechado para trabalhar na fila.
- Console sem erros; aviso conhecido de THREE.Clock permanece. A instrumentação
  do navegador interno não respondeu; usar a aba Chrome dedicada para inspeção.
- Exportação acionada na UI e round trip validado nos testes; o arquivo baixado
  não foi inspecionado pelo controle do navegador. Importação/restauração real na
  interface foi conferida com fixtures locais válidas e inválidas.
- Estado da aba de desenvolvimento restaurado aos cinco exemplos; fixtures e
  screenshots em artifacts/ ignorada. Sem commit/push. Resultado detalhado no README.

Avisos conhecidos do checkpoint anterior: THREE.Clock da dependência Fiber e chunk
3D de aproximadamente 947 kB / 251 kB gzip. Não ocultar avisos nem editar node_modules.

## O que ainda falta

Compartilhamento remoto, login/permissões e execução por um agente real ainda não
foram implementados: o pedido atual exclui IA/backend. Definir um novo escopo antes
dessas etapas. O sistema local não executa automaticamente os trabalhos registrados.
Personagens oficiais, chat, gamificação avançada e multiplayer ficam para etapas futuras.

## Retomada

1. Ler RETOMADA.md e AGENTS.md; conferir git status --short e git log -3 --oneline.
2. Preservar alterações locais; não resetar/limpar para forçar retorno ao checkpoint.
3. Atender só ao novo escopo. Não repetir a etapa 08 nem assumir autorização para IA/backend.
4. Dependências ausentes: npm.cmd ci. Conferir servidor ativo antes de iniciar outro.
5. Dev: npm.cmd run dev, localhost:5173. Preview: npm.cmd run preview, localhost:4173.
6. Escolher Tarefas, usar Nova tarefa/Pessoas/Fila abaixo do escritório. Agentes
   refletem tarefas; pessoas são acompanhadas pelos detalhes da fila.
7. Após novas mudanças, typecheck, lint, npm test, build e navegador. Commit/push
   ou publicação exigem solicitação no novo escopo.
