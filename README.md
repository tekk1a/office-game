# Office Game

Protótipo do escritório 3D com três agentes provisórios e painel de seleção em React, TypeScript, Vite e React Three Fiber.
O ambiente usa somente primitivas Three.js, sem modelos ou texturas externas.

- Repositório: https://github.com/tekk1a/office-game
- Domínio futuro: office.tekkia.com.br; sem publicação nesta etapa.
- Instruções: [AGENTS.md](./AGENTS.md).
- Escopo atual: ambiente, personagens, seleção, painel e navegação aprovados, com rotinas autônomas simuladas localmente. Sem IA real, OpenAI, Codex API, backend, Supabase, n8n, autenticação ou personagens finais.

## Executar

Requisitos: Node 22.12+ na linha 22 ou versão LTS posterior compatível, npm e
navegador com WebGL 2.

```sh
npm ci
npm run dev
```

Abra http://localhost:5173. O servidor escuta somente na máquina local, com
porta fixa. Se necessário: npm run dev -- --port 5174.

No PowerShell, use npm.cmd caso npm.ps1 seja bloqueado. Caso o cache padrão
não tenha permissão de escrita:

```powershell
$env:npm_config_cache = Join-Path $env:TEMP 'office-game-npm-cache'
npm.cmd ci
```

## Ambiente e escala

Uma unidade equivale aproximadamente a um metro.

- Piso: 12 × 9 m, área aproximada de 108 m².
- Duas paredes parciais: altura 1,45 m; frente e lado direito abertos.
- Três estações ao fundo: centros x = -3,5 / 0 / 3,5 m, z = -2,3 m.
- Mesas: 1,8 × 0,8 m; altura 0,75 m. Vão lateral entre tampos: 1,7 m.
- Cadeiras: assento a aproximadamente 0,48 m, encosto até 1,04 m.
- Três monitores, com teclado e mouse; caderno e xícara em cada mesa.
- Quatro plantas no piso e uma pequena sobre o armário lateral.
- Tapetes delimitam as estações. A faixa central de circulação, com cerca de
  2 m de profundidade entre z = -0,4 e 1,6 m, permanece livre de móveis; há
  espaço adicional na frente e nas laterais.

A iluminação combina luz hemisférica, luz principal quente com sombra PCF
de 2048 px e preenchimento frio. As geometrias são simples e os materiais
foscos. A cena usa renderização sob demanda e DPR limitado a 1,5.

## Câmera e controles

Câmera ortográfica com posição inicial [12, 17,42, 12], mirando [0, 0,45, 0].
A inclinação inicial é aproximadamente 45°. O enquadramento se adapta à tela.

- Arraste com o botão esquerdo: rotação limitada.
- Rolagem: zoom entre 80% e 175% do enquadramento inicial.
- Botão direito e arraste: deslocamento limitado a ±1,2 m nos eixos X/Z.
- Toque: um dedo gira; dois dedos deslocam e ajustam o zoom.
- Restaurar câmera: volta à posição, centro e zoom iniciais.
- Inclinação permitida: 38°–52°; azimute: 25°–65°.
- Redimensionar a área 3D recalcula o enquadramento e restaura a vista inicial.

## Estrutura

```text
src/
  App.tsx                         Interface e restauração da câmera
  components/
    OfficeScene.tsx               Canvas e composição da cena
    SceneErrorBoundary.tsx        Tratamento de falhas 3D
    office/
      Office.tsx                  Piso, paredes, decoração e estações
      Workstation.tsx             Agrupamento de mesa, cadeira e computador
      Desk.tsx                    Mesa e pequenos objetos
      Chair.tsx                   Cadeira
      Computer.tsx                Monitor, teclado e mouse
      Plant.tsx                   Planta low-poly reutilizável
      Lighting.tsx                Iluminação e sombras
      OfficeCamera.tsx            Enquadramento e limites de câmera
      Block.tsx                   Primitiva de caixa reutilizável
      officeLayout.ts             Dimensões e posições das estações
  index.css                       Estilos responsivos
  main.tsx                        Entrada React
```

A cena do cubo e sua store de rotação foram removidas. Zustand guarda os agentes provisórios e os ids de hover/seleção; o painel deriva o agente selecionado na etapa 04. App.tsx não contém geometria ou iluminação.

## Verificação

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

O preview serve dist/ em http://localhost:4173. Não é um servidor de produção.
O checkpoint inicial foi enviado à main no commit 53471cbb7aea8ac1d9c4b7192f4b7397597c0e15. Alterações posteriores ficam locais até um novo checkpoint solicitado.

O Fiber instalado ainda instancia THREE.Clock, depreciado pelo Three.js atual.
Esse aviso da dependência não impede a cena; não há supressão nem patch local.
O build também informa o tamanho do chunk 3D, que já é carregado por importação
dinâmica. Manter esses pontos visíveis até uma atualização das dependências
ou uma etapa específica de otimização.

A configuração Git usa OpenSSL somente neste repositório, pois Schannel
retornou SEC_E_NO_CREDENTIALS na preparação. A verificação TLS segue habilitada.

## Validação da etapa 02 — 07/10/2026

- npm run typecheck, npm run lint e npm run build: aprovados.
- Cena verificada visualmente no navegador do Codex e no Chrome.
- Verificação da árvore 3D: 3 estações, 3 mesas, 3 cadeiras e 3 monitores.
- Piso medido na cena: 12 × 9 m; WebGL ativo, sombras e renderização sob demanda.
- Limites funcionais testados: inclinação 38°–52°, azimute 25°–65°,
  zoom mínimo/máximo e deslocamento ±1,2 m. Restauração aprovada.
- Evento de rolagem alterou o zoom; tela de 390 px sem transbordamento horizontal.
- Preview de produção verificado em localhost:4173 sem erros de console.
- Sombras usam PCFShadowMap explicitamente, sem aviso de PCFSoftShadowMap.
- Permanecem os avisos não bloqueantes de THREE.Clock no Fiber e do tamanho
  do chunk 3D do Vite (aproximadamente 935 kB, 249 kB gzip).
- A aplicação de desenvolvimento está disponível em localhost:5173.


## Etapa 03 — agentes provisórios

Dados separados da renderização:

- src/agents/agentTypes.ts: Agent, AgentId, AgentPosition e os sete estados.
- src/agents/agentData.ts: registros iniciais, tarefa, progresso e posição.
- src/agents/agentPositions.ts: vínculo com a estação, posição e orientação.
- src/agents/useAgentStore.ts: dados, hoveredAgentId e selectedAgentId; sem persistência.
- src/components/agents/Agents.tsx: composição e cursor do canvas.
- src/components/agents/AgentCharacter.tsx: cabeça, tronco, braços e pernas em primitivas.

Personagens em pé ao lado esquerdo de cada cadeira, sobre o tapete. Coordenadas
X/Y/Z em metros; Y = 0,025 m coloca os pés sobre o tapete:

| Agente | Estação | Posição | Estado | Progresso | Cor |
| --- | --- | --- | --- | --- | --- |
| Developer | 1 | -4,4 / 0,025 / -1,15 | working | 72 | azul |
| Marketing | 2 | -0,9 / 0,025 / -1,15 | idle | 0 | rosa/roxo |
| Research | 3 | 2,6 / 0,025 / -1,15 | working | 45 | verde |

Altura aproximada: 1,76–1,78 m, medida pelas caixas envolventes da cena.
Developer e Research apontam os braços e o corpo para o monitor; Marketing
permanece parado, voltado ao corredor. Não há animação contínua: a postura
estática preserva a renderização sob demanda e mantém a avaliação simples.

Estados tipados: idle, walking, working, thinking, meeting, finished e error.
Somente idle e working têm representação específica; não há sistema de movimento,
transição ou execução de tarefas. As tarefas e progressos são dados demonstrativos.

Hover aplica emissividade leve à roupa, um pequeno anel no piso e cursor pointer.
Ao sair, anel e cursor voltam ao normal. Clique armazena apenas o id selecionado;
não abre interface nem executa ação. Arrastes com delta maior que 2 px não selecionam.

Validação em 07/10/2026:

- Typecheck, lint e build aprovados.
- Revisão visual no navegador do Codex e medição da cena no Chrome.
- Nenhum agente sobrepõe mesa ou cadeira; todos fora da faixa central de circulação.
- Hover, saída do hover e clique testados nos personagens; os três ids foram armazenados.
- Nenhum botão foi adicionado; câmera, escritório e estilos aprovados preservados.
- Arquivos do ambiente/câmera comparados por SHA-256, sem alteração.
- Permanecem os avisos não bloqueantes de THREE.Clock no Fiber e do tamanho do chunk 3D.
- Preview final em localhost:4173 também renderizou a etapa 03, sem erros de console.

## Etapa 04 — seleção e painel HTML

Componentes criados em src/components/ui/:

- AgentPanel.tsx: informações do agente selecionado e fechamento.
- StatusBadge.tsx: apresentação dos sete estados já tipados.
- ProgressBar.tsx: barra nativa e percentual de progresso.
- TopBar.tsx: OFFICE GAME e contagem derivada da store.

App.tsx compõe o Canvas e a interface HTML como irmãos. O painel é uma
sobreposição à direita de 300 px; em telas menores, fica no canto inferior
e admite rolagem interna. Abrir ou fechar não altera o tamanho do Canvas.

useAgentStore.ts mantém apenas um selectedAgentId e oferece clearSelection.
AgentPanel seleciona na store o registro cujo id corresponde à seleção;
nome, função, status, tarefa e progresso não são duplicados na interface.
Clicar em outro personagem troca esse único id. Escape, botão de fechar ou
clique em área vazia do Canvas limpam a seleção. Arrastes maiores que 2 px
não selecionam personagens; a proteção do Fiber também evita limpar a
seleção ao arrastar o cenário.

AgentCharacter.tsx preserva geometria e postura. Hover usa anel fino na cor
da roupa, cursor pointer e brilho leve. Seleção usa anel verde mais largo,
um segundo anel claro e brilho um pouco maior, persistindo ao sair do hover.
Conversar, Ver tarefa e Parar registram apenas ação e id no console; não
alteram tarefa, progresso ou status e não fazem chamadas externas.

A câmera não depende da seleção: nenhuma mudança de id ou abertura do
painel recria o Canvas ou aciona a restauração de câmera.
Validação em 07/10/2026:

- Typecheck, lint e build finais aprovados.
- Sequência manual Developer → Marketing → Research → fechar → reselecionar → Escape aprovada.
- Painel apresenta tarefas e progressos 72%, 0% e 45% a partir dos dados existentes.
- Botões registram somente as ações demonstrativas; status, tarefa e progresso permanecem intactos.
- Câmera com rotação e zoom modificados preservada ao abrir e fechar o painel.
- Arrastar o cenário mantém a seleção; clique vazio limpa a seleção.
- Tela de 390 × 844 px sem transbordamento horizontal; botões visíveis.
- Escritório, câmera, dados e posições comparados por SHA-256, sem alterações.
- Desenvolvimento em localhost:5173 e preview do build final em localhost:4173 sem erros de console.
- Permanecem apenas os avisos conhecidos de THREE.Clock e tamanho do chunk 3D.

## Etapa 05 — movimentação controlada

- src/agents/officeWaypoints.ts: mesas, saídas, centro, reunião, café e área livre.
- src/agents/agentNavigation.ts: criação da sequência e integração de posição/rotação.
- src/agents/useAgentMovement.ts: relógio único da cena para atualizar a store por delta time.
- src/agents/useAgentGait.ts: alternância visual dos braços/pernas e balanço leve.
- src/components/ui/MovementControls.tsx: seletor temporário e botão Mover.
- tests/agentNavigation.test.mjs: testes de FPS, estados, trajetos e folga dos obstáculos.

A store mantém posição, rotação e movement (destino, waypoints restantes,
estado final e orientação final). Ela continua sendo a fonte de verdade.
A animação visual não controla a navegação. AgentCharacter mantém proporções,
geometrias e destaque existentes; os membros agora têm pivôs para caminhar.

Os percursos saem pela lateral da cadeira e alcançam z = 0,5 m antes de
atravessar o corredor. Seguem pelo eixo X e depois para o destino. Cada mesa
é a estação do próprio agente; reunião e café são locais reservados no piso
livre, sem novos móveis. Não há busca de caminhos nem colisão dinâmica entre
agentes; enviar vários ao mesmo ponto pode sobrepô-los nesta etapa.

Velocidade: 1,15 m/s, calculada por delta time e consumindo o tempo restante
nas trocas de waypoint. Rotação usa o menor arco com suavização exponencial.
Ao retornar à mesa, o personagem volta a olhar para o monitor. Developer e
Research retomam working; Marketing fica idle. Nos demais destinos, ficam
idle. Tarefas e progressos permanecem demonstrativos e não mudam.

Os braços e pernas alternam por seno, com entrada/saída suave; há balanço
corporal de até 1,8 cm. A renderização permanece demand e continua apenas
enquanto há movimento, ajuste final de orientação ou animação a acomodar.
O delta é limitado a 50 ms para evitar saltos ao retomar uma aba suspensa.

Para testar: selecione um agente, escolha Mesa, Centro, Reunião, Café ou
Área livre em Desenvolvimento · Movimento e clique Mover. Aguarde a chegada
para enviar outro comando. Trocar seleção ou fechar o painel não interrompe
a caminhada. Conversar, Ver tarefa e Parar continuam sendo placeholders.
O foco do painel muda apenas quando o id selecionado muda, evitando interferir
na navegação por teclado durante as atualizações de posição.

Validação em 07/10/2026:

- Typecheck, lint e build aprovados; npm test passou os quatro testes.
- Developer: mesa → centro (idle) → mesa (working), com orientação restaurada.
- Marketing: mesa → reunião (idle). Research: mesa → café (idle).
- Troca de seleção durante movimento, painel e controles de rotação/zoom aprovados.
- Rotas verificadas com margem de 0,36 m para mesas, cadeiras, armário e paredes;
  margem adicional de 0,5 m para plantas, incluindo trajetos entre destinos.
- Mesma posição e rotação após 3 s a 20/30/60/120 FPS nos testes.
- A amostragem no navegador registrou 1.314 atualizações, sem teleporte;
  maior passo observado de aproximadamente 4,74 cm.
- Na chegada, os pivôs da animação voltaram a zero e frames pendentes voltaram a zero.
- Console de desenvolvimento sem erros; permanece o aviso de THREE.Clock da dependência.
- Build mantém o aviso conhecido de tamanho do chunk 3D, carregado dinamicamente.
- Preview final em localhost:4173 também validou Developer → centro, Walking → Idle, sem erros de console.

## Etapa 06 — rotinas locais simuladas

- agentRoutine.ts: tipos da rotina, etapas por agente, atividades e todos os tempos.
- agentBehavior.ts: controller puro; decide etapas e delega rotas à navegação existente.
- useAgentBehavior.ts: único scheduler de decisões, com cleanup ao desmontar/mudar modo.
- RoutineControls.tsx: Iniciar/Continuar, Pausar e Reiniciar rotina.
- tests/agentBehavior.test.mjs: sequências, esperas, pausa, retomada, reinício e bloqueio manual.

AgentCharacter continua somente visual, sem temporizadores de comportamento.
AgentNavigation, useAgentMovement e os waypoints existentes continuam sendo o
único sistema de deslocamento. Não há IA, API, backend ou nova dependência.
O controller puro recebe agentes, rotina e delta e retorna o próximo estado;
isso separa decisões simuladas da navegação e da apresentação, sem implementar
nenhum evento externo agora.

A store guarda routine (modo e estado de cada sequência), currentActivity,
status e movimento. A atividade é separada da tarefa/progresso demonstrativos,
que não são reescritos. O painel deriva esses dados diretamente da store.

| Agente | Sequência repetida | Tempos parado |
| --- | --- | --- |
| Developer | Mesa working → Centro idle → Café idle → Mesa working | Mesa 10 s; centro 2 s; café 5 s |
| Marketing | Mesa working → Reunião meeting → Mesa idle → Mesa working | Trabalho 12 s; reunião 8 s; idle 6 s |
| Research | Mesa working → Área livre idle → Centro idle → Mesa working | Trabalho 15 s; área livre 4 s; centro 3 s |

No primeiro ciclo, a espera inicial tem deslocamentos adicionais de 0/2/4 s
para Developer/Marketing/Research. As esperas começam após chegada e orientação.
O scheduler verifica decisões a cada 100 ms e limita delta a 250 ms para não
saltar etapas após suspensão da aba. A integração de movimento mantém 1,15 m/s
com delta time, no hook já existente. Enquanto só a espera muda, as referências
dos agentes são preservadas para evitar renderização 3D contínua desnecessária.

A demonstração começa Pronta e é iniciada pelo botão. Pausar congela os tempos
de espera e impede novas decisões; qualquer rota em andamento termina normalmente.
O destino concluído ainda atualiza status/atividade durante a pausa. Continuar
retoma a mesma etapa, sem restaurar câmera ou recomeçar o cronômetro de espera.

Reiniciar deixa a rota em andamento terminar e então envia cada agente à sua
própria mesa pela navegação existente; não teleporta, nem sobrescreve uma rota
em andamento. Ao terminar, Developer/Research ficam working e Marketing idle,
e o controller volta a Pronta. Clique Iniciar para uma nova demonstração.
A seleção e a câmera não são resetadas pelo controller.

Decisão de conflito: movimento manual fica disponível quando a rotina está
Pronta; é bloqueado enquanto Ativa, Pausada ou Retornando às mesas. O bloqueio
existe na UI e na store. Se já houver um movimento manual ao iniciar, ele termina
antes de o controller encaminhar o agente à etapa inicial na mesa.
Conversar, Ver tarefa e Parar continuam placeholders sem ação real.

As rotas permanecem fixas e sem colisão dinâmica entre agentes; pontos compartilhados
podem ser ocupados ao mesmo tempo. Não há movimentos aleatórios nem pathfinding.
Validação da etapa 06 em 07/10/2026:

- Typecheck, lint, build e dez testes automatizados aprovados (seis de comportamento, quatro de navegação).
- Os três ciclos completos foram observados no navegador, com status e atividades corretos no painel.
- Seleção de Developer durante caminhada aprovada, sem interromper a rota.
- Pausa com Developer e Research caminhando: ambos concluíram o destino, sem iniciar outro percurso.
- Tempos e estados permaneceram idênticos durante a pausa após as chegadas; renderização voltou a zero frames pendentes.
- Continuar retomou a rotina; reiniciar devolveu todos às mesas por caminhada e deixou o controle em Pronta.
- Reinício preservou a seleção de Marketing e a posição/rotação/zoom da câmera, inclusive após ajuste manual durante a pausa.
- Movimento manual ficou novamente disponível após reinício; bloqueio na store também coberto por testes.
- Escritório, câmera, personagens, waypoints e useAgentMovement não foram alterados em relação ao checkpoint.
- Desenvolvimento e preview final sem erros de console; permanecem somente os avisos conhecidos de THREE.Clock e tamanho do chunk 3D.
- Preview em localhost:4173 validou renderização e os controles Iniciar/Pausar. Os ciclos completos foram testados em localhost:5173.
