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

      <!-- Bottom card -->
      <transition name="slide-up">
        <div v-if="selectedPoi" class="poi-card" @click="selectedPoi = null">
          <div class="poi-card-handle"></div>
          <div class="poi-card-body">
            <ion-icon :icon="locationOutline" class="poi-icon"></ion-icon>
            <div class="poi-info">
              <p class="poi-name">{{ selectedPoi.name }}</p>
              <p class="poi-hint">Appuie pour fermer</p>
            </div>
          </div>
        </div>
      </transition>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue"
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonIcon, onIonViewWillEnter } from "@ionic/vue"
import { locationOutline } from "ionicons/icons"
import maplibregl from "maplibre-gl"

const mapContainer = ref(null)
const mapReady = ref(false)
const selectedPoi = ref(null)
let map = null

async function loadPoi() {
  const res = await fetch("https://ecof-api-production.up.railway.app/api/map-data")
  if (!res.ok) throw new Error("Erreur API")
  return res.json()
}

function addPoiLayer(poi) {
  const geojson = {
    type: "FeatureCollection",
    features: poi.map(({ name, latitude, longitude }) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [longitude, latitude] },
      properties: { name },
    })),
  }

  map.addSource("poi", { type: "geojson", data: geojson })

  map.addLayer({
    id: "poi-circles",
    type: "circle",
    source: "poi",
    paint: {
      "circle-radius": 7,
      "circle-color": "#6366f1",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  })

  map.on("click", "poi-circles", (e) => {
    selectedPoi.value = e.features[0].properties
    map.flyTo({ center: e.features[0].geometry.coordinates, zoom: Math.max(map.getZoom(), 12) })
  })

  map.on("click", (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ["poi-circles"] })
    if (!features.length) selectedPoi.value = null
  })

  map.on("mouseenter", "poi-circles", () => (map.getCanvas().style.cursor = "pointer"))
  map.on("mouseleave", "poi-circles", () => (map.getCanvas().style.cursor = ""))
}

onIonViewWillEnter(() => {
  if (map) {
    map.resize()
    return
  }

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: "https://api.maptiler.com/maps/aquarelle-v4/style.json?key=294yWgnaRBKFUoffyMVB",
    center: [2.35, 48.85],
    zoom: 5,
  })

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }))
  map.dragRotate.disable()
  map.touchZoomRotate.disableRotation()

  map.on("load", async () => {
    map.resize()
    try {
      const poi = await loadPoi()
      addPoiLayer(poi)
    } catch (e) {
      console.error("Erreur chargement POI:", e)
    }
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
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.map-container.ready {
  opacity: 1;
}

ion-content::part(scroll) {
  height: 100%;
}

/* Bottom card */
.poi-card {
  position: absolute;
  bottom: 24px;
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 16px;
  padding: 12px 16px 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  z-index: 100;
  cursor: pointer;
}

.poi-card-handle {
  width: 36px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 0 auto 12px;
}

.poi-card-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.poi-icon {
  font-size: 28px;
  color: #6366f1;
  flex-shrink: 0;
}

.poi-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.poi-hint {
  margin: 2px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

/* Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
