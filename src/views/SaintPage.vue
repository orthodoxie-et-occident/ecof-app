<template>
  <ion-tabs>
    <ion-tab tab="saints">
      <ion-page id="saints-page">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>Vie brève</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="loading" class="loading-container">
            <ion-spinner></ion-spinner>
          </div>
          <div v-else-if="saintData?.vie_b" class="example-content">
            {{ saintData.vie_b }}
          </div>
          <div v-else class="no-content">
            <ion-icon :src="fileTextIcon" size="large"></ion-icon>
            <p>Aucune vie brève disponible</p>
          </div>
        </ion-content>
      </ion-page>
    </ion-tab>

    <ion-tab tab="synaxar">
      <ion-page id="synaxar-page">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>Vie synaxaire</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="loading" class="loading-container">
            <ion-spinner></ion-spinner>
          </div>
          <div v-else-if="saintData?.vita_long" class="example-content">
            {{ saintData.vita_long }}
          </div>
          <div v-else class="no-content">
            <ion-icon :src="bookAIcon" size="large"></ion-icon>
            <p>Aucune vie synaxaire disponible</p>
          </div>
        </ion-content>
      </ion-page>
    </ion-tab>

    <ion-tab tab="liturgy">
      <ion-page id="liturgy-page">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>Vie liturgique</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="loading" class="loading-container">
            <ion-spinner></ion-spinner>
          </div>
          <div v-else-if="saintData?.vita_liturgy" class="example-content">
            {{ saintData.vita_liturgy }}
          </div>
          <div v-else class="no-content">
            <ion-icon :src="scrollTextIcon" size="large"></ion-icon>
            <p>Aucune vie liturgique disponible</p>
          </div>
        </ion-content>
      </ion-page>
    </ion-tab>

    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="saints" :disabled="!saintData?.vie_b && !loading">
        <ion-icon :src="fileTextIcon"></ion-icon>
        Vie brève
      </ion-tab-button>

      <ion-tab-button tab="synaxar" :disabled="!saintData?.vita_long && !loading">
        <ion-icon :src="bookAIcon"></ion-icon>
        Vie synaxaire
      </ion-tab-button>

      <ion-tab-button tab="liturgy" :disabled="!saintData?.vita_liturgy && !loading">
        <ion-icon :src="scrollTextIcon"></ion-icon>
        Vie liturgique
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTab,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonSpinner
} from '@ionic/vue';

import fileTextIcon from '@/assets/icons/file-text.svg';
import bookAIcon from '@/assets/icons/book-a.svg';
import scrollTextIcon from '@/assets/icons/scroll-text.svg';

const route = useRoute();
const saintData = ref(null);
const loading = ref(true);

const fetchSaintData = async () => {
  loading.value = true;
  try {
    const saintId = route.params.id;
    const response = await fetch(`https://ecof-api-production.up.railway.app/api/vita/${saintId}`);
    const data = await response.json();
    saintData.value = data;
  } catch (error) {
    console.error('Erreur lors du chargement des données du saint:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSaintData();
});
</script>

<style scoped>
.example-content {
  line-height: 1.8;
  text-align: justify;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.no-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--ion-color-medium);
  text-align: center;
}

.no-content ion-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-content p {
  margin: 0;
  font-size: 0.95rem;
}
</style>