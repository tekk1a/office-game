import type { CSSProperties } from 'react'
import type { AgentId, AgentStatus } from '../agents/agentTypes'

// All color/material decisions live here. Geometry and behavior remain separate.
export const officeTheme = {
  ui: {
    background: '#080e17', surface: '#0e1724', raised: '#172436', panel: '#0e1928f5',
    text: '#e9f0f8', muted: '#a1b0c3', subtle: '#74869d', border: '#27374c',
    borderSoft: '#ffffff0b', borderBright: '#45657f', accent: '#71bfe9', accentStrong: '#49bcdc',
    accentBg: '#122d43', hover: '#1c3c53', soft: '#ffffff05', glass: '#0c1725ec',
    errorBg: '#ad5b6815', errorBorder: '#d9858b40', shadow: '#02060c70', clear: '#00000000',
  },
  status: {
    working: '#64d1ed', idle: '#acb6c5', walking: '#9ccdfa', thinking: '#b3abdc',
    meeting: '#b6a2ed', finished: '#82cca0', error: '#ef929a',
  } satisfies Record<AgentStatus, string>,
  statusLabels: {
    working: 'Working', idle: 'Idle', walking: 'Walking', thinking: 'Thinking',
    meeting: 'Meeting', finished: 'Finished', error: 'Error',
  } satisfies Record<AgentStatus, string>,
  scene: {
    background: '#111f2f', floorBase: '#122031', floor: '#34414e',
    floorPanels: ['#3e4b58', '#3b4854', '#404c58'], wall: '#303d4b', wallSide: '#293644',
    wallPanel: '#253241', wallTrim: '#445469', wood: '#946f4b', woodEdge: '#6e513b',
    metal: '#273645', metalEdge: '#405064', black: '#16232e', upholstery: '#3b5062',
    rug: '#273947', meetingRug: '#303849', loungeRug: '#35404b',
    cyan: '#55b4cf', screen: '#162d40', screenAccent: '#58c7e2', screenSoft: '#718fa6',
    paper: '#c6c7c1', ceramic: '#8f9eab', coffee: '#4d382e',
    foliage: '#427767', foliageLight: '#658f75', soil: '#3c3430', trunk: '#607367',
    pot: '#495665', potLight: '#7f827a', art: '#557b90', warm: '#d9a065',
    selected: '#72daee', selectionInner: '#c7edf5', pants: '#536378', shoes: '#243445', eyes: '#29343e',
  },
  agents: {
    developer: { shirt: '#5d9fcc', skin: '#deb797', hair: '#394957' },
    marketing: { shirt: '#b298ca', skin: '#e6bea0', hair: '#624849' },
    research: { shirt: '#71a98a', skin: '#cba17d', hair: '#454e43' },
  } satisfies Record<AgentId, { shirt: string; skin: string; hair: string }>,
  materials: {
    metal: { roughness: 0.55, metalness: 0.35 }, wood: { roughness: 0.72, metalness: 0 },
    upholstery: { roughness: 0.95, metalness: 0 }, floor: { roughness: 0.9, metalness: 0.03 },
    screen: { roughness: 0.45, emissiveIntensity: 0.35 },
    character: { roughness: 1 }, ceramic: { roughness: 0.6 },
  },
  lighting: {
    ambient: 0.5, sky: '#d6e9ff', ground: '#586574', hemisphere: 1.65,
    key: '#e7f0ff', keyIntensity: 3, fill: '#9fc4ed', fillIntensity: 0.8,
    warm: '#f4bc80', warmIntensity: 3, shadowMap: 2048, shadowRadius: 4,
  },
  camera: { fitWidth: 17.8, fitHeight: 13.2, desktopOffset: 0.085, offsetBreakpoint: 900 },
  sizes: { panelWidth: 288, panelRadius: 12, floorPanel: 1.5, labelHeight: 2.08 },
}

export const officeCssVariables = {
  ...Object.fromEntries(Object.entries(officeTheme.ui).map(([name, value]) => [`--ui-${name}`, value])),
  ...Object.fromEntries(Object.entries(officeTheme.status).map(([name, value]) => [`--status-${name}`, value])),
  '--scene-background': officeTheme.scene.background,
  '--panel-width': `${officeTheme.sizes.panelWidth}px`,
  '--panel-radius': `${officeTheme.sizes.panelRadius}px`,
} as CSSProperties
