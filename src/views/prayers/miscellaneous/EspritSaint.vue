<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button
            text=""
            default-href="/prayers/miscellaneous"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Prière à l'Esprit-Saint</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="rich-text">
        <h1>
          Prière quotidienne du saint évêque Jean de Saint-Denis (+1970) à
          l’Esprit Saint
        </h1>
        <p>Ô Esprit Saint, vie de toute vie, âme de mon âme, je t’adore.</p>

        <p>
          Éclaire-moi, guide-moi, fortifie-moi, réjouis-moi, dis-moi,
          inspire-moi ce que je dois faire, ce que je dois dire, donne-moi tes
          ordres.
        </p>

        <p>
          Je te promets de me soumettre à tout ce que tu désires de moi, et
          d’accepter tout ce que tu permets qu’il arrive.
        </p>

        <p>Fais-moi seulement connaître ta volonté, rien que ta volonté.</p>

        <p>Amen.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from "@ionic/vue"
</script>
