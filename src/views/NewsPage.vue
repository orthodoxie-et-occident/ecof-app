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

    <ion-content class="ion-padding">
      <div v-if="loading" class="state-container">
        <ion-spinner color="primary"></ion-spinner>
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="state-container">
        <ion-icon :icon="cloudOfflineOutline" class="error-icon"></ion-icon>
        <p class="error-title">Connexion impossible</p>
        <ion-button fill="outline" color="primary" @click="fetchArticles">
          <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
          Réessayer
        </ion-button>
      </div>

      <div v-else class="news-feed">
        <router-link v-for="article in articles" :key="article.id" :to="`/news/${article.id}`" class="news-card">
          <div class="news-card-header">
            <ion-badge class="badge-slug">{{ article.slug }}</ion-badge>
            <ion-badge class="badge-new" v-if="isNew(article.published_at)">Nouveau</ion-badge>
          </div>
          <h2 class="news-title">{{ article.title }}</h2>
          <p class="news-meta">
            <span class="news-author">{{ article.author }}</span>
            <span class="news-date">{{ formatDate(article.published_at) }}</span>
          </p>
        </router-link>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonBadge, IonSpinner, IonButton, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline } from "ionicons/icons"

const articles = ref([])
const loading = ref(true)
const error = ref(null)
let hasFetched = false

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
const formatDate = (iso) => dateFormatter.format(new Date(iso))

const isNew = (iso) => new Date(iso).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000

async function fetchArticles() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch("https://api.ecof.app/news")
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    articles.value = await res.json()
    hasFetched = true
  } catch (err) {
    console.error(err.message)
    error.value = true
  } finally {
    loading.value = false
  }
}

onIonViewWillEnter(() => {
  if (!hasFetched) fetchArticles()
})
</script>

<style scoped>
.news-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-card {
  display: block;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--ion-color-light);
  text-decoration: none;
  color: inherit;
}

.news-card:active {
  background: var(--ion-color-light-shade);
}

.news-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.badge-slug {
  --background: rgba(var(--ion-color-primary-rgb), 0.22);
  --color: var(--ion-color-primary-shade);
  font-weight: 600;
}

.badge-new {
  --background: rgba(var(--ion-color-danger-rgb), 0.15);
  --color: var(--ion-color-danger);
  font-weight: 600;
}

.news-title {
  margin: 0 0 4px;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
}

.news-meta {
  margin: 0;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}

.news-author {
  font-weight: 600;
  color: var(--ion-color-dark);
}

.news-date::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--ion-color-medium);
  opacity: 0.6;
  margin: 0 6px;
  vertical-align: middle;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 12px;
  padding: 2rem;
  text-align: center;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
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
