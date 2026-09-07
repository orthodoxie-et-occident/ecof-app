<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/" />
        </ion-buttons>
        <ion-title>{{ paroisseName }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding-bottom" style="--background: #f4f4f6">
      <div v-if="loading" class="state-container">
        <ion-spinner color="primary"></ion-spinner>
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="state-container">
        <div class="error-card">
          <ion-icon :icon="cloudOfflineOutline" class="error-icon"></ion-icon>
          <p class="error-title">Connexion impossible</p>
          <ion-button fill="outline" color="primary" @click="fetchEvents">
            <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
            Réessayer
          </ion-button>
        </div>
      </div>

      <div v-else-if="!hasContent" class="state-container">
        <p>Aucun événement à venir</p>
      </div>

      <div v-else class="events-wrapper">
        <div v-for="(group, date) in groupedEvents" :key="date" class="day-group">
          <div class="day-header">
            <span class="day-name">{{ getDayName(date) }}</span>
            <span class="day-date">{{ getFullDate(date) }}</span>
          </div>

          <div v-for="event in group" :key="event.uid" class="event-row">
            <div class="event-time">
              <template v-if="!event.allDay">
                <span>{{ formatTime(event.start) }}</span>
                <span class="time-end">{{ formatTime(event.end) }}</span>
              </template>
              <template v-else>
                <span class="allday-label">Toute la<br />journée</span>
              </template>
            </div>
            <div class="event-content">
              <p class="event-title">{{ event.title }}</p>
              <p v-if="event.location" class="event-meta">{{ event.location }}</p>
              <p v-if="event.description" class="event-desc">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSpinner, IonButton, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline } from "ionicons/icons"

const route = useRoute()
const events = ref([])
const loading = ref(true)
const error = ref(null)
const paroisseName = computed(() => route.query.nom || "Horaires")

onIonViewWillEnter(async () => {
  await fetchEvents()
})

async function fetchEvents() {
  try {
    loading.value = true
    error.value = null
    const parishId = route.params.id
    const response = await fetch(`https://api.ecof.app/parish/${parishId}`)
    if (!response.ok) throw new Error("Impossible de récupérer les événements")
    const data = await response.json()
    events.value = (data.events || []).sort((a, b) => a.start.localeCompare(b.start))
  } catch (err) {
    console.error(err.message)
    error.value = true
  } finally {
    loading.value = false
  }
}

const dateKey = (isoString) => isoString.split("T")[0]

const nextDateKey = (key) => {
  const [y, m, d] = key.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + 1)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

const todayKey = () => {
  const now = new Date()
  const yy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

// Les événements multi-jours sont toujours des allDay (jamais d'horaires
// précis sur plusieurs jours) : on les répartit simplement sur chaque
// journée qu'ils couvrent.
const groupedEvents = computed(() => {
  const acc = {}
  const today = todayKey()

  for (const event of events.value) {
    const startKey = dateKey(event.start)
    const endKey = dateKey(event.end)

    let key = startKey
    while (true) {
      if (key < today) {
        if (key === endKey) break
        key = nextDateKey(key)
        continue
      }
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
      if (key === endKey) break
      key = nextDateKey(key)
    }
  }

  for (const key in acc) {
    acc[key].sort((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1
      return a.start.localeCompare(b.start)
    })
  }

  return acc
})

const hasContent = computed(() => Object.keys(groupedEvents.value).length > 0)

const getDayName = (dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("fr-FR", { weekday: "long" })

const getFullDate = (dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

const formatTime = (dateString) => new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
</script>

<style scoped>
.events-wrapper {
  padding: 12px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.day-group {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.day-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(var(--ion-color-primary-rgb), 0.08);
}

.day-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  text-transform: capitalize;
}

.day-date {
  font-size: 0.78rem;
  color: var(--ion-color-primary);
  opacity: 0.7;
  text-transform: capitalize;
}

.event-row {
  display: flex;
  gap: 16px;
  padding: 14px 16px;
}

.event-row + .event-row {
  border-top: 1px solid #ececec;
}

.event-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 46px;
  padding-top: 2px;
  gap: 2px;
  flex-shrink: 0;
}

.event-time span {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
}

.time-end {
  font-weight: 400;
  color: #bbb;
}

.allday-label {
  font-size: 0.68rem;
  font-weight: 500;
  color: #bbb;
  text-align: right;
  line-height: 1.3;
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 4px;
}

.event-meta {
  font-size: 0.78rem;
  color: #999;
  margin: 0 0 4px;
}

.event-desc {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
  white-space: pre-line;
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
