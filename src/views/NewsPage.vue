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
        <ion-item button v-for="category in categoriesWithStats" :key="category.slug_id" @click="openCategory(category)" detail>
          <ion-icon :icon="category.icon" slot="start" color="primary"></ion-icon>
          <ion-label>
            <h2>{{ category.label }}</h2>
            <p>{{ category.count }} annonce{{ category.count > 1 ? "s" : "" }}</p>
          </ion-label>
          <ion-badge slot="end" class="new-badge" v-if="category.newCount > 0">+{{ category.newCount }}</ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed } from "vue"
import { useIonRouter } from "@ionic/vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonButton, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { cloudOfflineOutline, refreshOutline } from "ionicons/icons"
import { useArticles, isNew } from "../composables/useArticles"
import { categoryMap } from "../composables/categories"

const ionRouter = useIonRouter()
const { articles, loading, error, hasFetched, fetchArticles } = useArticles()

// Calcule, pour chaque catégorie connue, son nombre d'articles, son nombre de nouveautés et sa dernière mise à jour
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
        newCount: catArticles.filter((a) => isNew(a.published_at)).length,
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
.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.new-badge {
  --background: #fff2cc;
  --color: #6b5400;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid #e8c766;
  border-radius: 10px;
  padding: 5px 10px;
  margin-inline-end: 6px;
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
