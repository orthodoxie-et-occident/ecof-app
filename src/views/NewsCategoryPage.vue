<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/news"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ categoryLabel }}</ion-title>
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

      <div v-else-if="categoryArticles.length === 0" class="state-container">
        <p>Aucune annonce dans cette catégorie</p>
      </div>

      <div v-else class="news-list">
        <ion-card v-for="article in categoryArticles" :key="article.id" button @click="openArticle(article)" class="news-card">
          <ion-card-content>
            <div class="card-body">
              <div class="card-main">
                <div class="badges-row">
                  <ion-badge class="new-badge" v-if="isNew(article.published_at)">Nouveau</ion-badge>
                </div>

                <h2 class="article-title">{{ article.title }}</h2>
                <p class="article-meta">{{ article.author }} • {{ formatDate(article.published_at) }}</p>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useIonRouter } from "@ionic/vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardContent, IonBadge, IonSpinner, IonButton, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline } from "ionicons/icons"
import { useArticles, isNew } from "../composables/useArticles"
import { getCategoryLabel } from "../composables/categories"

const route = useRoute()
const ionRouter = useIonRouter()
const { articles, loading, error, hasFetched, fetchArticles } = useArticles()

const slugId = computed(() => Number(route.params.slugId))
const categoryLabel = computed(() => getCategoryLabel(slugId.value))

const categoryArticles = computed(() => articles.value.filter((a) => (a.slug_id ?? 0) === slugId.value))

function formatDate(isoString) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString))
}

function openArticle(article) {
  ionRouter.push({
    name: "NewsDetail",
    params: { id: article.id },
    query: { label: categoryLabel.value },
  })
}

onIonViewWillEnter(() => {
  if (!hasFetched.value) fetchArticles()
})
</script>

<style scoped>
.news-list {
  padding: 12px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.news-card {
  margin: 0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.news-card ion-card-content {
  padding: 14px 16px;
}

.card-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.card-main {
  flex: 1;
  min-width: 0;
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  min-height: 20px;
}

.new-badge {
  --background: #fff2cc;
  --color: #8a6d00;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 4px 8px;
}

.article-title {
  font-size: 15px;
  line-height: 1.3;
  font-weight: 600;
  color: var(--ion-color-dark, #1a1a1a);
  margin: 0 0 4px;
  white-space: normal;
  overflow-wrap: break-word;
}

.article-meta {
  margin: 0;
  font-size: 0.85em;
  opacity: 0.7;
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
