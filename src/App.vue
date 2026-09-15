<template>
  <ion-app>
    <ion-menu content-id="main-content">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-menu-toggle auto-hide="false" v-for="item in menuItems" :key="item.route">
            <ion-item button :router-link="item.route" router-direction="root">
              <ion-label class="menu-label">{{ item.label }}</ion-label>
              <ion-badge v-if="item.route === '/news' && newsUnreadCount > 0" color="danger" class="menu-badge" slot="end">
                {{ newsUnreadCount }}
              </ion-badge>
              <img slot="end" :src="item.image" :alt="item.label" class="menu-img" />
            </ion-item>
          </ion-menu-toggle>
        </ion-list>
      </ion-content>
    </ion-menu>
    <ion-router-outlet id="main-content" />
  </ion-app>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { IonApp, IonRouterOutlet, IonMenu, IonMenuToggle, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBadge, useBackButton, useIonRouter } from "@ionic/vue"
import { App } from "@capacitor/app"
import { useArticles } from "./composables/useArticles"
import { useReadNews } from "./composables/useReadNews"
import synaxarImage from "@/assets/img/layout/saints.png"
import parishImage from "@/assets/img/layout/ange.png"
import newsImage from "@/assets/img/layout/ange-b.png"
import aboutImage from "@/assets/img/layout/about.png"
import prayerImage from "@/assets/img/layout/seraphim.png"
import mapImage from "@/assets/img/layout/pins.png"
import calendarImage from "@/assets/img/layout/christ.png"

const menuItems = [
  { label: "Paroisses", route: "/", image: parishImage },
  { label: "Calendrier", route: "/calendar", image: calendarImage },
  { label: "Annonces", route: "/news", image: newsImage },
  { label: "Prières", route: "/prayers", image: prayerImage },
  { label: "Synaxaire", route: "/synaxar", image: synaxarImage },
  { label: "Carte", route: "/map", image: mapImage },
  { label: "À propos", route: "/about", image: aboutImage },
]

const ionRouter = useIonRouter()

const { articles, hasFetched, fetchArticles } = useArticles()
const { load: loadReadNews, unreadCount, seedFirstLaunch } = useReadNews()

const newsUnreadCount = computed(() => unreadCount(articles.value))

onMounted(async () => {
  await loadReadNews()
  if (!hasFetched.value) await fetchArticles()
  if (hasFetched.value) await seedFirstLaunch(articles.value)
})

useBackButton(10, () => {
  const path = ionRouter.route?.value?.path || window.location.pathname

  // 1. EXIT UNIQUEMENT SUR HOME
  if (path === "/") {
    App.exitApp()
    return
  }

  // 2. BACK IONIC PROPRE
  if (ionRouter.canGoBack()) {
    ionRouter.back()
    return
  }

  // 3. FALLBACK SAFE (évite blocage)
  ionRouter.push("/")
})
</script>

<style scoped>
ion-menu ion-item {
  --min-height: 80px;
}

.menu-badge {
  margin-inline-end: 6px;
  font-size: 0.75rem;
}

.menu-img {
  height: 70px;
  width: 90px;
  object-fit: contain;
  object-position: center;
}

ion-menu :deep(.menu-label) {
  font-size: 1rem;
}
</style>
