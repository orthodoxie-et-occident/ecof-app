<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>À propos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="about-content">
        <section class="about-section">
          <h2>Ressources</h2>
          <p>
            Les ressources utilisées pour cette application s'appuient sur la tradition liturgique de l'<a href="https://eglise-catholique-orthodoxe-de-france.fr/" target="_blank"
              >Église catholique orthodoxe de France</a
            >.
          </p>
          <p>Les lectures quotidiennes font usage de traductions libres de droits de la Bible&nbsp;:</p>
          <ul>
            <li><em>Bible Segond 1910</em>, en utilisant le vocable «&nbsp;le Seigneur&nbsp;» de préférence à «&nbsp;l'Éternel&nbsp;».</li>
            <li><em>Bible Crampon 1923</em>, pour certains livres de l'Ancien Testament absents des Bibles protestantes, en remplaçant le vouvoiement de Dieu par le tutoiement.</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>Bibliothèques</h2>
          <p>
            Le rendu des partitions musicales de cette application s'appuie sur
            <a href="https://www.verovio.org/" target="_blank">Verovio</a>, une bibliothèque open-source de gravure musicale développée par le
            <a href="https://rism.digital/" target="_blank">RISM Digital Center</a>, distribuée sous <a href="https://www.gnu.org/licenses/lgpl-3.0.html" target="_blank">licence LGPL v3</a>.
          </p>
          <p>
            Le code source de Verovio est disponible sur
            <a href="https://github.com/rism-digital/verovio" target="_blank">GitHub</a>.
          </p>
        </section>

        <section class="about-section">
          <h2>Contribuer</h2>
          <p>Le contenu de l'application s'enrichit continuellement, toutes les contributions sont les bienvenues, notamment des ressources libres de droits sur la vie des saints.</p>
        </section>

        <section class="about-section">
          <h2>Contact</h2>
          <p>Pour toute question, suggestion ou contribution vous pouvez nous contacter à l'adresse <a href="mailto:contact@ecof.app">contact@ecof.app</a></p>
        </section>

        <p class="version">Version 3.5.5</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from "@ionic/vue"
</script>

<style scoped>
.about-content {
  padding: 20px 20px 8px;
  max-width: 640px;
  margin: 0 auto;
}

.about-section {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.about-section:last-of-type {
  border-bottom: none;
}

.about-section h2 {
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--ion-color-primary-shade, var(--ion-color-primary));
  margin: 0 0 10px;
}

.about-section p,
.about-section li {
  font-size: 16px;
  line-height: 1.6;
}

.about-section p {
  margin: 0 0 12px;
}

.about-section p:last-child {
  margin-bottom: 0;
}

.about-section ul,
.about-section ol {
  padding-left: 20px;
  margin: 8px 0 0;
}

a {
  color: var(--ion-color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.version {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  margin-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
}
</style>
