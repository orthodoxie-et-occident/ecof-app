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

    <ion-content>
      <div v-if="loading" class="state-container">
        <ion-spinner color="primary"></ion-spinner>
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="state-container">
        <p class="error-text">{{ error }}</p>
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

          <div v-for="event in group" :key="event.uid" class="event-row" :class="{ 'event-row--multiday': event.isMultiDay }">
            <div class="event-time">
              <template v-if="event.isMultiDay">
                <span class="day-badge">{{ event.currentDay }}/{{ event.totalDays }}</span>
              </template>
              <template v-else>
                <span>{{ formatTime(event.start) }}</span>
                <span class="time-end">{{ formatTime(event.end) }}</span>
              </template>
            </div>
            <div class="event-content">
              <p class="event-title">{{ event.title }}</p>
              <p v-if="event.isMultiDay" class="event-range">{{ formatRange(event.start, event.end) }}</p>
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
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSpinner, onIonViewWillEnter } from "@ionic/vue"

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
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Clé "YYYY-MM-DD" extraite directement de la chaîne ISO,
// sans passer par un objet Date (pour éviter tout décalage de fuseau horaire)
const dateKey = (isoString) => isoString.split("T")[0]

// Avance une clé "YYYY-MM-DD" d'un jour, en restant en calendrier local
const nextDateKey = (key) => {
  const [y, m, d] = key.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + 1)
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

// Nombre de jours calendaires entre deux clés "YYYY-MM-DD"
const daysDiff = (keyFrom, keyTo) => {
  const [y1, m1, d1] = keyFrom.split("-").map(Number)
  const [y2, m2, d2] = keyTo.split("-").map(Number)
  const a = new Date(y1, m1 - 1, d1)
  const b = new Date(y2, m2 - 1, d2)
  return Math.round((b - a) / 86400000)
}

// Construit l'agenda jour par jour. Les événements multi-jours sont répétés sur
// chaque jour qu'ils couvrent (comme un événement classique) et placés en tête
// de chaque jour tant qu'ils sont actifs.
const groupedEvents = computed(() => {
  const acc = {}

  for (const event of events.value) {
    const startKey = dateKey(event.start)
    const endKey = dateKey(event.end)
    const isMultiDay = startKey !== endKey

    if (!isMultiDay) {
      if (!acc[startKey]) acc[startKey] = []
      acc[startKey].push({ ...event, isMultiDay: false })
      continue
    }

    const totalDays = daysDiff(startKey, endKey) + 1
    let key = startKey
    while (true) {
      if (!acc[key]) acc[key] = []
      acc[key].push({
        ...event,
        isMultiDay: true,
        currentDay: daysDiff(startKey, key) + 1,
        totalDays,
      })
      if (key === endKey) break
      key = nextDateKey(key)
    }
  }

  for (const key in acc) {
    acc[key].sort((a, b) => {
      if (a.isMultiDay !== b.isMultiDay) return a.isMultiDay ? -1 : 1
      return a.start.localeCompare(b.start)
    })
  }

  return acc
})

const hasContent = computed(() => Object.keys(groupedEvents.value).length > 0)

const getDayName = (dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("fr-FR", { weekday: "long" })

const getFullDate = (dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

const formatTime = (dateString) => new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

const formatRange = (start, end) => {
  const s = new Date(start)
  const e = new Date(end)
  const dateOpts = { day: "numeric", month: "short" }
  const startDate = s.toLocaleDateString("fr-FR", dateOpts)
  const endDate = e.toLocaleDateString("fr-FR", dateOpts)
  return `${startDate} ${formatTime(start)} → ${endDate} ${formatTime(end)}`
}
</script>

<style scoped>
.events-wrapper {
  padding: 8px 0 40px;
}

.day-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 20px 16px 8px;
  border-bottom: 1px solid #eee;
}

.day-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  text-transform: capitalize;
}

.day-date {
  font-size: 0.8rem;
  color: #999;
  text-transform: capitalize;
}

.event-row {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.event-row--multiday {
  background: rgba(var(--ion-color-primary-rgb), 0.06);
  border-left: 3px solid var(--ion-color-primary);
  padding-left: 13px;
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

.day-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ion-color-primary);
  background: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  white-space: nowrap;
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

.event-row--multiday .event-title {
  color: var(--ion-color-primary);
}

.event-range {
  font-size: 0.78rem;
  color: #999;
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

.error-text {
  color: var(--ion-color-danger);
}
</style>
