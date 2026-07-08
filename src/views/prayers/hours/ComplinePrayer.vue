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
      <div v-html="withPriest ? preparationWithPriest : preparationWithoutPriest"></div>

      <h2>Ouverture</h2>
      <p><em>Face au sanctuaire, le préchantre chante :</em></p>
      <p>V : O Dieu, viens a mon aide.</p>
      <p>R : Seigneur, hâte toi de me secourir.</p>
      <p>V : Gloire au Père et au Fils et au Saint-Esprit,</p>
      <p>R : Comme il était au commencement et maintenant et toujours, et aux siècles des siècles. Amen.</p>

      <h2>Psalmodie</h2>
      <h3>Antienne</h3>
      <p>Aie pitié de moi, Seigneur, exauce ma prière.</p>
      <h3>Psaume 4</h3>
      <h3>Psaume 91</h3>
      <h3>Psaume 134</h3>
      <h3>Antienne</h3>
      <p>Aie pitié de moi, Seigneur, exauce ma prière.</p>

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
Mon pere, veuille me benir
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
  return `Office de Complies (célébré le ${nomSoir} soir)`
})
</script>

<style scoped>
h2 {
  text-align: center;
  text-transform: uppercase;
  border: 1px solid var(--ion-color-primary, #333);
  border-radius: 4px;
  padding: 8px 16px;
  margin: 24px 0 12px;
}
</style>
