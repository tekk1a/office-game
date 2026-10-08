# Office Game

## Contexto e escopo

- Repositório: https://github.com/tekk1a/office-game
- Pasta: C:\PROJETOS_CODEX\office-game
- Domínio futuro: office.tekkia.com.br
- Etapa atual: direção visual premium, preservando seleção, navegação, painel e rotinas locais já validados.
- Não implementar personagens finais, modelos externos, pathfinding complexo, IA real, OpenAI, Codex API, backend,
  Supabase, n8n, APIs, autenticação, multiplayer ou funcionalidades futuras nesta etapa.
- O domínio é referência futura; publicação e DNS não fazem parte desta etapa.

## Stack e organização

- React + TypeScript + Vite; npm e package-lock.json.
- Three.js via React Three Fiber; Drei para os controles de câmera.
- Zustand guarda os dados provisórios e ids de hover/seleção. Estado simples da interface permanece no React.
- src/App.tsx: interface e composição, sem geometrias do escritório.
- src/components/OfficeScene.tsx: Canvas, ambiente, luz e câmera.
- src/components/office/: componentes do ambiente e dimensões.
- src/agents/: tipos, dados iniciais, posições e store dos agentes.
- src/components/agents/: personagens provisórios; dados separados das geometrias.
- Altura dos personagens aproximadamente 1,76–1,78 m; posicionados ao lado das cadeiras.
- Tipar idle, walking, working, thinking, meeting, finished e error; representar idle, working e walking nesta etapa.
- src/components/ui/: AgentPanel, StatusBadge, ProgressBar e TopBar; HTML fora do Canvas.
- Clique seleciona um único id; o painel deriva os dados da store, sem duplicação.
- Hover é temporário; seleção usa anel duplo persistente. Escape, fechar e clique vazio limpam a seleção.
- Conversar, Ver tarefa e Parar são placeholders que somente registram a ação no console.
- Abrir, trocar ou fechar o painel não pode resetar câmera, zoom ou rotação.
- Arrastes da câmera não devem selecionar agentes nem limpar a seleção.
- officeLayout.ts: 1 unidade = aproximadamente 1 metro; piso 12 × 9 m.
- Manter três estações, mesas, cadeiras e monitores, sem bloquear o corredor
  central. Centros das estações a 3,5 m; mesas de 1,8 × 0,8 m, altura 0,75 m.
- OfficeCamera.tsx: câmera ortográfica, zoom e deslocamento limitados.
- src/theme/officeTheme.ts: paleta, materiais, iluminação, status e tokens da UI; cores somente neste arquivo.
- FloorPanels usa instancing; OfficeAreas compõe café, reunião e área livre sem ocupar rotas.
- AgentIndicator: rótulos HTML no root principal e projeção 3D sob demanda, sem interferir no ponteiro.
- src/index.css: estilos e responsividade, usando as variáveis derivadas do tema.
- public/: arquivos estáticos. Criar pastas somente quando houver conteúdo real.

## Convenções

- TypeScript estrito; evitar any e supressões de erros.
- Usar componentes funcionais e hooks; classes apenas quando uma API React
  exigir, como error boundaries.
- Manter móveis reutilizáveis e coordenadas em escala humana.
- Preferir primitivas leves; não adicionar modelos, texturas remotas ou assets
  externos sem necessidade e autorização no escopo.
- A cena usa frameloop demand; invalidar enquanto há movimento ou animação e voltar ao repouso na chegada.
- Waypoints e integração delta time em src/agents; AgentCharacter contém apenas a apresentação.
- agentRoutine centraliza tempos/etapas; agentBehavior decide; useAgentBehavior possui o único scheduler.
- A rotina reutiliza agentNavigation/useAgentMovement/store; não criar uma segunda navegação.
- Pausa congela decisões e esperas; a rota em andamento termina. Reinício volta às mesas por caminhada e fica pronto.
- Movimento manual é bloqueado na rotina ativa, pausada ou retornando; a store também valida o bloqueio.
- Atividade atual vem da store e é separada da tarefa demonstrativa; não duplicar estado na UI.
- Mover é um controle de teste; manter Conversar, Ver tarefa e Parar como placeholders.
- Câmera deve continuar vendo o escritório por cima, sem atravessar o piso,
  girar livremente ao redor ou ficar de cabeça para baixo.
- Não alterar node_modules nem ocultar avisos para simular uma correção.
- Preservar alterações existentes e revisar o Git antes de editar.
- Não versionar node_modules, dist, logs, credenciais ou .env locais.
- Versionar package-lock.json; usar npm ci para instalações reproduzíveis.
- Usar npm.cmd no PowerShell caso a política bloqueie npm.ps1.
- Manter configurações Git locais ao repositório.

## Validação

- npm run dev: http://localhost:5173.
- npm run typecheck: checagem de tipos.
- npm run lint: Oxlint.
- npm run build: tipos e bundle em dist/.
- npm run preview: http://localhost:4173.
- Antes de concluir: typecheck, lint, os dez testes existentes, build e verificação no navegador.
- Nesta etapa visual, não alterar a lógica de src/agents nem os testes; executar um ciclo completo e conferir folga dos novos móveis.
- Não fazer commit nem push nesta etapa visual.
- Testar Developer, Marketing, Research, fechar, reselecionar e Escape; revisar hover/seleção.
- Conferir renderização WebGL, três estações e corredor, limites de rotação,
  deslocamento, zoom e restauração da câmera. Revisar o console.
- Publicação, commit e push dependem do escopo solicitado.
- Registrar limitações reais e nunca afirmar validações não executadas.
