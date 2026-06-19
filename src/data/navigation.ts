export interface ContenuPage {
  label: string
  enabled: boolean
}

export const CONTENUS_PAGES: ContenuPage[] = [
  { label: 'Programmes',              enabled: false },
  { label: 'Diffusions',              enabled: true  },
  { label: 'Concerts',                enabled: false },
  { label: 'Replays',                 enabled: false },
  { label: 'Podcasts',                enabled: false },
  { label: 'Stations',                enabled: false },
  { label: 'Gestion des expressions', enabled: false },
  { label: 'Editions des tags',       enabled: false },
]

// Set de labels pour tester l'appartenance rapidement
export const CONTENUS_PAGE_SET = new Set(CONTENUS_PAGES.map(p => p.label))

// Items du dropdown avec séparateur entre "Stations" et "Gestion des expressions"
export const CONTENUS_DROPDOWN: (ContenuPage | null)[] = [
  ...CONTENUS_PAGES.slice(0, 6),
  null,
  ...CONTENUS_PAGES.slice(6),
]

// Liens de la top nav rendus après le dropdown "Contenus"
export const TOP_NAV_LINKS: { label: string; page: string | null }[] = [
  { label: 'Qualipo',    page: 'Qualipo'    },
  { label: 'RSS',        page: null         },
  { label: 'Habillages', page: 'Habillages' },
  { label: 'Streaming',  page: null         },
  { label: 'Watchdog',   page: null         },
]
