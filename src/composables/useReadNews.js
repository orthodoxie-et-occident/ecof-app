import { reactive } from "vue"
import { Preferences } from "@capacitor/preferences"

const STORAGE_KEY = "read_news_ids"

// État partagé au niveau du module : toutes les vues qui importent ce composable
// pointent vers la même instance réactive (équivalent d'un store, sans dépendance).
const state = reactive({
  readIds: new Set(),
  loaded: false,
})

let loadingPromise = null

// Hydrate le Set depuis le stockage persistant. Idempotent : peut être appelé
// depuis App.vue, NewsPage, NewsCategoryPage... sans relire le storage à chaque fois.
async function load() {
  if (state.loaded) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    const { value } = await Preferences.get({ key: STORAGE_KEY })
    state.readIds = new Set(value ? JSON.parse(value) : [])
    state.loaded = true
  })()

  return loadingPromise
}

async function persist() {
  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(Array.from(state.readIds)),
  })
}

async function markAsRead(id) {
  const key = String(id)
  if (state.readIds.has(key)) return
  state.readIds.add(key)
  await persist()
}

// Marque plusieurs articles comme lus en une seule écriture storage
// (évite un persist() par article quand on fait "tout marquer comme lu")
async function markAllAsRead(ids) {
  let changed = false
  for (const id of ids) {
    const key = String(id)
    if (!state.readIds.has(key)) {
      state.readIds.add(key)
      changed = true
    }
  }
  if (changed) await persist()
}

function isRead(id) {
  return state.readIds.has(String(id))
}

// Nombre d'articles non lus dans une liste donnée (toutes news, ou une catégorie)
function unreadCount(articles) {
  return articles.filter((a) => !isRead(a.id)).length
}

// Optionnel : à appeler après un fetchArticles() pour éviter que le stockage
// grossisse indéfiniment avec des ids d'articles supprimés côté serveur.
async function pruneReadIds(currentArticles) {
  const currentIds = new Set(currentArticles.map((a) => String(a.id)))
  const before = state.readIds.size
  state.readIds = new Set([...state.readIds].filter((id) => currentIds.has(id)))
  if (state.readIds.size !== before) await persist()
}

export function useReadNews() {
  return { state, load, markAsRead, markAllAsRead, isRead, unreadCount, pruneReadIds }
}
