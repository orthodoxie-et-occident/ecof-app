<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/prayers/miscellaneous"></ion-back-button>
        </ion-buttons>
        <ion-title>Notre-Père</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="rich-text">
        <h1>Notre-Père</h1>
        <p>
          Notre Père qui es aux cieux, que Ton Nom soit sanctifié, que Ton Règne arrive, que Ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd'hui notre Pain substantiel, et
          remets-nous nos dettes comme nous remettons à nos débiteurs, et ne nous soumets pas à l'épreuve, mais délivre-nous du malin.
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/vue"
</script>
