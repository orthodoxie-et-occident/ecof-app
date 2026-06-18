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
        <!-- Bandeau "À noter" : un seul événement par ligne, même sur plusieurs jours -->
        <div v-if="multiDayEvents.length" class="highlight-section">
          <p class="section-label">À noter</p>
          <div v-for="event in multiDayEvents" :key="event.uid" class="highlight-card" :class="{ ongoing: event.isOngoing }">
            <p class="highlight-title">{{ event.title }}</p>
            <p class="highlight-range">
              {{ formatRange(event.start, event.end) }}
              <span class="highlight-status" :class="{ ongoing: event.isOngoing }">· {{ event.status }}</span>
            </p>
            <p v-if="event.location" class="event-meta">{{ event.location }}</p>
            <p v-if="event.description" class="event-desc">{{ event.description }}</p>
          </div>
        </div>

        <!-- Agenda jour par jour : uniquement les événements sur un seul jour -->
        <div v-for="(group, date) in groupedEvents" :key="date" class="day-group">
          <div class="day-header">
            <span class="day-name">{{ getDayName(date) }}</span>
            <span class="day-date">{{ getFullDate(date) }}</span>
          </div>

          <div v-for="event in group" :key="event.uid" class="event-row">
            <div class="event-time">
              <span>{{ formatTime(event.start) }}</span>
              <span class="time-end">{{ formatTime(event.end) }}</span>
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
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonSpinner, onIonViewWillEnter } from "@ionic/vue"

const route = useRoute()
const events = ref([])
const loading = ref(true)
const error = ref(null)
const paroisseName = computed(() => route.query.nom || "Horaires")

// Au-delà de ce nombre de mois, un événement multi-jours n'apparaît plus dans le bandeau "À noter"
const HIGHLIGHT_WINDOW_MONTHS = 3

onIonViewWillEnter(async () => {
  await fetchEvents()
})

async function fetchEvents() {
  try {
    loading.value = true
    error.value = null
    const parishId = route.params.id
    const response = await fetch(`https://ecof-api-production.up.railway.app/api/parish/${parishId}`)
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

const todayKey = () => {
  const now = new Date()
  const yy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

// Décale une clé "YYYY-MM-DD" d'un nombre de mois donné
const addMonths = (key, months) => {
  const [y, m, d] = key.split("-").map(Number)
  const date = new Date(y, m - 1 + months, d)
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

// Agenda jour par jour : uniquement les événements qui se déroulent sur un seul jour.
// Les événements multi-jours sont gérés séparément dans le bandeau "À noter".
const groupedEvents = computed(() => {
  const acc = {}

  for (const event of events.value) {
    const startKey = dateKey(event.start)
    const endKey = dateKey(event.end)
    if (startKey !== endKey) continue

    if (!acc[startKey]) acc[startKey] = []
    acc[startKey].push(event)
  }

  for (const key in acc) {
    acc[key].sort((a, b) => a.start.localeCompare(b.start))
  }

  return acc
})

// Bandeau "À noter" : une seule ligne par événement multi-jours, avec un statut relatif.
// On exclut les événements déjà terminés et ceux qui démarrent trop loin dans le futur.
const multiDayEvents = computed(() => {
  const today = todayKey()
  const limit = addMonths(today, HIGHLIGHT_WINDOW_MONTHS)

  return events.value
    .filter((event) => dateKey(event.start) !== dateKey(event.end))
    .map((event) => ({
      ...event,
      startKey: dateKey(event.start),
      endKey: dateKey(event.end),
    }))
    .filter((event) => event.endKey >= today && event.startKey <= limit)
    .map((event) => {
      const totalDays = daysDiff(event.startKey, event.endKey) + 1
      const isOngoing = event.startKey <= today && today <= event.endKey

      let status
      if (isOngoing) {
        const currentDay = daysDiff(event.startKey, today) + 1
        status = totalDays > 1 ? `En cours · jour ${currentDay}/${totalDays}` : "En cours"
      } else {
        const daysUntil = daysDiff(today, event.startKey)
        status = daysUntil === 1 ? "Demain" : `Dans ${daysUntil} jours`
      }

      return { ...event, totalDays, isOngoing, status }
    })
    .sort((a, b) => a.start.localeCompare(b.start))
})

const hasContent = computed(() => multiDayEvents.value.length > 0 || Object.keys(groupedEvents.value).length > 0)

const getDayName = (dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("fr-FR", { weekday: "long" })

const getFullDate = (dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

const formatTime = (dateString) => new Date(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

const formatRange = (start, end) => {
  const s = new Date(start)
  const e = new Date(end)
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()
  const startStr = s.toLocaleDateString("fr-FR", sameMonth ? { day: "numeric" } : { day: "numeric", month: "short" })
  const endStr = e.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  return `${startStr} → ${endStr}`
}
</script>

<style scoped>
.events-wrapper {
  padding: 8px 0 40px;
}

.highlight-section {
  padding: 4px 0 12px;
  border-bottom: 6px solid #f7f7f7;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ion-color-primary);
  margin: 0;
  padding: 12px 16px 8px;
}

.highlight-card {
  margin: 0 16px 10px;
  padding: 10px 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fafafa;
}

.highlight-card.ongoing {
  border-color: var(--ion-color-primary);
  background: rgba(var(--ion-color-primary-rgb), 0.06);
}

.highlight-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 4px;
  line-height: 1.35;
}

.highlight-range {
  font-size: 0.78rem;
  color: #999;
  margin: 0 0 4px;
}

.highlight-status {
  font-weight: 600;
  color: #999;
}

.highlight-status.ongoing {
  color: var(--ion-color-primary);
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

.event-content {
  flex: 1;
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

.error-text {
  color: var(--ion-color-danger);
}
</style>
