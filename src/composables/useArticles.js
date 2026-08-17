import { ref } from "vue"

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const hasFetched = ref(false)

async function fetchArticles() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch("https://api.ecof.app/news")
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    articles.value = await res.json()
    hasFetched.value = true
  } catch (err) {
    console.error(err.message)
    error.value = true
  } finally {
    loading.value = false
  }
}

export function isNew(isoString) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return new Date(isoString) > sevenDaysAgo
}

export function useArticles() {
  return {
    articles,
    loading,
    error,
    hasFetched,
    fetchArticles,
  }
}
