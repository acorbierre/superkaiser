# SuperKaiser — Instructions Claude

## Stack
React 19 + TypeScript + Vite + Tailwind v4 + Base UI

## Règles de développement

### 1. Consulter le catalogue avant de créer

Avant de créer un composant ou une classe utilitaire, lire systématiquement :
- `src/components/ui/` — composants génériques existants
- `src/lib/styles.ts` — tokens de classes Tailwind partagés

Ne créer un nouveau composant que si aucune solution existante ne couvre le besoin. Ne pas dupliquer.

### 2. Factoriser tout élément réutilisé

Tout élément d'interface utilisé à plus d'un endroit doit être extrait en composant dans `src/components/ui/`. Pas de duplication inline entre pages ou composants.

### 3. Organisation des fichiers — responsabilités strictes

| Dossier | Contenu |
|---|---|
| `src/components/ui/` | Composants génériques sans logique métier (Button, Badge, Modal…) |
| `src/components/[domaine]/` | Composants spécifiques à un domaine (ex: `qualipo/`, `diffusions/`) |
| `src/data/` | Constantes, types, données mock — jamais de JSX |
| `src/lib/styles.ts` | Seule source de vérité pour les variantes visuelles (classes Tailwind) |
| `src/pages/` | Pages légères : assemblage de composants uniquement, pas de logique inline |
| `src/contexts/` | Contextes React globaux |

### 4. Lire avant d'écrire

- Lire un fichier en entier avant de le modifier.
- Avant toute création : vérifier qu'un fichier équivalent n'existe pas déjà ailleurs.
- Utiliser offset/limit pour les lectures ciblées sur les grands fichiers.

### 5. Cursor sur les éléments cliquables

Tout composant ou élément interactif (bouton, lien, item de liste, toggle…) doit toujours avoir `cursor-pointer`. Sans exception.

### 6. Consommation de tokens responsable

- Ne pas re-lire un fichier déjà lu dans la session si son contenu n'a pas changé.
- Préférer des recherches ciblées (Grep/Glob) à des explorations larges.
- Travailler composant par composant, pas en masse.
