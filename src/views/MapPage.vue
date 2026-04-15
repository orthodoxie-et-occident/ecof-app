<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Lieux de culte</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="map-content" :scroll-y="false">
      <div ref="mapContainer" class="map-container" :class="{ ready: mapReady }"></div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, onIonViewWillEnter } from "@ionic/vue"
import maplibregl from "maplibre-gl"

const mapContainer = ref(null)
const mapReady = ref(false)
let map = null

onIonViewWillEnter(() => {
  if (map) {
    map.resize()
    return
  }

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/aquarelle-v4/style.json?key=294yWgnaRBKFUoffyMVB`,
    center: [2.35, 48.85],
    zoom: 5,
  })

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }))
  map.dragRotate.disable()
  map.touchZoomRotate.disableRotation()

  map.on("load", () => {
    map.resize()
    requestAnimationFrame(() => {
      mapReady.value = true
    })
  })
})
</script>

<style scoped>
.map-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.map-container.ready {
  opacity: 1;
}

ion-content::part(scroll) {
  height: 100%;
}
</style>
