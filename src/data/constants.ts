export const STATION = {
  label:     'France Culture',
  couleur:   '#762B84',
  initiales: 'culture',
  logo:      '/stations/france-culture.svg',
} as const

export const EMISSIONS_IMAGES: Record<string, string> = {
  'À voix nue':              '/emissions/sc_a_voix_nue_1400.jpg',
  'Affaires étrangères':     '/emissions/sc_affaires-etrangeres.png',
  'Le cours de l\'histoire': '/emissions/sc_sc_le-cours-de-l-histoire.png',
}

export const FALLBACK_DIFFUSE_AT = '15 juin 2026 à 09h00'
export const FALLBACK_LIBERATION_AT = '22 juin 2026 à 09h00'
