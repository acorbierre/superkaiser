// ── Types ──────────────────────────────────────────────────────────────────────

export type ModeTemporalite = 'tous' | 'alternance' | 'parjour'

export type JourSemaine = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche'

export interface RollConfig {
  preroll: string   // '' = aucun habillage
  postroll: string  // '' = aucun habillage
}

export interface Regle {
  id: number
  dateDebut: string
  dateFin: string
  appliedDateDebut: string
  appliedDateFin: string
  nbEpisodes: number
  modeTemporalite: ModeTemporalite
  interne: boolean
  externe: boolean
  // tous
  config: RollConfig
  // alternance
  configPaire?: RollConfig
  configImpaire?: RollConfig
  // parjour
  joursActifs?: JourSemaine[]
  configJours?: Record<JourSemaine, RollConfig>
}

// ── Sons mock ──────────────────────────────────────────────────────────────────

export const SONS_PREROLL = [
  'Xavier Mauduit - Intro Promo (7s)',
  'Voix féminine - Intro (7s)',
  'Générique court (4s)',
]

export const SONS_POSTROLL = [
  'Écoute série complète (11s)',
  'Abonnez-vous (8s)',
  'Intro musique (10s)',
]

// ── Constantes ─────────────────────────────────────────────────────────────────

export const JOURS: JourSemaine[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

export const JOURS_LABELS: Record<JourSemaine, string> = {
  lundi:    'Lundi',
  mardi:    'Mardi',
  mercredi: 'Mercredi',
  jeudi:    'Jeudi',
  vendredi: 'Vendredi',
  samedi:   'Samedi',
  dimanche: 'Dimanche',
}

export const MODE_LABELS: Record<ModeTemporalite, string> = {
  tous:       'Tous les jours',
  alternance: 'Alternance 1 semaine sur 2',
  parjour:    'Personnalisée',
}

export const JOURS_SEMAINE: JourSemaine[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
export const JOURS_WEEKEND: JourSemaine[] = ['samedi', 'dimanche']

export const JOURS_COURTS: Record<JourSemaine, string> = {
  lundi: 'Lu', mardi: 'Ma', mercredi: 'Me', jeudi: 'Je',
  vendredi: 'Ve', samedi: 'Sa', dimanche: 'Di',
}

export const EMPTY_CONFIG: RollConfig = { preroll: '', postroll: '' }

export function defaultConfigJours(): Record<JourSemaine, RollConfig> {
  return Object.fromEntries(JOURS.map(j => [j, { preroll: '', postroll: '' }])) as Record<JourSemaine, RollConfig>
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

export function formatDateFr(iso: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)} ${MOIS[parseInt(m) - 1]} ${y}`
}

export function mockEpisodeCount(debut: string, fin: string): number {
  if (!debut || !fin) return 0
  const d1 = new Date(debut)
  const d2 = new Date(fin)
  if (d2 < d1) return 0
  return Math.max(1, Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24 * 7)))
}

// ── Mock ───────────────────────────────────────────────────────────────────────

const REGLES_INIT: Regle[] = [
  {
    id: 2,
    dateDebut: '2026-07-01', dateFin: '2026-07-31',
    appliedDateDebut: '2026-07-01', appliedDateFin: '2026-07-31',
    nbEpisodes: 3,
    modeTemporalite: 'tous',
    interne: true,
    externe: true,
    config: { preroll: SONS_PREROLL[0], postroll: SONS_POSTROLL[0] },
  },
  {
    id: 1,
    dateDebut: '2026-06-01', dateFin: '2026-06-30',
    appliedDateDebut: '2026-06-01', appliedDateFin: '2026-06-30',
    nbEpisodes: 4,
    modeTemporalite: 'alternance',
    interne: true,
    externe: false,
    config: EMPTY_CONFIG,
    configPaire:   { preroll: SONS_PREROLL[0], postroll: '' },
    configImpaire: { preroll: SONS_PREROLL[1], postroll: '' },
  },
]

// ── Store module-level ─────────────────────────────────────────────────────────

const store: Record<string, Regle[]> = {}
const listeners: Set<() => void> = new Set()

function getKey(emissionTitre: string) {
  return emissionTitre || '_default'
}

export function getRegles(emissionTitre: string): Regle[] {
  const key = getKey(emissionTitre)
  if (!store[key]) store[key] = REGLES_INIT.map(r => ({ ...r }))
  return store[key]
}

export function setRegles(emissionTitre: string, regles: Regle[]) {
  store[getKey(emissionTitre)] = regles
  listeners.forEach(fn => fn())
}

export function addRegle(emissionTitre: string, regle: Regle) {
  setRegles(emissionTitre, [regle, ...getRegles(emissionTitre)])
}

export function updateRegle(emissionTitre: string, regle: Regle) {
  setRegles(emissionTitre, getRegles(emissionTitre).map(r => r.id === regle.id ? regle : r))
}

export function removeRegle(emissionTitre: string, regleId: number) {
  setRegles(emissionTitre, getRegles(emissionTitre).filter(r => r.id !== regleId))
}

export function getRegleById(emissionTitre: string, id: number): Regle | undefined {
  return getRegles(emissionTitre).find(r => r.id === id)
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
