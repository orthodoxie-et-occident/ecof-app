<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/articles"></ion-back-button>
        </ion-buttons>
        <ion-title>Articles</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item button v-for="article in articles" :key="article.id" :router-link="article.route" router-direction="forward" detail>
          <ion-label>
            <!-- TITRE -->
            <h2>{{ article.titre }}</h2>

            <!-- AUTEUR + DATE -->
            <p>👤 {{ article.auteur }} • 📅 {{ article.date }}</p>

            <!-- SLUG (pastille) -->
            <ion-badge color="medium">
              {{ article.slug }}
            </ion-badge>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge } from "@ionic/vue"

const articles = [
  {
    id: 1,
    titre: "Premier article",
    auteur: "Alice Martin",
    date: "15/05/2026",
    slug: "premier-article",
    route: "/articles/premier-article",
  },
  {
    id: 2,
    titre: "Deuxième article",
    auteur: "Bob Dupont",
    date: "14/05/2026",
    slug: "deuxieme-article",
    route: "/articles/deuxieme-article",
  },
  {
    id: 3,
    titre: "Troisième article",
    auteur: "Admin",
    date: "12/05/2026",
    slug: "troisieme-article",
    route: "/articles/troisieme-article",
  },
]
</script>

<style scoped>
ion-item {
  --padding-start: 16px;
}

h2 {
  font-weight: 600;
  margin-bottom: 4px;
}

p {
  margin: 0;
  opacity: 0.7;
  font-size: 0.9em;
}

ion-badge {
  margin-top: 6px;
}
</style>
