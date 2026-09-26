import { App } from "@capacitor/app"
import { Browser } from "@capacitor/browser"
import { Capacitor } from "@capacitor/core"
import { compare } from "compare-versions"
import { alertController } from "@ionic/vue"

const API_URL = "https://api-v2.ecof.app/version"

export async function checkForUpdate() {
  const platform = Capacitor.getPlatform()
  if (platform !== "ios" && platform !== "android") return

  try {
    const [appInfo, versions] = await Promise.all([App.getInfo(), fetch(`${API_URL}`).then((r) => r.json())])

    const info = versions[platform]
    if (!info) return

    const isOutdated = compare(appInfo.version, info.latestVersion, "<")
    if (!isOutdated) return

    const alert = await alertController.create({
      header: "Mise à jour",
      message: `Vous êtes sur la version ${appInfo.version} et la version ${info.latestVersion} est maintenant disponible.`,
      buttons: [
        { text: "Plus tard", role: "cancel" },
        { text: "Mettre à jour", handler: () => Browser.open({ url: info.storeUrl }) },
      ],
    })
    await alert.present()
  } catch (e) {
    console.error("Version check failed", e)
  }
}
