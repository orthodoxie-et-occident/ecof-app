<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/news"></ion-back-button>
        </ion-buttons>

        <ion-title>{{ article?.slug ?? "Article" }}</ion-title>
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
          <ion-button fill="outline" color="primary" @click="fetchArticle">
            <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
            Réessayer
          </ion-button>
        </div>
      </div>

      <div v-else-if="article" class="ion-padding">
        <div class="article-container">
          <div class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
          </div>

          <MarkdownSection :html="article.text" class="no-first-h1" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonBadge, IonSpinner, IonButton, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline } from "ionicons/icons"
import MarkdownSection from "@/components/MarkdownSection.vue"

const route = useRoute()

const article = ref(null)
const loading = ref(true)
const error = ref(null)

async function fetchArticle() {
  loading.value = true
  error.value = null
  article.value = null

  try {
    const id = route.params.id
    const res = await fetch(`https://api.ecof.app/news/${id}`)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    article.value = await res.json()
  } catch (err) {
    console.error(err.message)
    error.value = true
  } finally {
    loading.value = false
  }
}

onIonViewWillEnter(fetchArticle)
</script>

<style scoped>
/* Card article façon papier : coins carrés, teinte chaleureuse, coin haut droit corné (cf. NewsPage) */
.article-container {
  max-width: 680px;
  margin: 0 auto;
  position: relative;
  background: #f8f1e4;
  border-radius: 3px;
  padding: 20px 22px 18px;
  box-shadow:
    0 1px 2px rgba(120, 90, 50, 0.08),
    0 3px 8px rgba(120, 90, 50, 0.08);
  clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%);
  overflow: hidden;
}

/* Ombre projetée par le pli */
.article-container::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 38px;
  height: 38px;
  background: radial-gradient(circle at top right, rgba(101, 78, 46, 0.28), transparent 72%);
  z-index: 0;
}

/* Le rabat replié */
.article-container::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: linear-gradient(225deg, #fffaf0 0%, #ecdfc4 45%, #d7c39d 100%);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  box-shadow: -2px 2px 3px rgba(101, 78, 46, 0.3);
  z-index: 1;
}

.article-header {
  position: relative;
  z-index: 2;
  margin-bottom: 1.2rem;
  padding-right: 20px; /* évite que le titre touche le pli */
}

.badge-slug {
  --background: rgba(var(--ion-color-primary-rgb), 0.22);
  --color: var(--ion-color-primary-shade);
  font-weight: 600;
  margin-bottom: 0.6rem;
}

/* Titre un peu plus affirmé qu'un titre de card (h1 de page), mais moins massif que l'original */
.article-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 650;
  line-height: 1.4;
  color: var(--ion-color-dark);
}

/* Masque le h1 dupliqué généré par le markdown (déjà affiché ci-dessus via article.title) */
.no-first-h1 :deep(h1:first-of-type) {
  display: none;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 10px;
  color: var(--ion-color-medium);
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

:deep(h2),
:deep(em) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

:deep(h2)::before,
:deep(em)::before {
  content: "";
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  background: var(--ion-color-primary);
}
</style>
