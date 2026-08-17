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

      <div v-else class="category-list">
        <ion-card v-for="category in categoriesWithStats" :key="category.slug_id" button @click="openCategory(category)" class="category-card">
          <ion-card-content>
            <div class="card-body">
              <div class="category-icon-wrap">
                <ion-icon :icon="category.icon"></ion-icon>
              </div>

              <div class="card-main">
                <div class="badges-row">
                  <h2 class="category-title">{{ category.label }}</h2>
                  <ion-badge class="new-badge" v-if="category.hasNew">Nouveau</ion-badge>
                </div>
                <p class="category-meta">{{ category.count }} annonce{{ category.count > 1 ? "s" : "" }}</p>
              </div>

              <ion-icon :icon="chevronForwardOutline" class="chevron"></ion-icon>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from "vue"
import { useIonRouter } from "@ionic/vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardContent, IonBadge, IonSpinner, IonButton, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline, chevronForwardOutline } from "ionicons/icons"
import { useArticles, isNew } from "../composables/useArticles"
import { categoryMap } from "../composables/categories"

const ionRouter = useIonRouter()
const { articles, loading, error, hasFetched, fetchArticles } = useArticles()

// Calcule, pour chaque catégorie connue, son nombre d'articles, sa nouveauté et sa dernière mise à jour
// Masque les catégories vides et trie par publication la plus récente en premier
const categoriesWithStats = computed(() => {
  return Object.entries(categoryMap)
    .map(([slug_id, meta]) => {
      const catArticles = articles.value.filter((a) => (a.slug_id ?? 0) === Number(slug_id))
      const lastPublishedAt = catArticles.reduce((latest, a) => {
        const d = new Date(a.published_at)
        return !latest || d > latest ? d : latest
      }, null)

      return {
        slug_id: Number(slug_id),
        label: meta.label,
        icon: meta.icon,
        count: catArticles.length,
        hasNew: catArticles.some((a) => isNew(a.published_at)),
        lastPublishedAt,
      }
    })
    .filter((category) => category.count > 0)
    .sort((a, b) => b.lastPublishedAt - a.lastPublishedAt)
})

function openCategory(category) {
  ionRouter.push({
    name: "NewsCategory",
    params: { slugId: category.slug_id },
  })
}

onIonViewWillEnter(() => {
  if (!hasFetched.value) fetchArticles()
})
</script>

<style scoped>
.category-list {
  padding: 12px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-card {
  margin: 0;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.category-card ion-card-content {
  padding: 14px 16px;
}

.card-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon-wrap {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon-wrap ion-icon {
  font-size: 20px;
  color: var(--ion-color-primary-shade);
}

.card-main {
  flex: 1;
  min-width: 0;
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.category-title {
  font-size: 15px;
  line-height: 1.3;
  font-weight: 600;
  color: var(--ion-color-dark, #1a1a1a);
  margin: 0;
  white-space: normal;
  overflow-wrap: break-word;
}

.new-badge {
  --background: #fff2cc;
  --color: #8a6d00;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 4px 8px;
  flex-shrink: 0;
}

.category-meta {
  margin: 0;
  font-size: 0.85em;
  opacity: 0.7;
}

.chevron {
  flex-shrink: 0;
  font-size: 18px;
  opacity: 0.35;
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
