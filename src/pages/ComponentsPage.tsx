import { useState } from 'react'
import { Autocomplete } from '@/components/ui/autocomplete'
import { ArrowLeft } from 'lucide-react'
import { Tooltip } from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { BTN_PRIMARY, BTN_SECONDARY, LINK, CARD, CARD_BLUE, INPUT, LABEL, SELECT } from '@/lib/styles'
import { PageTitle } from '@/components/ui/page-title'
import { CardTitle } from '@/components/ui/card-title'
import { ItemTitle } from '@/components/ui/item-title'
import { ToggleGroup, ToggleGroupLabel } from '@/components/ui/toggle-group'
import { SelectField } from '@/components/ui/select-field'
import { useNavigation } from '@/contexts/navigation-context'

// ---------------------------------------------------------------------------
// Helpers internes
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 mt-8 first:mt-0">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

interface PropDef {
  name: string
  type: string
  description?: string
}

function ComponentCard({
  name,
  importPath,
  props,
  children,
}: {
  name: string
  importPath: string
  props?: PropDef[]
  children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="font-mono font-semibold text-gray-800">{name}</div>
        <div className="font-mono text-xs text-gray-400 mt-0.5">{importPath}</div>
      </div>

      {props && props.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100 bg-white">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Props</div>
          <div className="flex flex-col gap-1.5">
            {props.map(p => (
              <div key={p.name} className="flex items-baseline gap-2">
                <span className="font-mono text-purple-700 font-medium">{p.name}</span>
                <span className="font-mono text-[11px] text-gray-400">{p.type}</span>
                {p.description && <span className="text-gray-500 text-xs">{p.description}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-4 bg-[#fafafa] flex items-center gap-4 flex-wrap min-h-[60px]">
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

export default function ComponentsPage() {
  const { navigate } = useNavigation()
  const [checked, setChecked] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [toggle, setToggle] = useState('oui')
  const [autocomplete, setAutocomplete] = useState('')

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-[1088px] mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('Qualipo')}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            title="Retour"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Catalogue de composants</h1>
            <p className="text-xs text-gray-400 mt-0.5">src/components/ui/  ·  src/lib/styles.ts</p>
          </div>
        </div>
      </div>

      {/* Contenu centré */}
      <div className="max-w-[1088px] mx-auto px-6 py-8 pb-16">

        {/* ---------------------------------------------------------------- */}
        <Section title="Palette — src/index.css">
          <div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="font-mono font-semibold text-gray-800">blue-rf</div>
              <div className="font-mono text-xs text-gray-400 mt-0.5">--color-blue-rf · #463ACB</div>
            </div>
            <div className="px-4 py-4 bg-[#fafafa] flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-blue-rf shadow-sm" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono text-gray-500">bg-blue-rf</span>
                  <span className="text-xs font-mono text-gray-500">text-blue-rf</span>
                  <span className="text-xs font-mono text-gray-500">border-blue-rf</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="size-6 rounded bg-blue-rf opacity-20" />
                <div className="size-6 rounded bg-blue-rf opacity-40" />
                <div className="size-6 rounded bg-blue-rf opacity-60" />
                <div className="size-6 rounded bg-blue-rf opacity-80" />
                <div className="size-6 rounded bg-blue-rf" />
                <span className="text-xs text-gray-400 ml-1">bg-blue-rf/{'{'}20…100{'}'}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section title="Composants UI — src/components/ui/">

          <ComponentCard
            name="SelectField"
            importPath="import { SelectField } from '@/components/ui/select-field'"
            props={[
              { name: 'label',     type: 'string',          description: 'Label affiché au-dessus' },
              { name: 'disabled?', type: 'boolean',         description: 'Désactive le select + grise le label' },
              { name: 'children',  type: 'React.ReactNode', description: '<option> éléments' },
            ]}
          >
            <div className="flex gap-4 w-full">
              <SelectField label="Actif" className="flex-1">
                <option>Option A</option>
                <option>Option B</option>
              </SelectField>
              <SelectField label="Désactivé" disabled className="flex-1">
                <option>—</option>
              </SelectField>
            </div>
          </ComponentCard>

          <ComponentCard
            name="Autocomplete"
            importPath="import { Autocomplete } from '@/components/ui/autocomplete'"
            props={[
              { name: 'options',     type: '{ label: string; sublabel?: string }[]', description: 'Liste des suggestions' },
              { name: 'value',       type: 'string',                                 description: 'Valeur courante (contrôlé)' },
              { name: 'onChange',    type: '(value: string) => void',                description: 'Callback keystroke + sélection' },
              { name: 'placeholder?', type: 'string',                               description: '' },
            ]}
          >
            <div className="w-72">
              <Autocomplete
                options={[
                  { label: 'La bande originale' },
                  { label: 'Le masque et la plume' },
                  { label: 'La méthode scientifique' },
                  { label: 'Le téléphone sonne' },
                  { label: 'Affaires sensibles', sublabel: '19/05/2025 à 15:00' },
                ]}
                value={autocomplete}
                onChange={setAutocomplete}
                placeholder="Taper pour filtrer…"
              />
            </div>
          </ComponentCard>

          <ComponentCard
            name="Tooltip"
            importPath="import { Tooltip } from '@/components/ui/tooltip'"
            props={[
              { name: 'label',    type: 'string',                      description: 'Texte de la bulle' },
              { name: 'align?',   type: "'left' | 'center' | 'right'", description: 'Défaut : right' },
              { name: 'width?',   type: 'string',                      description: 'Classe Tailwind de largeur. Défaut : whitespace-nowrap' },
              { name: 'children', type: 'React.ReactNode',             description: 'Élément déclencheur' },
            ]}
          >
            <Tooltip label="Tooltip aligné à droite">
              <button className="px-3 py-1 text-xs bg-gray-800 text-white rounded">align=right (défaut)</button>
            </Tooltip>
            <Tooltip label="Tooltip aligné à gauche" align="left">
              <button className="px-3 py-1 text-xs bg-gray-800 text-white rounded">align=left</button>
            </Tooltip>
            <Tooltip label="Tooltip centré" align="center">
              <button className="px-3 py-1 text-xs bg-gray-800 text-white rounded">align=center</button>
            </Tooltip>
          </ComponentCard>

          <ComponentCard
            name="Checkbox"
            importPath="import { Checkbox } from '@/components/ui/checkbox'"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id="demo-checkbox"
                checked={checked}
                onCheckedChange={(v) => setChecked(v === true)}
              />
              <Label htmlFor="demo-checkbox" className="cursor-pointer">
                {checked ? 'Coché' : 'Non coché'}
              </Label>
            </div>
          </ComponentCard>

          <ComponentCard
            name="Switch"
            importPath="import { Switch } from '@/components/ui/switch'"
            props={[
              { name: 'size?', type: "'sm' | 'default'", description: 'Défaut : default' },
            ]}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={switchOn} onCheckedChange={(v) => setSwitchOn(v)} />
                <span className="text-xs text-gray-600">default — {switchOn ? 'on' : 'off'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch size="sm" />
                <span className="text-xs text-gray-600">sm</span>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard
            name="Label"
            importPath="import { Label } from '@/components/ui/label'"
          >
            <Label>Label de champ</Label>
            <Label className="opacity-50 cursor-not-allowed">Label désactivé</Label>
          </ComponentCard>

          <ComponentCard
            name="PageTitle"
            importPath="import { PageTitle } from '@/components/ui/page-title'"
            props={[
              { name: 'children', type: 'React.ReactNode', description: 'Titre de la page' },
            ]}
          >
            <PageTitle>Titre de page</PageTitle>
          </ComponentCard>

          <ComponentCard
            name="ToggleGroup"
            importPath="import { ToggleGroup } from '@/components/ui/toggle-group'"
            props={[
              { name: 'options', type: '{ label: string; value: string }[]', description: 'Liste des options' },
              { name: 'value',   type: 'string',                             description: 'Valeur active' },
              { name: 'onChange', type: '(value: string) => void',           description: 'Callback de changement' },
            ]}
          >
            <ToggleGroup
              options={[{ label: 'Oui', value: 'oui' }, { label: 'Non', value: 'non' }]}
              value={toggle}
              onChange={setToggle}
            />
            <ToggleGroup
              options={[{ label: 'Jour', value: 'jour' }, { label: 'Semaine', value: 'semaine' }, { label: 'Mois', value: 'mois' }]}
              value="semaine"
              onChange={() => {}}
            />
          </ComponentCard>

          <ComponentCard
            name="ToggleGroupLabel"
            importPath="import { ToggleGroupLabel } from '@/components/ui/toggle-group'"
            props={[
              { name: 'label',   type: 'string',                             description: 'Label affiché au-dessus' },
              { name: 'options', type: '{ label: string; value: string }[]', description: 'Liste des options' },
              { name: 'value',   type: 'string',                             description: 'Valeur active' },
              { name: 'onChange', type: '(value: string) => void',           description: 'Callback de changement' },
            ]}
          >
            <ToggleGroupLabel
              label="Contenu"
              options={[{ label: 'Émission', value: 'emission' }, { label: 'Diffusion', value: 'diffusion' }]}
              value={toggle}
              onChange={setToggle}
            />
          </ComponentCard>

          <ComponentCard
            name="ItemTitle"
            importPath="import { ItemTitle } from '@/components/ui/item-title'"
            props={[
              { name: 'children', type: 'React.ReactNode', description: 'Titre d\'un item ou d\'une section dans une card' },
            ]}
          >
            <ItemTitle>Titre d'item</ItemTitle>
          </ComponentCard>

          <ComponentCard
            name="CardTitle"
            importPath="import { CardTitle } from '@/components/ui/card-title'"
            props={[
              { name: 'children', type: 'React.ReactNode', description: 'Titre de section / carte' },
            ]}
          >
            <CardTitle>Titre de section</CardTitle>
          </ComponentCard>

        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section title="Tokens de style — src/lib/styles.ts">

          <ComponentCard
            name="BTN_PRIMARY"
            importPath="import { BTN_PRIMARY } from '@/lib/styles'"
          >
            <button className={BTN_PRIMARY}>Bouton primaire</button>
          </ComponentCard>

          <ComponentCard
            name="BTN_SECONDARY"
            importPath="import { BTN_SECONDARY } from '@/lib/styles'"
          >
            <button className={BTN_SECONDARY}>Bouton secondaire</button>
          </ComponentCard>

          <ComponentCard
            name="LINK"
            importPath="import { LINK } from '@/lib/styles'"
          >
            <span className={LINK}>Lien d'action</span>
          </ComponentCard>

          <ComponentCard
            name="CARD"
            importPath="import { CARD } from '@/lib/styles'"
          >
            <div className={`${CARD} text-sm text-gray-600 w-full`}>
              Contenu dans une CARD — rounded-xl, bg-white, shadow
            </div>
          </ComponentCard>

          <ComponentCard
            name="CARD_BLUE"
            importPath="import { CARD_BLUE } from '@/lib/styles'"
          >
            <div className={`${CARD_BLUE} text-sm text-blue-rf w-full`}>
              Variante bleue — bg-blue-rf/10, sans ombre
            </div>
          </ComponentCard>

          <ComponentCard
            name="INPUT · LABEL · SELECT"
            importPath="import { INPUT, LABEL, SELECT } from '@/lib/styles'"
          >
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-1">
                <label className={LABEL}>Champ texte</label>
                <input className={INPUT} placeholder="Placeholder…" style={{ maxWidth: 260 }} />
              </div>
              <div className="flex flex-col gap-1" style={{ maxWidth: 260 }}>
                <label className={LABEL}>Sélection</label>
                <div className="relative">
                  <select className={SELECT}>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>

        </Section>

      </div>
    </div>
  )
}
