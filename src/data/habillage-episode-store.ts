import { SONS_PREROLL, SONS_POSTROLL } from './regles-store'

export { SONS_PREROLL, SONS_POSTROLL }

export interface HabillageEpisode {
  preroll: string
  postroll: string
  interne: boolean
  externe: boolean
  isPersonnalise: boolean
}

const DEFAULT: HabillageEpisode = {
  preroll: SONS_PREROLL[0],
  postroll: SONS_POSTROLL[0],
  interne: true,
  externe: true,
  isPersonnalise: false,
}

const store: Record<string, HabillageEpisode> = {}
const listeners: Set<() => void> = new Set()

export function getHabillageEpisode(episodeTitre: string): HabillageEpisode {
  if (!store[episodeTitre]) store[episodeTitre] = { ...DEFAULT }
  return store[episodeTitre]
}

export function setHabillageEpisode(episodeTitre: string, h: HabillageEpisode) {
  store[episodeTitre] = { ...h, isPersonnalise: true }
  listeners.forEach(fn => fn())
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
