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
  gap: 14px;
}

/* Card façon papier : coins carrés + coin haut droit corné, teinte chaleureuse */
.news-card {
  display: block;
  position: relative;
  padding: 16px 20px 14px;
  border-radius: 3px;
  background: #f8f1e4;
  text-decoration: none;
  color: inherit;
  box-shadow:
    0 1px 2px rgba(120, 90, 50, 0.08),
    0 3px 8px rgba(120, 90, 50, 0.08);
  /* on "coupe" le coin haut droit pour laisser place au pli */
  clip-path: polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%);
  transition: box-shadow 0.15s ease;
  overflow: hidden;
}

.news-card:active {
  background: #f1e7d4;
  box-shadow: 0 1px 2px rgba(120, 90, 50, 0.1);
}

/* Ombre projetée par le pli sur la card, pour donner du volume */
.news-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 34px;
  height: 34px;
  background: radial-gradient(circle at top right, rgba(101, 78, 46, 0.28), transparent 72%);
  z-index: 0;
}

/* Le rabat replié : dégradé clair -> foncé pour simuler l'épaisseur du papier + ombre portée */
.news-card::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 26px;
  height: 26px;
  background: linear-gradient(225deg, #fffaf0 0%, #ecdfc4 45%, #d7c39d 100%);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  box-shadow: -2px 2px 3px rgba(101, 78, 46, 0.3);
  z-index: 1;
}

.news-card-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding-right: 18px; /* évite que les badges touchent le pli */
}

.badge-slug {
  --background: rgba(var(--ion-color-primary-rgb), 0.22);
  --color: var(--ion-color-primary-shade);
  font-weight: 600;
  border-radius: 3px;
}

.badge-new {
  --background: rgba(var(--ion-color-danger-rgb), 0.15);
  --color: var(--ion-color-danger);
  font-weight: 600;
  border-radius: 3px;
}

/* Titre moins gras et moins imposant */
.news-title {
  margin: 0 0 6px;
  font-size: 1.08rem;
  font-weight: 600;
  line-height: 1.32;
  letter-spacing: 0;
  color: var(--ion-color-dark);
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
