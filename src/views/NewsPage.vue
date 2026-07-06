<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Annonces</ion-title>
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
          <ion-button fill="outline" color="primary" @click="fetchArticles">
            <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
            Réessayer
          </ion-button>
        </div>
      </div>

      <ion-list v-else>
        <ion-item v-for="article in articles" :key="article.id" button detail :router-link="`/news/${article.id}`" router-direction="forward">
          <ion-label>
            <h2 class="article-title">{{ article.title }}</h2>
            <p>{{ article.author }} • {{ formatDate(article.published_at) }}</p>

            <ion-badge class="slug-badge">
              {{ article.slug }}
            </ion-badge>

            <ion-badge color="light" v-if="isNew(article.published_at)"> Nouveau </ion-badge>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonButton, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline } from "ionicons/icons"

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const hasFetched = ref(false)

function formatDate(isoString) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString))
}

function isNew(isoString) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return new Date(isoString) > sevenDaysAgo
}

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

onIonViewWillEnter(() => {
  if (!hasFetched.value) fetchArticles()
})
</script>

<style scoped>
ion-item {
  --padding-start: 16px;
}

ion-label {
  min-width: 0;
}

h2.article-title {
  font-weight: 400;
  margin-bottom: 4px;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

p {
  margin: 0;
  opacity: 0.7;
  font-size: 0.9em;
}

ion-badge {
  margin-top: 6px;
  margin-right: 4px;
}

.slug-badge {
  --background: var(--ion-color-primary-tint);
  --color: var(--ion-color-primary-contrast);
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
