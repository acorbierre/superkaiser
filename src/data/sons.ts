export type StatutSon =
  | 'livre'
  | 'livre_avance'
  | 'attente'
  | 'duree_incoherente'
  | 'non_disponible'

export interface SonDetail {
  titreComplet: string
  diffuseAt: string
  publiAt: string
  programme: string
  programmeCode?: string
  podcastPrincipalLabel?: string
}

export interface Son {
  id: string
  date: string
  debut: string
  fin: string
  emission: string
  titre: string
  numeroMagnetotheque: string
  statut: StatutSon
  badge?: 'NATIO' | 'MULTIDIFF'
  sousElements?: { titre: string; statut: StatutSon }[]
  // duree_incoherente
  dureeAttendue?: string   // ex: "58min 00s"
  dureeReelle?: string     // ex: "1h 03min 12s"
  // attente
  minutesRestantes?: number
  detail: SonDetail
}

export const STATUT_LABEL: Record<StatutSon, string> = {
  livre:             'Livré et diffusé',
  livre_avance:      'Livré en avance',
  attente:           'En attente',
  duree_incoherente: 'Durée incohérente',
  non_disponible:    'Son non disponible',
}

export const STATION = {
  label: 'France Inter',
  couleur: '#E2001A',
  initiales: 'inter',
}

export const sons: Son[] = [
  {
    id: '1',
    date: '19 Mai',
    debut: '5:59',
    fin: '9:00',
    emission: 'La grande matinale',
    titre: 'La grande matinale',
    numeroMagnetotheque: '2025C3305S0001',
    statut: 'livre',
    detail: {
      titreComplet: 'La grande matinale du 19 mai',
      diffuseAt: '19/05/2025 à 06:00',
      publiAt: '19/05/2025 à 06:00',
      programme: 'La grande matinale (BR : 10001)',
      podcastPrincipalLabel: 'La grande matinale',
    },
  },
  {
    id: '2',
    date: '19 Mai',
    debut: '6:00',
    fin: '6:59',
    emission: 'Le journal de 6h',
    titre: 'Le journal de 7h, émission du XX octobre',
    numeroMagnetotheque: '2025C3305S0002',
    statut: 'livre',
    sousElements: [
      { titre: 'Le journal de 7h, émission du XX octobre', statut: 'livre' },
    ],
    detail: {
      titreComplet: 'Le journal de 6h du 19 mai',
      diffuseAt: '19/05/2025 à 06:00',
      publiAt: '19/05/2025 à 06:00',
      programme: 'Le journal de 6h (BR : 10002)',
    },
  },
  {
    id: '3',
    date: '19 Mai',
    debut: '7:00',
    fin: '7:59',
    emission: 'Le journal de 7h',
    titre: 'Le journal de 8h, émission du XX octobre',
    numeroMagnetotheque: '2025C3305S0003',
    statut: 'livre',
    sousElements: [
      { titre: 'Le journal de 8h, émission du XX octobre', statut: 'livre' },
    ],
    detail: {
      titreComplet: 'Le journal de 7h du 19 mai',
      diffuseAt: '19/05/2025 à 07:00',
      publiAt: '19/05/2025 à 07:00',
      programme: 'Le journal de 7h (BR : 10003)',
    },
  },
  {
    id: '4',
    date: '19 Mai',
    debut: '8:00',
    fin: '8:59',
    emission: 'Le journal de 8h',
    titre: 'Le journal de 9h, émission du XX octobre',
    numeroMagnetotheque: '2025C3305S0004',
    statut: 'livre',
    sousElements: [
      { titre: 'Le journal de 9h, émission du XX octobre', statut: 'livre' },
    ],
    detail: {
      titreComplet: 'Le journal de 8h du 19 mai',
      diffuseAt: '19/05/2025 à 08:00',
      publiAt: '19/05/2025 à 08:00',
      programme: 'Le journal de 8h (BR : 10004)',
    },
  },
  {
    id: '5',
    date: '19 Mai',
    debut: '9:00',
    fin: '9:59',
    emission: 'La bande originale',
    titre: 'La bande originale, émission du XX octobre',
    numeroMagnetotheque: '2025C3305S0005',
    statut: 'livre_avance',
    detail: {
      titreComplet: 'La bande originale du 19 mai',
      diffuseAt: '19/05/2025 à 09:00',
      publiAt: '18/05/2025 à 18:00',
      programme: 'La bande originale (BR : 10005)',
      podcastPrincipalLabel: 'La bande originale',
    },
  },
  {
    id: '6',
    date: '19 Mai',
    debut: '10:00',
    fin: '10:59',
    emission: '1083 : des jeans',
    titre: '1083 : des jeans made in France',
    numeroMagnetotheque: '2025C3305S0006',
    statut: 'duree_incoherente',
    dureeAttendue: '58min 00s',
    dureeReelle: '1h 03min 12s',
    badge: 'NATIO',
    detail: {
      titreComplet: '1083 : des jeans made in France',
      diffuseAt: '19/05/2025 à 10:00',
      publiAt: '19/05/2025 à 10:00',
      programme: '1083 : des jeans (BR : 10006)',
    },
  },
  {
    id: '7',
    date: '19 Mai',
    debut: '11:00',
    fin: '11:59',
    emission: 'Le jeu des 1000€',
    titre: 'À Saint-Bardoux | spécial jeunes',
    numeroMagnetotheque: '2025C3305S0007',
    statut: 'duree_incoherente',
    dureeAttendue: '58min 00s',
    dureeReelle: '1h 02min 45s',
    detail: {
      titreComplet: 'Le jeu des 1000€ — À Saint-Bardoux',
      diffuseAt: '19/05/2025 à 11:00',
      publiAt: '19/05/2025 à 11:00',
      programme: 'Le jeu des 1000€ (BR : 10007)',
      podcastPrincipalLabel: 'Le jeu des 1000€',
    },
  },
  {
    id: '8',
    date: '19 Mai',
    debut: '12:00',
    fin: '12:59',
    emission: 'Le 12/14',
    titre: 'Le 12/14, émission du XX octobre',
    numeroMagnetotheque: '2025C3305S0008',
    statut: 'duree_incoherente',
    dureeAttendue: '1h 00min 00s',
    dureeReelle: '58min 33s',
    detail: {
      titreComplet: 'Le 12/14 du 19 mai',
      diffuseAt: '19/05/2025 à 12:00',
      publiAt: '19/05/2025 à 12:00',
      programme: 'Le 12/14 (BR : 10008)',
    },
  },
  {
    id: '9',
    date: '19 Mai',
    debut: '14:00',
    fin: '14:59',
    emission: 'La terre au carré',
    titre: 'La terre au carré — spécial forêts',
    numeroMagnetotheque: '2025C3305S0009',
    statut: 'non_disponible',
    detail: {
      titreComplet: 'La terre au carré — spécial forêts',
      diffuseAt: '19/05/2025 à 14:00',
      publiAt: '19/05/2025 à 14:00',
      programme: 'La terre au carré (BR : 10009)',
    },
  },
  {
    id: '10',
    date: '19 Mai',
    debut: '15:00',
    fin: '15:59',
    emission: 'Affaires sensibles',
    titre: 'L\'affaire Seznec',
    numeroMagnetotheque: '2025C3305S0010',
    statut: 'non_disponible',
    detail: {
      titreComplet: 'Affaires sensibles — L\'affaire Seznec',
      diffuseAt: '19/05/2025 à 15:00',
      publiAt: '19/05/2025 à 15:00',
      programme: 'Affaires sensibles (BR : 10010)',
    },
  },
  {
    id: '11',
    date: '19 Mai',
    debut: '16:00',
    fin: '16:59',
    emission: 'La méthode scientifique',
    titre: 'Peut-on prévoir les séismes ?',
    numeroMagnetotheque: '2025C3305S0011',
    statut: 'duree_incoherente',
    dureeAttendue: '58min 00s',
    dureeReelle: '53min 17s',
    detail: {
      titreComplet: 'La méthode scientifique — Peut-on prévoir les séismes ?',
      diffuseAt: '19/05/2025 à 16:00',
      publiAt: '19/05/2025 à 16:00',
      programme: 'La méthode scientifique (BR : 10011)',
      podcastPrincipalLabel: 'La méthode scientifique',
    },
  },
  {
    id: '12',
    date: '19 Mai',
    debut: '18:00',
    fin: '18:20',
    emission: 'Le 18/20',
    titre: 'Le 18/20, émission du XX octobre',
    numeroMagnetotheque: '2025C3305S0012',
    statut: 'non_disponible',
    detail: {
      titreComplet: 'Le 18/20 du 19 mai',
      diffuseAt: '19/05/2025 à 18:00',
      publiAt: '19/05/2025 à 18:00',
      programme: 'Le 18/20 (BR : 10012)',
    },
  },
  {
    id: '13',
    date: '19 Mai',
    debut: '19:00',
    fin: '19:59',
    emission: 'Le téléphone sonne',
    titre: 'Faut-il supprimer les notes à l\'école ?',
    numeroMagnetotheque: '2025C3305S0013',
    statut: 'duree_incoherente',
    dureeAttendue: '58min 00s',
    dureeReelle: '1h 01min 22s',
    detail: {
      titreComplet: 'Le téléphone sonne — Faut-il supprimer les notes ?',
      diffuseAt: '19/05/2025 à 19:00',
      publiAt: '19/05/2025 à 19:00',
      programme: 'Le téléphone sonne (BR : 10013)',
      podcastPrincipalLabel: 'Le téléphone sonne',
    },
  },
  {
    id: '14',
    date: '19 Mai',
    debut: '20:00',
    fin: '20:59',
    emission: 'Le masque et la plume',
    titre: 'Cinéma — les sorties de la semaine',
    numeroMagnetotheque: '2025C3305S0014',
    statut: 'livre_avance',
    badge: 'MULTIDIFF',
    detail: {
      titreComplet: 'Le masque et la plume — Cinéma',
      diffuseAt: '19/05/2025 à 20:00',
      publiAt: '18/05/2025 à 20:00',
      programme: 'Le masque et la plume (BR : 10014)',
      podcastPrincipalLabel: 'Le masque et la plume',
    },
  },
  {
    id: '15',
    date: '19 Mai',
    debut: '22:00',
    fin: '22:59',
    emission: 'Les nuits de France Inter',
    titre: 'Archive — Gainsbourg à l\'Olympia',
    numeroMagnetotheque: '2025C3305S0015',
    statut: 'attente',
    minutesRestantes: 47,
    detail: {
      titreComplet: 'Les nuits de France Inter — Gainsbourg à l\'Olympia',
      diffuseAt: '19/05/2025 à 22:00',
      publiAt: '19/05/2025 à 22:00',
      programme: 'Les nuits de France Inter (BR : 10015)',
    },
  },
]
