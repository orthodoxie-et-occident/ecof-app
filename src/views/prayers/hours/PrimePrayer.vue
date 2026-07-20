<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/prayers/hours"></ion-back-button>
        </ion-buttons>
        <ion-title>Prime</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="state-container">
        <ion-icon :icon="documentTextOutline" class="state-icon" />
        <p>Office non disponible</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonButtons, IonBackButton, IonToolbar, IonTitle, IonContent, IonIcon } from "@ionic/vue"

import { documentTextOutline } from "ionicons/icons"
</script>

<style scoped>
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 12px;
  color: #888;
}

.state-icon {
  font-size: 64px;
  opacity: 0.3;
}
</style>
