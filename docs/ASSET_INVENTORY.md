# Inventário técnico de assets 3D — Office Game

Data da análise: **07/10/2026**. Pasta analisada: `C:\PROJETOS_CODEX\office-game\ELEMENTOS 3D`.

**Atualização posterior:** os números do inventário abaixo descrevem o acervo original, antes de novos downloads. Após autorização do usuário, foi acrescentado um manequim BlenderKit com rig para análise exclusiva no Blender; consultar a seção final. Ele não foi importado para o Office Game.

## Resultado executivo

- **2.251 arquivos**, **4.177.604.118 bytes** (aproximadamente **3,89 GiB**), distribuídos por 24 diretórios de primeiro nível e arquivos na raiz.
- **Aproximadamente 34 assets/conjuntos reconhecíveis**: 18 acessórios individuais do pacote Office Supplies e 16 conjuntos de móveis, estações, plantas ou arquitetura. A contagem não soma cada cadeira de uma cena e não confunde cópias/formats com novos assets.
- **86 arquivos em formatos de modelo**: 37 FBX, 32 OBJ, 10 BLEND, 5 GLB e 2 GLTF. Desses, 8 estão vazios, um é metadado AppleDouble e um FBX não pôde ser lido. Há 70 conteúdos distintos não vazios de modelo, excluindo AppleDouble; isso inclui a variante FBX ilegível.
- **Nenhum pacote de personagem humano identificado**, nenhum rig humano/skeleton encontrado nos modelos legíveis e nenhuma animação útil de personagem identificada. A próxima etapa de Character System precisará de outros assets de personagem.
- Bons candidatos para **seleção de peças e adaptação futura**: Modern Desk, partes do Interactive Workspace Desk, Office Computer, Sofa 005 e Office Microphone. Não significa que os arquivos completos estejam prontos para importação direta no navegador.
- **1.805 imagens externas**, incluindo previews e cópias repetidas; **437 conteúdos de imagem distintos não vazios**. Imagens internas de GLB e imagens empacotadas no BLEND são descritas separadamente.
- Nenhum arquivo de licença/termos de uso foi encontrado. `Metadata.txt` do Spline é uma ficha técnica, não uma licença. A origem comercial e o direito de uso de cada aquisição precisam ser comprovados pela documentação original, fora desta pasta quando aplicável.

## Método e limites

A árvore inteira foi percorrida. Todos os arquivos receberam leitura de tamanho, formato e SHA-256; cabeçalhos de imagens forneceram suas dimensões. FBX binário (incluindo versões 6.1 e 7.x), OBJ e JSON de GLB/GLTF foram consultados sem conversão. Os cinco conteúdos BLEND válidos e distintos foram carregados em **Blender 5.2.0 LTS headless**, com `--factory-startup --disable-autoexec`, `use_scripts=False` e gravação temporária automática desativada. Não houve salvar, exportar, converter ou renderizar. Foram observados somente previews já existentes de Spline e dos conjuntos de sofás/mesa com cadeiras.

Triângulos são a triangulação aproximada dos polígonos armazenados. No BLEND, contam-se as malhas de base, **sem avaliar modificadores**; exportações podem ter muito mais polígonos. No GLTF Spline há diferença entre geometria única e geometria instanciada pelos nós. Materiais significam datablocks/slots exportados, não uma medição de draw calls. A escala em metros, fidelidade de shaders, orçamento final de GPU, desempenho em celular e integração com a câmera atual **não foram testados por importação no jogo**. Não foram atribuídas alturas humanas a objetos de cenário.

As dimensões e quantidades de texturas de uma pasta incluem previews, variações e duplicatas; não são necessariamente todas utilizadas pelo modelo. Referências de FBX/MTL foram comparadas por nome de arquivo para estimar dependências e resolução; isso não garante que os caminhos antigos estejam corretamente conectados no Blender.

## Categorias

| Categoria | Conteúdo encontrado | Aplicação possível |
| --- | --- | --- |
| Personagens | Nenhum personagem humano reconhecido | Não há base de agente masculino/feminino nesta seleção |
| Móveis | 3 estações, cadeiras associadas, 3 conjuntos de sofá, mesa com 6 cadeiras, gaveteiros e móveis de cenas maiores | Selecionar peças para estações, lounge e reunião |
| Computadores/eletrônicos | Computador/monitor, notebook, impressora, copiadora, projetor, telefones, roteador, caixas de som, disco externo e microfone | Equipamentos de mesa e decoração tecnológica |
| Decoração | Jornais, lixeiras, itens de mesa, relógio, mural e objetos residenciais | Compor pequenas áreas sem importar cenas inteiras |
| Arquitetura | Apartment, Residence, Castle Library, Industrial Design Interior, Industrial Warehouse e Warehouse Loft | Referência e eventual extração de componentes |
| Plantas | Outdoor Plants 2 e pequena planta no preview Spline | Preferir planta simples; conjunto Outdoor é muito denso |
| Iluminação | Office Lamps e luzes/câmeras nativas nas três estações/loft | Selecionar luminária; iluminação de render não é solução pronta para R3F |
| Outros | Fonte Spline, projeto Substance Painter, tutorial, MTL, texturas soltas e metadados AppleDouble | Arquivos de autoria/documentação; não são assets de runtime |

## Conjuntos principais

Os caminhos abaixo são relativos à pasta `ELEMENTOS 3D`. Todas as versões e seus caminhos completos relativos constam no anexo. O tamanho de cada conjunto inclui imagens, documentos e formatos duplicados **dentro da pasta indicada**, sem somar suas cópias na raiz.

| Asset / categoria | Pasta | Formatos | Tamanho do conjunto | Triângulos aproximados | Materiais / texturas | Avaliação |
| --- | --- | --- | --- | --- | --- | --- |
| Home Desk — Móveis / estação | `a-simple-workspace-2026-09-01-05-57-01-utc/` | BLEND, FBX, OBJ, MTL | 63.90 MiB | 420.338 base; 476.204 FBX/root OBJ; 222.538 OBJ do pacote | 8 ativos no BLEND; sem imagens | Fonte editável, mas curva/malha dominante de 298.284 tri e Subdivision nível 3 tornam o conjunto pesado. |
| Modern Desk — Móveis / estação | `computer-desk-with-chair-2026-09-03-04-05-06-utc/` | BLEND, FBX, OBJ, MTL | 29.73 MiB | 131.706 base; 274.914 exportados | 7 ativos; sem imagens | Melhor fonte BLEND para separar mesa/cadeira/acessórios; FBX da pasta ilegível, cópia FBX na raiz válida. |
| Enjoy Desk — Móveis / estação | `computer-workstation-2026-09-01-05-57-06-utc/` | BLEND, FBX, OBJ, MTL | 72.07 MiB | 649.074 base; 1.018.984 exportados | 7 ativos; sem imagens | Um objeto concentra 639.124 tri de base. Não importar estação inteira. OBJ do pacote vazio. |
| Interactive Workspace Desk — Móveis / eletrônicos / decoração | `interactive-workspace-desk-2026-09-01-06-09-42-utc/` | GLTF, SPLINE | 31.04 MiB | 351.558 únicos; 1.083.002 com instâncias | 33 materiais; 0 imagens/texturas no GLTF | Preview estilizado coerente com game. 892 nós e 114 malhas; extrair cadeira, monitor, notebook, gaveteiros e planta. Sem BLEND/FBX/OBJ. |
| Outdoor Plants 2 — Plantas | `aligned-potted-trees-beside-arched-windows-2026-09-01-06-06-02-utc/` | FBX, OBJ, MTL | 226.73 MiB | 1.714.590 | 9 materiais FBX; 18 imagens externas até 1.842 px | 4 malhas muito densas; texturas relativamente pequenas, geometria é o principal problema. |
| Kitbash City Streets Newspapers — Decoração / móveis urbanos | `kitbash-city-streets-newspapers-2026-09-01-05-58-02-utc/` | BLEND, FBX, OBJ, MTL | 87.97 MiB | 19.066 | 7 ativos; 37 mapas 2K | 3 peças editáveis. Trash tem 1.146 tri; bancas 7.340 e 10.580. Caminhos de texturas no BLEND não resolvem. |
| Futon Sofa Bed — Móveis / sofá | `modern-convertible-futon-sofa-bed-3d-model-2026-09-01-06-09-25-utc/` | GLB; FBX vazio; SPP | 268.74 MiB | 124.704 | 1 material; 4 mapas 4K dentro do GLB | Sofá amarelo, silhueta clara; sem animação de conversão. SPP tem 227,43 MiB e é arquivo de autoria. |
| Sofa 002 — Móveis / sofá, poltronas, mesa | `realistic-sofa-model-002-2026-09-01-05-58-48-utc/` | GLB, FBX | 27.49 MiB | 187.358 | 1 material; 3 mapas 4K dentro do GLB | Conjunto de lounge externo/trançado, uma malha exportada. Requer separar peças e adaptar estilo. |
| Sofa 005 — Móveis / sofá | `realistic-sofa-model-005-2026-09-01-06-08-50-utc/` | FBX; GLB válido na raiz | 29.54 MiB | 90.340 | 1 material; 3 mapas 4K no GLB da raiz | Sofá azul com pés dourados; bom candidato ao lounge. GLB da pasta está vazio. |
| Office Table Chair — Móveis / mesa, cadeiras | `office-table-chair-2026-09-01-06-08-51-utc/` | GLB; FBX vazio | 66.89 MiB | 199.999 | 1 material; 3 mapas 4K dentro do GLB | Preview mostra mesa externa com seis cadeiras, não cadeira ergonômica; conjunto numa malha. |
| Apartment / CGcos_fp4 — Arquitetura / móveis residenciais | `detailed-apartment-floor-plan-with-balcony-2026-09-01-06-06-05-utc/` | FBX, OBJ, MTL | 185.34 MiB | 1.077.492 | 120 materiais; 158 imagens externas | 154 malhas; aproveitar somente peças justificadas, não planta residencial completa. |
| Castle Library — Arquitetura / decoração | `grand-castle-library-interior-low-poly-2026-09-01-06-06-06-utc/` | FBX, OBJ, MTL | 442.31 MiB | 91.210 | 38 materiais; 268 imagens, muitas 4K/8K | 418 malhas e estilo medieval apesar do nome low-poly. Texturas/draw calls e incompatibilidade visual. |
| Industrial Design Interior — Arquitetura / interior | `modern-industrial-loft-office-with-open-hall-2026-09-01-06-06-06-utc/` | FBX, OBJ, MTL | 97.49 MiB | 677.160 FBX; 675.624 OBJ | 8 materiais; 10 imagens externas (1 vazia), mapas 4K | 807 malhas exportadas; cena completa fragmentada e mais adequada a referência. |
| Residence / CGcos_fp5 — Arquitetura / móveis residenciais | `modern-residence-floor-plan-with-pool-and-deck-2026-09-01-05-53-07-utc/` | FBX 6.1, OBJ, MTL | 823.30 MiB | 2.718.374 FBX; 2.718.368 OBJ | 184 materiais; 296 imagens externas até 2K | 198 malhas, FBX de cerca de 500 MiB; cenário residencial completo muito pesado. |
| Industrial Warehouse 3 — Arquitetura / industrial | `warehouse-interior-with-skylight-and-industrial-el-2026-09-01-05-52-43-utc/` | FBX 6.1 | 178.12 MiB | 531.026 | 53 materiais; 50 imagens externas | 112 malhas e 8 cópias de panorama 14.161×1.544. Ambiente industrial distante da direção visual. |
| Warehouse Loft — Arquitetura / loft | `warehouse-loft-2026-09-01-05-58-24-utc/` | BLEND, FBX, OBJ, MTL | 407.36 MiB | 56.094 | 2 ativos; 8 imagens 4K empacotadas no BLEND | 2 malhas + 6 luzes. 20 imagens externas em versões 4K/8K; referência arquitetônica, não importar escritório completo. |

### Cópias e arquivos genéricos na raiz

`Home Desk.blend`, `Modern Desk.blend` e `Enjoy Desk.blend` são cópias byte a byte das fontes nas respectivas pastas. Os FBX Home/Enjoy também são duplicados. `Modern Desk.fbx` da raiz é **válido e diferente** do FBX ilegível do pacote; `Modern Desk.obj` duplica o OBJ do pacote. Os OBJ Home Desk da raiz e do pacote têm geometrias diferentes, portanto não devem ser tratados como cópias idênticas.

`FBX.fbx` da raiz é idêntico ao FBX de **Sofa 005**. `GLB.glb` da raiz tem a mesma contagem de triângulos/material e as mesmas características desse sofá; sua associação ao Sofa 005 é sustentada também pelo preview correspondente e pelo FBX duplicado, não pelo nome genérico. Não se deve escolher qualquer `FBX.fbx` ou `GLB.glb` de outra pasta como se fosse o mesmo modelo. `KB3D_CTS_BldgSM_S.blend` da raiz está vazio, mas a fonte dentro do pacote Kitbash é válida.

## Acessórios Office Supplies

Base: `office-supplies-arrangement-2026-09-01-06-06-02-utc/`. São **18 acessórios**, em FBX e OBJ/MTL, sem BLEND ou GLB/GLTF. O pacote ocupa **608,20 MiB**, com 849 imagens externas repetidas nas pastas dos acessórios. Essa quantidade não representa 849 mapas necessários em uma cena. Os caminhos FBX aparecem abaixo; o anexo também lista os OBJ. Materiais e geometria desta tabela são do FBX. Referências de textura são nomes distintos, sem contar duplicações entre registros Texture/Video; resolução obtida por correspondência de nome nos arquivos locais.

| Peça | Caminho FBX relativo à base | FBX em disco | Triângulos | Malhas | Materiais | Texturas referenciadas | Uso / ressalva |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cd rack | `cd rack_fbx/cd rack_fbx.FBX` | 7.33 MiB | 261.616 | 47 | 8 | 4 nomes; até 639 px | Porta-CDs; detalhe excessivo para prop pequeno. |
| clutter | `clutter_fbx/clutter_fbx.FBX` | 18.15 MiB | 690.387 | 188 | 29 | 12 nomes; até 2.500 px | Conjunto variado para extrair somente pequenos objetos; 188 malhas. |
| epson printer | `epson printer_fbx/epson printer_fbx.FBX` | 1.91 MiB | 71.682 | 8 | 5 | 2 nomes; até 496 px | Impressora de mesa; logos são detalhes dispensáveis na visão isométrica. |
| external hard disk | `external hard disk_fbx/external hard disk_fbx.FBX` | 1.36 MiB | 49.794 | 4 | 5 | 2 nomes; até 1.200 px | Acessório tecnológico; 49 mil tri para disco pequeno. |
| laptop | `laptop_fbx/laptop_fbx.FBX` | 4.64 MiB | 189.732 | 15 | 8 | 3 nomes; até 2.000 px | Notebook útil; 190 mil tri exigem simplificação. |
| office can | `office can_fbx/office can_fbx.FBX` | 0.82 MiB | 31.040 | 2 | 2 | 0 nomes | Objeto pequeno de mesa; não inferir função além do nome sem preview. |
| office computer | `office computer_fbx/office computer_fbx.FBX` | 4.09 MiB | 155.068 | 14 | 7 | 2 nomes; até 2.000 px | Computador/monitor para estação; 14 malhas permitem seleção. |
| office fan | `office fan_fbx/office fan_fbx.FBX` | 3.04 MiB | 145.022 | 7 | 3 | 0 nomes | Ventilador opcional; 145 mil tri para um acessório. |
| office microphone | `office microphone_fbx/office microphone_fbx.FBX` | 0.37 MiB | 12.940 | 3 | 2 | 0 nomes | Melhor prop tecnológico leve relativo ao lote; 3 malhas. |
| office phone2 | `office phone2_fbx/office phone2_fbx.FBX` | 1.53 MiB | 52.976 | 8 | 7 | 5 nomes; até 1.617 px | Telefone de mesa; alternativa com menor geometria que office phone. |
| office phone | `office phone_fbx/office phone_fbx.FBX` | 2.68 MiB | 94.840 | 6 | 6 | 2 nomes; até 3.000 px | Telefone de mesa; OBJ vazio, FBX válido. |
| office_lamps | `office_lamps_fbx/office_lamps_fbx.FBX` | 8.42 MiB | 341.556 | 84 | 14 | 1 nomes; até 600 px | 84 malhas; selecionar uma luminária em vez de usar conjunto todo. |
| office_trashcan | `office_trashcan_fbx/office_trashcan_fbx.FBX` | 0.63 MiB | 20.624 | 2 | 2 | 0 nomes | Lixeira para corredor/café; alternativa à Trash de Kitbash. |
| photocopier | `photocopier_fbx/photocopier_fbx.FBX` | 5.40 MiB | 218.932 | 15 | 14 | 5 nomes; até 4.000 px | Copiadora útil se houver área própria; 14 materiais e 219 mil tri. |
| projector | `projector_fbx/projector_fbx.FBX` | 4.66 MiB | 195.901 | 20 | 8 | 4 nomes; até 900 px | Projetor para reunião; OBJ tem 164.989 tri, diferente do FBX. |
| router | `router_fbx/router_fbx.FBX` | 1.56 MiB | 61.865 | 12 | 8 | 2 nomes; até 683 px | Roteador como decoração tecnológica; 8 materiais para objeto pequeno. |
| speakers | `speakers_fbx/speakers_fbx.FBX` | 1.01 MiB | 37.496 | 9 | 3 | 1 nomes; até 2.500 px | Caixas de som; candidato secundário. |
| water dispenser | `water dispenser_fbx/water dispenser_fbx.FBX` | 2.30 MiB | 98.656 | 12 | 7 | 0 nomes | Bebedouro para pausa/café; não é máquina de café. |

## Fontes BLEND: editabilidade e custo

São cinco fontes válidas e distintas, mais suas cópias; nenhum ARMATURE e nenhuma Action foram encontrados. Materiais ativos são os nomes efetivamente associados a objetos; materiais não utilizados de cena podem aumentar o número de datablocks sem afetar a renderização final.

| Fonte | Objetos / malhas | Triângulos de base | Materiais ativos / datablocks | Imagens FILE / empacotadas | Modificadores armazenados |
| --- | --- | --- | --- | --- | --- |
| `a-simple-workspace-2026-09-01-05-57-01-utc/Home Desk.blend` | 33 / 26 | 420.338 | 8 / 9 | 0 / 0 | BEVEL: 9, NODES: 5, MIRROR: 4, SUBSURF: 2, SOLIDIFY: 1 |
| `computer-desk-with-chair-2026-09-03-04-05-06-utc/Modern Desk.blend` | 37 / 30 | 131.706 | 7 / 8 | 0 / 0 | BEVEL: 23, NODES: 13, SUBSURF: 1, SOLIDIFY: 4, MIRROR: 2 |
| `computer-workstation-2026-09-01-05-57-06-utc/Enjoy Desk.blend` | 39 / 31 | 649.074 | 7 / 8 | 0 / 0 | BEVEL: 25, MIRROR: 5, SOLIDIFY: 2, NODES: 14, ARRAY: 2, SUBSURF: 2, SKIN: 2 |
| `kitbash-city-streets-newspapers-2026-09-01-05-58-02-utc/KB3D_CTS_BldgSM_S.blend` | 4 / 3 | 19.066 | 7 / 8 | 37 / 0 | SUBSURF: 3 |
| `warehouse-loft-2026-09-01-05-58-24-utc/Warehouse Loft/Warehouse Loft Interior.blend` | 8 / 2 | 56.094 | 2 / 3 | 8 / 8 | NODES: 1 |

Modern/Home/Enjoy têm bevel, Geometry Nodes e subdivisão, além de espelhamento/solidify em alguns objetos. Modificadores podem aumentar a geometria ou depender de recursos do Blender que não são exportados como comportamento para Three.js. Em Home/Modern há Subdivision de nível 3. Kitbash tem três Subdivision armazenados, desativados em viewport e render. Warehouse Loft tem apenas um modificador de Geometry Nodes de Auto Smooth.

Os dois modificadores **SKIN** de Enjoy Desk são geradores de geometria; **não são rig/skeleton de personagem**. Não há evidência de cabelo complexo em personagens porque nenhum personagem foi identificado.

Kitbash: 37 imagens 2K estão presentes no pacote, mas o BLEND aponta para `../../../KB3DTextures/4k/...`; as referências não resolvem no local atual. Isso exigirá religar texturas em futura adaptação, sem modificar nada nesta análise. Warehouse Loft: oito mapas 4K estão empacotados no BLEND; os caminhos externos originais não precisam existir para esses mapas empacotados serem disponíveis. Nós de displacement presentes em materiais de Kitbash e shaders de autoria devem ser revistos na futura preparação para realtime.

## Personagens, rigs e animações

**Personagens humanos encontrados: zero identificados.** Assim, masculino/feminino, altura humana, cabelo, figurino, materiais de personagem e potencial como personagem-base não se aplicam. Não há candidato de Developer, Marketing ou Research nesta pasta. A presença de palavras como “interactive”, “animated” ou modificador “Skin” em um arquivo de cenário não caracteriza um personagem animado.

- BLEND: cinco fontes distintas consultadas, **0 objetos ARMATURE e 0 Actions**.
- GLB/GLTF legíveis: **0 skins e 0 animações**; os conjuntos são móveis/cenário.
- FBX legíveis: não foram encontrados Model LimbNode/Root/Effector nem deformadores Skin/Cluster de rig. Muitos exportadores criaram containers `Take 001`/`Take001`; nos FBX 7.x auditados as curvas estão ausentes, têm uma única chave ou valores constantes, inclusive as 36 curvas do Castle com até 1.801 chaves. Esses containers não oferecem walk/idle/work.
- Residence em FBX 6.1 possui um take legado `Take 001` com blocos de chaves, detalhado abaixo; não há rig humano. Industrial Warehouse 6.1 não possui take/chaves identificados.
- Spline `Metadata.txt` declara **Rigging: N**, **Animated: Y**, **Has Textures: Y**; o GLTF efetivamente disponível possui **0 skins, 0 animações e 0 imagens/texturas**. Pode existir interação/animação no projeto Spline nativo que não saiu nessa exportação; sua execução não foi feita e não se presume compatibilidade com o futuro Character System.
- Um FBX Modern Desk é ilegível e oito arquivos de modelo estão vazios; essas versões não permitem afirmar metadados internos, mas os formatos alternativos correspondentes foram examinados quando disponíveis.

### Take legado de Residence

O take `Take 001` refere-se ao objeto `cgcos_fp5_bath-water`: nove canais X/Y/Z de translação, rotação e escala, cada um com uma única chave no tempo zero. É transformação inicial de um objeto do cenário, sem sequência de movimento nem skeleton; não oferece animações walk/idle/work para agentes.

## Seleção por função no escritório

| Uso desejado | Candidatos | Observação |
| --- | --- | --- |
| Estação de trabalho | Modern Desk; peças de Spline; Home/Enjoy como alternativas | Priorizar fonte editável e separar mesa/cadeira/acessórios |
| Mesa | Modern Desk; mesa Spline | Reavaliar dimensões para tampo de 0,75 m; não validar escala apenas pelo nome |
| Cadeira | Cadeira da estação Modern Desk; cadeira de escritório no preview Spline | Conjunto Office Table Chair tem cadeiras externas |
| Monitor/computador | Office Computer; monitores das estações e Spline | Selecionar só os componentes necessários e reduzir detalhes |
| Notebook | Laptop Office Supplies; notebook Spline | Laptop isolado é pesado; Spline combina visualmente melhor |
| Reunião | Mesa/cadeiras extraídas ou montadas a partir das peças escolhidas; projetor | Não há conjunto de reunião corporativa claramente pronto; mesa externa pode servir como referência |
| Café/pausa | Water Dispenser, sofá, lixeira e acessórios | Nenhuma máquina de café isolada foi identificada |
| Sofá | Sofa 005; Futon como alternativa | Azul/dourado de Sofa 005 é mais próximo da direção premium; Futon amarelo exige ajuste visual |
| Poltrona | Poltronas do conjunto Sofa 002 | Aspecto externo/trançado e uma malha unificada reduzem adequação imediata |
| Plantas | Pequena planta Spline; Outdoor Plants 2 somente após grande simplificação | Não usar 1,7 milhão de tri para plantas de fundo |
| Armários/gaveteiros | Gaveteiros visíveis no preview Spline; componentes das estações | Não foi identificado pacote independente de armário corporativo |
| Iluminação | Uma peça de Office Lamps | Evitar importar todas as 84 malhas ou luzes de render junto |
| Decoração tecnológica | Office Microphone, speakers, router, telefones, disco externo | Microfone é o menor custo geométrico entre esses exemplos |
| Decoração geral | Trash de Kitbash, mural/relógio Spline, peças selecionadas de Clutter | Trash: 1.146 tri; Clutter inteiro: 690.387 tri e 29 materiais |

## Performance e problemas de integridade

### Geometria e organização

- Residence: aproximadamente **2,72 milhões de triângulos**, 198 malhas/184 materiais; FBX de cerca de 500 MiB.
- Outdoor Plants 2: **1,71 milhão de triângulos** em quatro malhas. Folhagem geométrica desse porte é inadequada para simples decoração no escritório atual sem futura simplificação.
- Spline: **1,083 milhão de triângulos considerando instâncias**, 892 nós e 33 materiais, apesar de aparência simples; não avaliar seu custo usando somente 351 mil tri da geometria única.
- Apartment: **1,077 milhão de triângulos** e 120 materiais. Enjoy Desk exportado: **1,019 milhão**, excessivo para uma estação.
- Industrial Design Interior: **807 malhas**, mesmo com oito materiais; Castle: **418 malhas**. Muitas peças e materiais podem exigir muitas chamadas de desenho sem futura reorganização.
- Clutter: **690 mil tri**, 188 malhas/29 materiais; Office Lamps: 342 mil tri e 84 malhas. Selecionar objetos antes de qualquer futura otimização.
- Laptop: 190 mil tri; CD rack: 262 mil; copiadora: 219 mil; projetor: 196 mil. São custos altos para pequenos elementos vistos de longe.
- Sofás e mesa externa têm exportações de uma malha/material; são mais simples em número de materiais, mas densos em geometria e mapas. A separação de peças pode demandar edição posterior.

### Imagens

Existem **131 arquivos externos 4.096×4.096 e 64 arquivos externos 8.192×8.192**, incluindo duplicatas. Considerando qualquer lado da imagem, **205 arquivos chegam a 4.096 px ou mais** e **72 chegam a 8.192 px ou mais**; oito dos últimos são panoramas **14.161×1.544**, não mapas quadrados 8K. Esses valores representam arquivos, não texturas distintas carregadas simultaneamente. Castle e Warehouse Loft concentram mapas 4K/8K; para props pequenos em visão isométrica, tais resoluções tendem a exceder a necessidade visual. GLB de sofás e mesa já incorpora mapas 4K, que elevam peso de download e memória mesmo com um só material. Nenhuma textura foi reduzida.

### Arquivos vazios / ilegíveis

| Arquivo vazio (0 bytes) | Impacto |
| --- | --- |
| Clear/cgcos_fp4_kitchenwood1_diff.jpg | Imagem indisponível |
| computer-workstation-2026-09-01-05-57-06-utc/Enjoy Desk.obj | Modelo indisponível nesta versão |
| Interactive Workspace Desk/Assets/interactive_workspace_desk.gltf | Modelo indisponível nesta versão |
| KB3D_CTS_BldgSM_S.blend | Modelo indisponível nesta versão |
| modern-convertible-futon-sofa-bed-3d-model-2026-09-01-06-09-25-utc/FBX.fbx | Modelo indisponível nesta versão |
| modern-industrial-loft-office-with-open-hall-2026-09-01-06-06-06-utc/Extras/Swirls.png | Imagem indisponível |
| modern-residence-floor-plan-with-pool-and-deck-2026-09-01-05-53-07-utc/[OBJ] CGcos_fp5/cgcos_fp5-eames_plywood_diffuse.jpg | Imagem indisponível |
| office-supplies-arrangement-2026-09-01-06-06-02-utc/office phone_obj/office phone_obj.obj | Modelo indisponível nesta versão |
| office-table-chair-2026-09-01-06-08-51-utc/FBX.fbx | Modelo indisponível nesta versão |
| Outdoor_plants_2_obj/Outdoor_plants_2_obj.obj | Modelo indisponível nesta versão |
| realistic-sofa-model-002-2026-09-01-05-58-48-utc/Texture/texture_diff.png | Imagem indisponível |
| realistic-sofa-model-005-2026-09-01-06-08-50-utc/GLB.glb | Modelo indisponível nesta versão |

O arquivo `computer-desk-with-chair-2026-09-03-04-05-06-utc/Modern Desk.fbx` não pôde ser lido: o parser detectou bloco incompleto (esperava 76.543 bytes, encontrou 38.382). É uma **versão potencialmente truncada**, não confirmação de que todo o asset Modern Desk esteja inválido: BLEND, OBJ e FBX da raiz são legíveis. O arquivo `warehouse-loft-2026-09-01-05-58-24-utc/__MACOSX/Warehouse Loft/._Warehouse Loft Interior.blend` é metadado AppleDouble, não modelo Blender.

### Licença e documentação

Não há LICENSE, EULA, certificado, PDF de licença ou README na árvore. A única ficha textual identificada é `interactive-workspace-desk-2026-09-01-06-09-42-utc/Interactive Workspace Desk/Metadata.txt`. Esse conjunto também traz `Tutorial.mp4`. Nomes de pacotes, marcas de equipamentos e datas em nomes de pastas não comprovam direito de uso ou redistribuição. Não há recomendação de enviar os originais ao GitHub. O arquivo `.spp` contém autoria do material do futon, e `.spline` é fonte da cena Spline; nenhum dos dois é um modelo de runtime Three.js.

## Ranking

### MELHORES PERSONAGENS

1. **Nenhum candidato identificado** — não há personagem humano com mesh/rig neste acervo analisado.
2. **Sem segundo candidato** — não atribuir rig de agente a móveis, SKIN procedural ou takes de exportação.
3. **Sem terceiro candidato** — será necessária outra seleção de personagens para avaliar escala, estilo, animação e licença.

### MELHORES ELEMENTOS DE CENÁRIO

1. **Modern Desk — fonte BLEND e peças da estação.** Boa editabilidade, sete materiais ativos e nenhuma imagem externa; separar componentes e reduzir detalhes/modificadores. Usar a fonte BLEND ou versões válidas, não o FBX ilegível do pacote.
2. **Interactive Workspace Desk — peças selecionadas.** Preview estilizado e limpo; cadeira, monitor, notebook, gaveteiros, relógio/mural e pequena planta combinam com o game. O GLTF completo é pesado; aproveitar peças, não importar o ambiente inteiro. Sem BLEND, a edição futura depende da fonte Spline ou de importação do GLTF no Blender.
3. **Office Computer.** Computador para estação com 14 malhas, sete materiais e duas referências externas de imagem; 155.068 tri ainda exigem simplificação, mas a separação ajuda a selecionar componentes.
4. **Sofa 005.** Sofá azul/dourado para lounge; 90.340 tri, um material e três mapas 4K no GLB válido da raiz. Bom visual, mas demanda redução de geometria/texturas. A cópia GLB dentro do pacote é vazia.
5. **Office Microphone.** Decoração tecnológica com 12.940 tri, três malhas, dois materiais e nenhuma referência externa de textura no FBX. Candidato relativamente leve e isolado.

Menção adicional: **Trash de Kitbash** tem somente 1.146 tri e pode ser boa decoração de corredor; requer conferir/religar mapas e adaptar materiais. **Water Dispenser** é útil para pausa/café, mas tem 98.656 tri e sete materiais.

### NÃO RECOMENDADOS

A lista abaixo se refere ao **uso direto do asset completo no Office Game atual**; alguns permitem extração de peças numa etapa futura autorizada.

- **Residence, Apartment e Industrial Warehouse inteiros:** geometrias grandes, muitos materiais e ambientes residenciais/industriais incompatíveis com o objetivo de montar escritório próprio.
- **Castle Library inteiro:** visual medieval, 418 malhas e muitos mapas 4K/8K; o rótulo low-poly não resolve o custo total nem a coerência visual.
- **Industrial Design Interior inteiro:** 807 malhas e cerca de 677 mil tri; importar cena pronta contraria a montagem própria desejada.
- **Outdoor Plants 2 sem adaptação:** 1,71 milhão de tri para vegetação decorativa.
- **Enjoy Desk e Home Desk inteiros sem adaptação:** custo de geometria/modificadores alto; Enjoy exportado supera um milhão de tri.
- **Spline completo, Clutter completo, Office Lamps completo:** muitos nós/objetos e geometria para a função; Spline permanece bom candidato apenas pela seleção de peças.
- **Office Table Chair e Sofa 002 como mobiliário corporativo imediato:** previews mostram mobiliário externo; exports em uma malha tornam a separação menos direta, com mapas 4K e geometria alta.
- **Warehouse Loft inteiro:** apesar de geometria moderada, traz um ambiente pronto e mapas grandes; usar como referência/seleção arquitetônica, não substituir o escritório aprovado.
- **Qualquer versão vazia, FBX Modern Desk ilegível e `._Warehouse Loft Interior.blend`:** indisponível, potencialmente truncada ou apenas metadado. Fontes alternativas válidas estão indicadas neste relatório.

## Inventário de todas as pastas

Quantidades de imagens incluem previews e duplicatas. Pastas acessórias como `pilon`, `stair1`, `stool`, `Clear` e `[FBX] Castlefbx` contêm texturas, não modelos autônomos nessas pastas. A semelhança de nomes indica possível vínculo aos conjuntos arquitetônicos, sem garantir conexão atual de material.

| Pasta | Arquivos | Tamanho | Formatos de autoria/modelo | Imagens externas / resoluções maiores |
| --- | --- | --- | --- | --- |
| `Clear/` | 33 | 10.87 MiB | Sem modelo | 33 arquivos; 1024×576, 1024×1024, 950×560; outras resoluções |
| `Interactive Workspace Desk/` | 1 | 0.00 MiB | GLTF | 0 |
| `Outdoor_plants_2_obj/` | 1 | 0.00 MiB | OBJ | 0 |
| `[FBX] Castlefbx/` | 17 | 27.02 MiB | Sem modelo | 17 arquivos; 8192×8192, 4096×4096, 3423×3270; outras resoluções |
| `a-simple-workspace-2026-09-01-05-57-01-utc/` | 4 | 63.90 MiB | BLEND, FBX, OBJ | 0 |
| `aligned-potted-trees-beside-arched-windows-2026-09-01-06-06-02-utc/` | 22 | 226.73 MiB | FBX, OBJ | 18 arquivos; 1342×1842, 1600×1202, 1000×1447; outras resoluções |
| `computer-desk-with-chair-2026-09-03-04-05-06-utc/` | 4 | 29.73 MiB | BLEND, FBX, OBJ | 0 |
| `computer-workstation-2026-09-01-05-57-06-utc/` | 4 | 72.07 MiB | BLEND, FBX, OBJ | 0 |
| `detailed-apartment-floor-plan-with-balcony-2026-09-01-06-06-05-utc/` | 161 | 185.34 MiB | FBX, OBJ | 158 arquivos; 1500×1500, 1438×1459, 1024×576; outras resoluções |
| `grand-castle-library-interior-low-poly-2026-09-01-06-06-06-utc/` | 271 | 442.31 MiB | FBX, OBJ | 268 arquivos; 8192×8192, 2000×6242, 2000×4144; outras resoluções |
| `interactive-workspace-desk-2026-09-01-06-09-42-utc/` | 5 | 31.04 MiB | GLTF, SPLINE | 1 arquivos; 2038×1358 |
| `kitbash-city-streets-newspapers-2026-09-01-05-58-02-utc/` | 41 | 87.97 MiB | BLEND, FBX, OBJ | 37 arquivos; 2048×2048 |
| `modern-convertible-futon-sofa-bed-3d-model-2026-09-01-06-09-25-utc/` | 12 | 268.74 MiB | FBX, GLB, SPP | 9 arquivos; 4096×4096, 3600×2400 |
| `modern-industrial-loft-office-with-open-hall-2026-09-01-06-06-06-utc/` | 13 | 97.49 MiB | FBX, OBJ | 10 arquivos; 4096×4096, 3000×1795 |
| `modern-residence-floor-plan-with-pool-and-deck-2026-09-01-05-53-07-utc/` | 299 | 823.30 MiB | FBX, OBJ | 296 arquivos; 2048×2048, 1546×1024, 1438×1459; outras resoluções |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/` | 1227 | 608.20 MiB | FBX, OBJ | 849 arquivos; 4000×492, 1266×3075, 3000×2250; outras resoluções |
| `office-table-chair-2026-09-01-06-08-51-utc/` | 8 | 66.89 MiB | FBX, GLB | 6 arquivos; 4096×4096, 3600×2400 |
| `pilon/` | 6 | 2.10 MiB | Sem modelo | 6 arquivos; 2048×2048 |
| `realistic-sofa-model-002-2026-09-01-05-58-48-utc/` | 9 | 27.49 MiB | FBX, GLB | 7 arquivos; 4096×4096, 3600×2400 |
| `realistic-sofa-model-005-2026-09-01-06-08-50-utc/` | 9 | 29.54 MiB | FBX, GLB | 7 arquivos; 4096×4096, 3600×2400 |
| `stair1/` | 6 | 3.48 MiB | Sem modelo | 6 arquivos; 4096×4096 |
| `stool/` | 6 | 1.77 MiB | Sem modelo | 6 arquivos; 2048×2048 |
| `warehouse-interior-with-skylight-and-industrial-el-2026-09-01-05-52-43-utc/` | 51 | 178.12 MiB | FBX | 50 arquivos; 14161×1544, 3504×1309, 3000×2240; outras resoluções |
| `warehouse-loft-2026-09-01-05-58-24-utc/` | 25 | 407.36 MiB | BLEND, FBX, OBJ | 20 arquivos; 8192×8192, 4096×4096 |
| Arquivos soltos na raiz | 16 | 292.63 MiB | BLEND, FBX, GLB, MTL, OBJ, PNG | 1 arquivos; 3600×2400 |

## Extensões encontradas

| Extensão | Arquivos |
| --- | --- |
| .blend | 10 |
| .fbx | 37 |
| .glb | 5 |
| .gltf | 2 |
| .jpeg | 1 |
| .jpg | 1707 |
| .mp4 | 1 |
| .mtl | 356 |
| .obj | 32 |
| .png | 89 |
| .spline | 1 |
| .spp | 1 |
| .tga | 8 |
| .txt | 1 |

## Anexo: todos os 86 arquivos de modelo

Caminhos relativos à raiz de assets informada no início. BLEND mostra triângulos de base e materiais ativos; FBX/OBJ/GLB/GLTF mostram geometria armazenada/exportada. “Texturas” no FBX/OBJ conta referências distintas por nome; no GLB/GLTF conta imagens declaradas; no BLEND conta imagens FILE. Não inclui necessariamente imagens extras do pacote. Para GLTF Spline, a tabela mostra geometria única; o total instanciado está destacado no inventário principal.

| Caminho | Formato | Disco | Triângulos | Materiais | Texturas | Leitura |
| --- | --- | --- | --- | --- | --- | --- |
| `a-simple-workspace-2026-09-01-05-57-01-utc/Home Desk.blend` | .BLEND | 32.11 MiB | 420.338 | 8 | 0 | Legível |
| `a-simple-workspace-2026-09-01-05-57-01-utc/Home Desk.fbx` | .FBX | 11.35 MiB | 476.204 | 8 | 0 | Legível |
| `a-simple-workspace-2026-09-01-05-57-01-utc/Home Desk.obj` | .OBJ | 20.44 MiB | 222.538 | 6 | 0 | Legível |
| `aligned-potted-trees-beside-arched-windows-2026-09-01-06-06-02-utc/Outdoor_plants_2_obj/Outdoor_plants_2_obj.obj` | .OBJ | 159.82 MiB | 1.714.590 | 8 | 9 | Legível |
| `aligned-potted-trees-beside-arched-windows-2026-09-01-06-06-02-utc/Outdoor_plants_2_scanline_fbx/Outdoor_plants_2_scanline_fbx.FBX` | .FBX | 56.01 MiB | 1.714.590 | 9 | 9 | Legível |
| `computer-desk-with-chair-2026-09-03-04-05-06-utc/Modern Desk.blend` | .BLEND | 10.83 MiB | 131.706 | 7 | 0 | Legível |
| `computer-desk-with-chair-2026-09-03-04-05-06-utc/Modern Desk.fbx` | .FBX | 0.06 MiB | — | — | — | OSError('failed to read complete nested block, expected 76543 bytes, but only got 38382') |
| `computer-desk-with-chair-2026-09-03-04-05-06-utc/Modern Desk.obj` | .OBJ | 18.83 MiB | 274.914 | 7 | 0 | Legível |
| `computer-workstation-2026-09-01-05-57-06-utc/Enjoy Desk.blend` | .BLEND | 49.01 MiB | 649.074 | 7 | 0 | Legível |
| `computer-workstation-2026-09-01-05-57-06-utc/Enjoy Desk.fbx` | .FBX | 23.05 MiB | 1.018.984 | 7 | 0 | Legível |
| `computer-workstation-2026-09-01-05-57-06-utc/Enjoy Desk.obj` | .OBJ | 0.00 MiB | — | — | — | empty file |
| `detailed-apartment-floor-plan-with-balcony-2026-09-01-06-06-05-utc/[FBX] CGcos_fp4/CGcos_fp4.FBX` | .FBX | 34.97 MiB | 1.077.492 | 120 | 49 | Legível |
| `detailed-apartment-floor-plan-with-balcony-2026-09-01-06-06-05-utc/[OBJ] CGcos_fp4/CGcos_fp4.obj` | .OBJ | 81.55 MiB | 1.077.492 | 116 | 51 | Legível |
| `Enjoy Desk.blend` | .BLEND | 49.01 MiB | 649.074 | 7 | 0 | Legível |
| `Enjoy Desk.fbx` | .FBX | 23.05 MiB | 1.018.984 | 7 | 0 | Legível |
| `Enjoy Desk.obj` | .OBJ | 76.15 MiB | 1.018.984 | 7 | 0 | Legível |
| `FBX.fbx` | .FBX | 2.10 MiB | 90.340 | 1 | 0 | Legível |
| `GLB.glb` | .GLB | 25.46 MiB | 90.340 | 1 | 3 | Legível |
| `grand-castle-library-interior-low-poly-2026-09-01-06-06-06-utc/[FBX] Castlefbx/Castlefbx.FBX` | .FBX | 5.69 MiB | 91.210 | 38 | 140 | Legível |
| `grand-castle-library-interior-low-poly-2026-09-01-06-06-06-utc/[OBJ] Castleobj/Castleobj.obj` | .OBJ | 6.89 MiB | 91.210 | 27 | 0 | Legível |
| `Home Desk.blend` | .BLEND | 32.11 MiB | 420.338 | 8 | 0 | Legível |
| `Home Desk.fbx` | .FBX | 11.35 MiB | 476.204 | 8 | 0 | Legível |
| `Home Desk.obj` | .OBJ | 35.07 MiB | 476.204 | 8 | 0 | Legível |
| `Interactive Workspace Desk/Assets/interactive_workspace_desk.gltf` | .GLTF | 0.00 MiB | — | — | — | empty file |
| `interactive-workspace-desk-2026-09-01-06-09-42-utc/Interactive Workspace Desk/Assets/interactive_workspace_desk.gltf` | .GLTF | 16.08 MiB | 351.558 | 33 | 0 | Legível |
| `KB3D_CTS_BldgSM_S.blend` | .BLEND | 0.00 MiB | — | — | — | empty file |
| `kitbash-city-streets-newspapers-2026-09-01-05-58-02-utc/KB3D_CTS_BldgSM_S.blend` | .BLEND | 2.68 MiB | 19.066 | 7 | 37 | Legível |
| `kitbash-city-streets-newspapers-2026-09-01-05-58-02-utc/KB3D_CTS_BldgSM_S.fbx` | .FBX | 0.71 MiB | 19.066 | 7 | 25 | Legível |
| `kitbash-city-streets-newspapers-2026-09-01-05-58-02-utc/KB3D_CTS_BldgSM_S.obj` | .OBJ | 1.26 MiB | 19.066 | 7 | 25 | Legível |
| `Modern Desk.blend` | .BLEND | 10.83 MiB | 131.706 | 7 | 0 | Legível |
| `Modern Desk.fbx` | .FBX | 6.64 MiB | 274.914 | 7 | 0 | Legível |
| `Modern Desk.obj` | .OBJ | 18.83 MiB | 274.914 | 7 | 0 | Legível |
| `modern-convertible-futon-sofa-bed-3d-model-2026-09-01-06-09-25-utc/FBX.fbx` | .FBX | 0.00 MiB | — | — | — | empty file |
| `modern-convertible-futon-sofa-bed-3d-model-2026-09-01-06-09-25-utc/GLB/ASSET.glb` | .GLB | 20.52 MiB | 124.704 | 1 | 4 | Legível |
| `modern-industrial-loft-office-with-open-hall-2026-09-01-06-06-06-utc/[FBX] Industrial Design Interior_fbx/Industrial Design Interior_fbx.FBX` | .FBX | 15.80 MiB | 677.160 | 8 | 4 | Legível |
| `modern-industrial-loft-office-with-open-hall-2026-09-01-06-06-06-utc/[OBJ] Industrial Design Interior_obj/Industrial Design Interior_obj.obj` | .OBJ | 39.81 MiB | 675.624 | 8 | 4 | Legível |
| `modern-residence-floor-plan-with-pool-and-deck-2026-09-01-05-53-07-utc/[FBX] CGcos_fp5/CGcos_fp5.FBX` | .FBX | 500.09 MiB | 2.718.374 | 184 | 89 | Legível |
| `modern-residence-floor-plan-with-pool-and-deck-2026-09-01-05-53-07-utc/[OBJ] CGcos_fp5/CGcos_fp5.obj` | .OBJ | 205.72 MiB | 2.718.368 | 170 | 92 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/cd rack_fbx/cd rack_fbx.FBX` | .FBX | 7.33 MiB | 261.616 | 8 | 4 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/cd rack_obj/cd rack_obj.obj` | .OBJ | 12.25 MiB | 261.608 | 8 | 4 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/clutter_fbx/clutter_fbx.FBX` | .FBX | 18.15 MiB | 690.387 | 29 | 12 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/clutter_obj/clutter_obj.obj` | .OBJ | 30.61 MiB | 690.387 | 29 | 11 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/epson printer_fbx/epson printer_fbx.FBX` | .FBX | 1.91 MiB | 71.682 | 5 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/epson printer_obj/epson printer_obj.obj` | .OBJ | 2.88 MiB | 71.682 | 5 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/external hard disk_fbx/external hard disk_fbx.FBX` | .FBX | 1.36 MiB | 49.794 | 5 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/external hard disk_obj/external hard disk_obj.obj` | .OBJ | 2.47 MiB | 49.794 | 5 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/laptop_fbx/laptop_fbx.FBX` | .FBX | 4.64 MiB | 189.732 | 8 | 3 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/laptop_obj/laptop_obj.obj` | .OBJ | 8.26 MiB | 189.732 | 8 | 3 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office can_fbx/office can_fbx.FBX` | .FBX | 0.82 MiB | 31.040 | 2 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office can_obj/office can_obj.obj` | .OBJ | 1.48 MiB | 31.040 | 2 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office computer_fbx/office computer_fbx.FBX` | .FBX | 4.09 MiB | 155.068 | 7 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office computer_obj/office computer_obj.obj` | .OBJ | 7.21 MiB | 155.032 | 7 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office fan_fbx/office fan_fbx.FBX` | .FBX | 3.04 MiB | 145.022 | 3 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office fan_obj/office fan_obj.obj` | .OBJ | 4.38 MiB | 145.022 | 3 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office microphone_fbx/office microphone_fbx.FBX` | .FBX | 0.37 MiB | 12.940 | 2 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office microphone_obj/office microphone_obj.obj` | .OBJ | 0.47 MiB | 12.940 | 2 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office phone2_fbx/office phone2_fbx.FBX` | .FBX | 1.53 MiB | 52.976 | 7 | 5 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office phone2_obj/office phone2_obj.obj` | .OBJ | 2.31 MiB | 52.976 | 7 | 5 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office phone_fbx/office phone_fbx.FBX` | .FBX | 2.68 MiB | 94.840 | 6 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office phone_obj/office phone_obj.obj` | .OBJ | 0.00 MiB | — | — | — | empty file |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office_lamps_fbx/office_lamps_fbx.FBX` | .FBX | 8.42 MiB | 341.556 | 14 | 1 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office_lamps_obj/office_lamps_obj.obj` | .OBJ | 14.04 MiB | 341.548 | 12 | 1 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office_trashcan_fbx/office_trashcan_fbx.FBX` | .FBX | 0.63 MiB | 20.624 | 2 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/office_trashcan_obj/office_trashcan_obj.obj` | .OBJ | 0.88 MiB | 20.624 | 2 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/photocopier_fbx/photocopier_fbx.FBX` | .FBX | 5.40 MiB | 218.932 | 14 | 5 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/photocopier_obj/photocopier_obj.obj` | .OBJ | 9.82 MiB | 218.932 | 9 | 4 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/projector_fbx/projector_fbx.FBX` | .FBX | 4.66 MiB | 195.901 | 8 | 4 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/projector_obj/projector_obj.obj` | .OBJ | 6.72 MiB | 164.989 | 8 | 4 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/router_fbx/router_fbx.FBX` | .FBX | 1.56 MiB | 61.865 | 8 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/router_obj/router_obj.obj` | .OBJ | 2.71 MiB | 61.865 | 8 | 2 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/speakers_fbx/speakers_fbx.FBX` | .FBX | 1.01 MiB | 37.496 | 3 | 1 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/speakers_obj/speakers_obj.obj` | .OBJ | 1.56 MiB | 37.496 | 3 | 1 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/water dispenser_fbx/water dispenser_fbx.FBX` | .FBX | 2.30 MiB | 98.656 | 7 | 0 | Legível |
| `office-supplies-arrangement-2026-09-01-06-06-02-utc/water dispenser_obj/water dispenser_obj.obj` | .OBJ | 3.99 MiB | 98.656 | 7 | 0 | Legível |
| `office-table-chair-2026-09-01-06-08-51-utc/FBX.fbx` | .FBX | 0.00 MiB | — | — | — | empty file |
| `office-table-chair-2026-09-01-06-08-51-utc/GLB.glb` | .GLB | 34.16 MiB | 199.999 | 1 | 3 | Legível |
| `Outdoor_plants_2_obj/Outdoor_plants_2_obj.obj` | .OBJ | 0.00 MiB | — | — | — | empty file |
| `realistic-sofa-model-002-2026-09-01-05-58-48-utc/FBX.fbx` | .FBX | 5.06 MiB | 187.358 | 1 | 0 | Legível |
| `realistic-sofa-model-002-2026-09-01-05-58-48-utc/GLB.glb` | .GLB | 13.40 MiB | 187.358 | 1 | 3 | Legível |
| `realistic-sofa-model-005-2026-09-01-06-08-50-utc/FBX.fbx` | .FBX | 2.10 MiB | 90.340 | 1 | 0 | Legível |
| `realistic-sofa-model-005-2026-09-01-06-08-50-utc/GLB.glb` | .GLB | 0.00 MiB | — | — | — | empty file |
| `warehouse-interior-with-skylight-and-industrial-el-2026-09-01-05-52-43-utc/[FBX] industrial_warehouse_3/industrial_warehouse_3.FBX` | .FBX | 83.36 MiB | 531.026 | 53 | 24 | Legível |
| `warehouse-loft-2026-09-01-05-58-24-utc/__MACOSX/Warehouse Loft/._Warehouse Loft Interior.blend` | .BLEND | 0.00 MiB | — | — | — | AppleDouble metadata, not a model |
| `warehouse-loft-2026-09-01-05-58-24-utc/Warehouse Loft/Warehouse Loft Interior.blend` | .BLEND | 69.70 MiB | 56.094 | 2 | 8 | Legível |
| `warehouse-loft-2026-09-01-05-58-24-utc/Warehouse Loft/Warehouse Loft Interior.fbx` | .FBX | 1.53 MiB | 56.094 | 2 | 8 | Legível |
| `warehouse-loft-2026-09-01-05-58-24-utc/Warehouse Loft/Warehouse Loft Interior.obj` | .OBJ | 3.50 MiB | 56.094 | 2 | 8 | Legível |

## Complementos encontrados no Envato

Consulta complementar autorizada pelo usuário durante esta análise. **Nenhum destes candidatos foi baixado ou somado ao inventário local.** As fichas e previews foram consultados na sessão aberta/logada do Envato; números abaixo são **polígonos anunciados pelo fornecedor**, não triângulos medidos em arquivos baixados. Rig anunciado também não confirma que o esqueleto esteja completo ou exportável até consultar a fonte. Não houve teste de runtime, exportação ou alteração do Office Game.

| Prioridade / candidato | Fonte | Formatos anunciados / pacote | Geometria anunciada | Avaliação |
| --- | --- | --- | --- | --- |
| Alta — Potted plant indoor decoration, RakataStudio | [Envato](https://elements.envato.com/potted-plant-indoor-decoration-X7893AV) | BLEND, FBX, OBJ; 6,14 MB; sem texturas | 3 mil polígonos | Folhas verdes simples em vaso; melhor complemento imediato para análise futura, com custo anunciado muito inferior ao Outdoor Plants local. Conferir modificadores, materiais e triângulos após download. |
| Alta — Modern white office desk and computer, Krafted | [Envato](https://elements.envato.com/modern-white-office-desk-and-computer-V8JL7FN) | BLEND; 4,9 MB; sem texturas | 11 mil polígonos | Mesa branca com gaveteiro, monitor, teclado, mouse e pequena planta. Bom candidato para extrair monitor/gavetas/acessórios ou uma mesa, mantendo nosso ambiente próprio. Preview com proporções estilizadas exige conferir escala. |
| Média — Coffee Machine 3D Icon, batasacraft | [Envato](https://elements.envato.com/coffee-machine-3d-icon-ARYJPK4) | FBX, OBJ, PNG; 6,34 MB; sem texturas declaradas | 69,3 mil polígonos | Máquina de café isolada complementa uma lacuna local. Estilo limpo, mas geometria ainda alta para prop pequeno; revisar/simplificar futuramente. PNG é render/previsualização, não substitui geometria. |
| Condicional — Clay man character, RakataStudio | [Envato](https://elements.envato.com/clay-man-character-M4YMWZV) | BLEND; 9,67 MB; sem texturas; Rigged: Yes; Animated: No | 10,7 mil polígonos | Corpo completo com cabeça, tronco, braços e pernas visualmente separados/flutuantes; aparência azul/amarelo/vermelho muito cartunesca. Pode servir a estudo técnico de rig, mas não é recomendação de personagem oficial aprovado. Não possui animações anunciadas. |

Ordem recomendada para novos downloads de cenário: **planta → estação compacta → cafeteira**. Para Character System, procurar corpo completo com membros conectados, rig humano compatível e clips idle/walk/work; evitar bustos de avatar, poses de ilustração sem skeleton e conjuntos de personagem+escritório extremamente densos. O Clay Man é um candidato de teste, não resolve sozinho a linguagem visual final nem animações.

As páginas consultadas anunciaram licença comercial e botões de download, mas os candidatos não foram baixados nesta etapa. Guardar os certificados/registro de uso do projeto Office Game junto da aquisição original. A tela inicial da conta mostrou aviso de pagamento da assinatura pendente; não houve intervenção em cobrança ou conta.

## Git e preservação dos originais

A pasta **não estava ignorada** no início; aparecia como conteúdo não rastreado. Foi adicionado exclusivamente o padrão `/ELEMENTOS 3D/` ao `.gitignore`, conforme autorização desta etapa. Não há arquivos dessa pasta já rastreados pelo Git. O bloqueio é para a pasta de originais; nenhuma importação para `src`/`public` foi feita.

Após a leitura de metadados, os **2.251 arquivos originais** foram novamente verificados: **nenhum SHA-256, tamanho ou data de modificação mudou**, e nenhum arquivo foi acrescentado ou removido dentro da pasta. Scripts e resultados auxiliares de auditoria ficaram em diretório temporário fora do projeto. A única documentação criada no projeto é este relatório. Não houve alteração de funcionalidades, otimização, conversão, salvamento de assets, commit ou push.

## Complemento autorizado — manequim BlenderKit no Blender

Consulta e inclusão posteriores ao inventário original, em **07/10/2026**, autorizadas pelo usuário com o Blender aberto. Foi baixado pelo addon BlenderKit o [Rigged Human Mannequin Man (Rigify), de Fasolka3D](https://www.blendkit.com/asset-gallery-detail/7a5aeacf-d088-423e-916c-f9bbdfdb9306/). O modelo foi colocado na cena separada `OfficeGame_Character_Review`; a cena original `Scene`, com Cube, Camera e Light, foi preservada, incluindo objetos e matrizes. O arquivo aberto originalmente era não salvo e permaneceu assim: não foi salvo por cima nem substituído.

| Item verificado no arquivo importado | Resultado |
| --- | --- |
| Aparência | Manequim humano masculino estilizado, branco com articulações laranja, sem rosto, cabelo ou roupas; pose de referência com braços abertos |
| Altura em escala métrica | Aproximadamente **1,806 m**, adequada à referência humana do escritório |
| Malha de base | **1.522 vértices, 1.387 polígonos e 2.757 triângulos**, antes dos modificadores |
| Geometria avaliada no viewport | **22.124 triângulos**, com Mirror, Armature e Subdivision nível 1 ativos |
| Materiais / texturas | **2 materiais**, nenhuma textura de imagem no modelo importado |
| Rig | **400 ossos**, dos quais **69 deformadores**; 69 grupos de vértices, todos os 1.522 vértices com pesos; 109 drivers |
| Animações | **Nenhum clip utilizável identificado**: a única Action tem intervalo 0–0, zero curvas e zero keyframes; zero trilhas NLA. O metadado `animated: true` do catálogo não comprova animações prontas |
| Controles auxiliares | 130 objetos de formas dos controles Rigify, em coleção excluída do view layer; não equivalem a 130 peças visíveis do corpo |
| Modificadores | Mirror, Armature e Subdivision; nível de renderização 2 aumenta o custo em relação ao viewport. Nada foi aplicado, removido ou otimizado |
| Formato | Fonte BLEND; nenhuma conversão para FBX/GLB/GLTF nesta etapa |

**Recomendação:** bom candidato para estudar escala, rig humano e futura adaptação no Blender. Ainda exige linguagem visual própria, animações idle/walk/work e avaliação de exportação/performance antes de integrar ao Character System. A existência de ossos e pesos foi verificada; retargeting, movimento dos controles, exportação e runtime no navegador não foram testados. Não representa um personagem oficial aprovado.

A ficha do addon informa asset gratuito com licença `royalty_free`. Consultar os [termos BlenderKit](https://www.blendkit.com/docs/licenses/) na aquisição; gratuito não significa domínio público ou autorização para redistribuir o arquivo-fonte.

Foi gravada uma **nova cópia de análise**, sem sobrescrever a fonte baixada:

- `C:\PROJETOS_CODEX\office-game\ELEMENTOS 3D\BlenderKit\Mannequin_Review.blend` — **396.704 bytes**, contendo somente a cena `OfficeGame_Character_Review` e suas dependências; a cena original não está nessa cópia. A listagem de cenas do arquivo salvo foi conferida sem importá-lo novamente.
- `C:\PROJETOS_CODEX\office-game\ELEMENTOS 3D\BlenderKit\Mannequin_Review_Audit.json` — metadados técnicos medidos no Blender.

O modelo ficou enquadrado no Blender, com visualização de materiais e controles ocultos apenas pelo overlay do viewport. A cópia não inclui layout de interface: ao abri-la depois, pode ser necessário enquadrar o personagem. Os dois novos arquivos são ignorados por `/ELEMENTOS 3D/`, confirmado com `git check-ignore`. Não houve alteração do Office Game, importação para `src`/`public`, commit ou push.

## Retomada de 08/10/2026 — candidatos para personagens

O usuário reafirmou o objetivo de um **escritório virtual temático e gamificado para organizar os trabalhos da empresa, com vários agentes e também pessoas**. A escolha dos personagens deve favorecer identificação, papéis e leitura das atividades no ambiente existente. Isso orienta a pesquisa; não autoriza antecipar backend, IA, multiplayer ou a integração dos personagens finais nesta etapa.

Foram consultadas páginas oficiais e previews de personagens. As quantidades abaixo são anunciadas pelos autores, **não medidas em arquivos baixados**. Nenhum novo pacote foi baixado, convertido ou importado nesta retomada. Os clips idle/walk e sua compatibilidade com Three.js ainda precisam de validação técnica.

| Prioridade | Candidato e fonte oficial | Evidência do catálogo | Avaliação para Office Game |
| --- | --- | --- | --- |
| 1 — primeiro teste visual | [Animated Men](https://quaternius.com/packs/animatedmen.html) + [Animated Women](https://quaternius.com/packs/animatedwomen.html), Quaternius | Cada pacote anuncia 4 humanos com várias animações, formatos FBX/OBJ/BLEND e licença CC0. Os previews mostram roupas casuais; o masculino inclui terno. | Minha preferência para uma avaliação inicial: corpos humanos completos, aparência simples e variedade de roupa/cabelo. Comparar pelo menos um masculino e um feminino com a câmera do escritório. Os nomes dos clips, triângulos, pesos e eventual compartilhamento de rig entre os dois pacotes não foram confirmados. |
| 2 — variedade por combinação | [Ultimate Modular Men](https://quaternius.com/packs/ultimatemodularcharacters.html), Quaternius | Anuncia 11 personagens, 24 animações e quatro partes intercambiáveis por personagem; descrição lista FBX/OBJ/glTF/BLEND, cabeçalho lista apenas FBX/OBJ/BLEND. CC0. Preview inclui terno e roupa casual, além de trajes temáticos. | Interessante para compor variações futuras sem escolher três bases incompatíveis. Selecionar as roupas de escritório; verificar seams, número de meshes e desempenho. A pasta pública do autor foi consultada; a subpasta Individual Characters apareceu vazia nessa sessão, então a disponibilidade dos arquivos individuais precisa ser conferida antes do teste. Não foi verificada a distribuição alternativa All together. |
| 3 — base para personalização maior | [Universal Base Characters](https://quaternius.itch.io/universal-base-characters), Quaternius | Kit completo anuncia 6 bases e 20 cabelos; média de 13 mil triângulos, rig humano e compatibilidade com a Universal Animation Library. CC0. Preview Standard gratuito mostra 2 bases e 5 cabelos; Standard ZIP anunciado com 122 MB. Source ZIP com 600 MB exige pagamento anunciado de US$ 19,99 e contém fontes BLEND do kit completo. | Melhor como base de produção personalizada, mas os previews mostram corpos em roupa íntima: será necessário criar roupas de escritório. Compatibilidade com biblioteca não significa que o download já inclua idle/walk. Não é o caminho mais curto para testar um personagem vestido no escritório. |

A [Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html) anuncia 120+ animações, incluindo locomoção e sentar, com licença CC0. É uma biblioteca separada e possui versões diferentes; conferir o conteúdo efetivo da distribuição escolhida. Nenhuma animação específica de digitação foi confirmada.

**Critérios para a próxima análise de arquivos:** corpo completo com rig e pesos; clips reais idle e walk; opção de caminhada no lugar para reutilizar nossos waypoints; escala aproximada de 1,75 m; roupa adequada ao escritório; rosto/cabelo legíveis na câmera ortográfica; materiais e texturas moderados; facilidade de variar aparência e reaproveitar animações; fonte editável e licença incluída no pacote. Um mesmo rig para vários personagens é uma preferência técnica, não uma compatibilidade já comprovada entre esses candidatos.

**Próximo passo recomendado:** obter e consultar somente um candidato de Animated Men e um de Animated Women em uma cena separada de revisão no Blender, conferir clips e geometria e comparar os previews com o ambiente aprovado. A aprovação visual e a validação dos arquivos antecedem a integração ao Character System. O manequim BlenderKit permanece como referência técnica. Nenhuma funcionalidade do projeto foi alterada nesta pesquisa, e não houve commit ou push.
