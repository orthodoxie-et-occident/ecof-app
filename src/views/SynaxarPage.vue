<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Synaxaire</ion-title>
      </ion-toolbar>

      <ion-toolbar color="primary">
        <ion-searchbar v-model="searchTerm" placeholder="Recherche" :debounce="300"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="loading" class="state-container">
        <ion-spinner color="primary"></ion-spinner>
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="state-container">
        <div class="error-card">
          <ion-icon :icon="cloudOfflineOutline" class="error-icon"></ion-icon>
          <p class="error-title">Connexion impossible</p>
          <ion-button fill="outline" color="primary" @click="fetchSaints">
            <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
            Réessayer
          </ion-button>
        </div>
      </div>

      <template v-else>
        <template v-for="(items, letter) in groupedSaints" :key="letter">
          <ion-list-header>
            <ion-label>
              <h2>{{ letter }}</h2>
            </ion-label>
          </ion-list-header>
          <ion-list>
            <ion-item button detail v-for="item in items" :key="item.id" @click="showSaintDetail(item)">
              <ion-label>
                <h2 class="saint-title">{{ item.saint }}</h2>
              </ion-label>
            </ion-item>
          </ion-list>
        </template>
      </template>

      <ion-infinite-scroll v-if="!loading && !error" :disabled="allLoaded" @ionInfinite="loadMore">
        <ion-infinite-scroll-content loading-spinner="crescent" loading-text="Chargement..."> </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useIonRouter } from "@ionic/vue"
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonListHeader,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  onIonViewWillEnter,
} from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline } from "ionicons/icons"

const PAGE_SIZE = 40

const ionRouter = useIonRouter()

const saints = ref([])
const loading = ref(true)
const error = ref(null)
const searchTerm = ref("")
const displayCount = ref(PAGE_SIZE)
const hasFetched = ref(false)

const removeAccents = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const fetchSaints = async () => {
  loading.value = true
  error.value = null
  displayCount.value = PAGE_SIZE

  try {
    const response = await fetch("https://api-v2.ecof.app/synaxar")
    if (!response.ok) throw new Error("Erreur lors du chargement des données")

    const data = await response.json()

    saints.value = data.map((item) => ({
      ...item,
      _normalized: item.saint ? removeAccents(item.saint) : "",
    }))

    hasFetched.value = true
  } catch (err) {
    console.error(err.message)
    error.value = true
  } finally {
    loading.value = false
  }
}

const filteredSaints = computed(() => {
  if (!searchTerm.value.trim()) return saints.value
  const q = removeAccents(searchTerm.value)
  return saints.value.filter((item) => item._normalized.includes(q))
})

const visibleSaints = computed(() => filteredSaints.value.slice(0, displayCount.value))

const allLoaded = computed(() => displayCount.value >= filteredSaints.value.length)

const groupedSaints = computed(() => {
  const groups = {}
  for (const item of visibleSaints.value) {
    const letter = item._normalized.charAt(0).toUpperCase() || "#"
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(item)
  }
  return groups
})

watch(searchTerm, () => {
  displayCount.value = PAGE_SIZE
})

const loadMore = async (event) => {
  const targetCount = Math.min(displayCount.value + PAGE_SIZE, filteredSaints.value.length)

  // Étend jusqu'à la fin de la lettre en cours pour éviter de la couper en deux
  let newCount = targetCount
  if (newCount < filteredSaints.value.length) {
    const currentLetter = filteredSaints.value[newCount - 1]._normalized.charAt(0).toUpperCase() || "#"
    while (newCount < filteredSaints.value.length && (filteredSaints.value[newCount]._normalized.charAt(0).toUpperCase() || "#") === currentLetter) {
      newCount++
    }
  }

  displayCount.value = newCount
  await event.target.complete()
}

const showSaintDetail = (item) => {
  ionRouter.push({
    name: "Saint",
    params: {
      id: item.vies_id,
    },
  })
}

onIonViewWillEnter(() => {
  if (!hasFetched.value) fetchSaints()
})
</script>

<style scoped>
ion-list-header {
  padding-top: 20px;
  padding-bottom: 8px;
  position: relative;
  margin-bottom: 8px;
}

ion-list-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--ion-color-primary);
}

ion-list-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ion-color-dark);
}

ion-list:last-of-type {
  margin-bottom: 24px;
}

ion-item {
  --min-height: 56px;
}

.saint-title {
  font-size: 0.9rem;
  line-height: 1.3;
  color: var(--ion-color-dark, #1a1a1a);
  margin: 0;
  white-space: normal;
  overflow-wrap: break-word;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 10px;
  color: #aaa;
  font-size: 0.9rem;
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 2rem;
  text-align: center;
}

.error-icon {
  font-size: 56px;
  color: var(--ion-color-medium);
  opacity: 0.4;
}

.error-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}
</style>
