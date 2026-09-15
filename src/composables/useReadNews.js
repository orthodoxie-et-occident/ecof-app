import { reactive } from "vue"
import { Preferences } from "@capacitor/preferences"

const STORAGE_KEY = "read_news_ids"

const state = reactive({
  readIds: new Set(),
  loaded: false,
})

let loadingPromise = null

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

function unreadCount(articles) {
  return articles.filter((a) => isReportable(a) && !isRead(a.id)).length
}

const REPORT_WINDOW_DAYS = 30

function isReportable(article) {
  const windowStart = new Date()
  windowStart.setDate(windowStart.getDate() - REPORT_WINDOW_DAYS)
  return new Date(article.published_at) >= windowStart
}

async function pruneReadIds(currentArticles) {
  const currentIds = new Set(currentArticles.map((a) => String(a.id)))
  const before = state.readIds.size
  state.readIds = new Set([...state.readIds].filter((id) => currentIds.has(id)))
  if (state.readIds.size !== before) await persist()
}

export function useReadNews() {
  return { state, load, markAsRead, markAllAsRead, isRead, unreadCount, pruneReadIds, isReportable }
}
