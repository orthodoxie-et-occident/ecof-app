<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/prayers"></ion-back-button>
        </ion-buttons>
        <ion-title>Office des Heures</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item button v-for="priere in prieres" :key="priere.id" :router-link="priere.disabled ? undefined : priere.route" :detail="!priere.disabled" :disabled="priere.disabled">
          <ion-label>
            <h2>{{ priere.titre }}</h2>
            <p>{{ priere.info }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel } from "@ionic/vue"

const prieres = [
  {
    id: 1,
    titre: "Vêpres",
    info: "",
    route: "/prayers/hours/vespers",
    disabled: true,
  },
  {
    id: 2,
    titre: "Complies",
    info: "",
    route: "/prayers/hours/compline",
    disabled: true,
  },
  {
    id: 3,
    titre: "Nocturnes",
    info: "",
    route: "/prayers/hours/vigils",
    disabled: true,
  },
  {
    id: 4,
    titre: "Laudes",
    info: "",
    route: "/prayers/hours/lauds",
    disabled: true,
  },
  {
    id: 5,
    titre: "Prime",
    info: "",
    route: "/prayers/hours/prime",
    disabled: true,
  },
  {
    id: 6,
    titre: "Tierce",
    info: "",
    route: "/prayers/hours/tierce",
    disabled: true,
  },
  {
    id: 7,
    titre: "Sexte",
    info: "",
    route: "/prayers/hours/sext",
    disabled: true,
  },
  {
    id: 8,
    titre: "None",
    info: "",
    route: "/prayers/hours/none",
    disabled: true,
  },
]
</script>

<style scoped>
ion-item {
  --padding-start: 16px;
}
</style>
