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
      <div ref="mapContainer" class="map-container"></div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, onIonViewWillEnter } from "@ionic/vue"

import maplibregl from "maplibre-gl"

const mapContainer = ref(null)
let map = null

onMounted(async () => {
  await nextTick()

  map = new maplibregl.Map({
    container: mapContainer.value,

    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm",
          type: "raster",
          source: "osm",
        },
      ],
    },

    center: [2.35, 48.85],
    zoom: 5,
  })

  map.addControl(
    new maplibregl.NavigationControl({
      showCompass: false,
    }),
  )

  map.dragRotate.disable()
  map.touchZoomRotate.disableRotation()

  map.on("load", () => {
    setTimeout(() => {
      map.resize()
    }, 100)
  })
})

onIonViewWillEnter(() => {
  setTimeout(() => {
    if (map) map.resize()
  }, 100)
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
}

ion-content::part(scroll) {
  height: 100%;
}
</style>
