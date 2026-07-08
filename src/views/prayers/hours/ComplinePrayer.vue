<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/prayers/hours"></ion-back-button>
        </ion-buttons>
        <ion-title>Complies</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>{{ titreOffice }}</h1>
      <ion-toggle v-model="withPriest" label-placement="start">Avec prêtre</ion-toggle><br /><br />

      <h2>Préparation</h2>
      <p v-html="withPriest ? preparationWithPriest : preparationWithoutPriest"></p>

      <h2>Ouverture</h2>
      <h2>Psalmodie</h2>
      <h2>Hymne</h2>
      <h2>Répons bref</h2>
      <h2>Capitule</h2>
      <h2>Répons long</h2>
      <h2>Nunc Dimittis</h2>
      <h2>Trisagion</h2>
      <h2>Notre-Père</h2>
      <h2>Clôture</h2>
      <h2>Hymne a la Vierge</h2>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { IonPage, IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent, IonToggle } from "@ionic/vue"

const withPriest = ref(false)

const preparationWithPriest = `
<p>Mon pere, veuille me benir</p>
`

const preparationWithoutPriest = `
<p>Lecteur : Que le Dieu Tout-Puissant nous accorde une nuit tranquille et une fin heureuse.</p>
<p>R : Amen.</p>
`

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]

const route = useRoute()

function parseISO(str) {
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

const jourSoir = computed(() => {
  return route.query.date ? parseISO(route.query.date) : new Date()
})

const jourLiturgique = computed(() => {
  const d = new Date(jourSoir.value)
  d.setDate(d.getDate() + 1)
  return d
})

const titreOffice = computed(() => {
  const nomLiturgique = JOURS[jourLiturgique.value.getDay()]
  const nomSoir = JOURS[jourSoir.value.getDay()]
  return `Office de Complies du ${nomLiturgique} (célébré le ${nomSoir} soir)`
})
</script>
