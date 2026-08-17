import { helpCircleOutline, documentTextOutline, calendarOutline, phonePortraitOutline } from "ionicons/icons"

// Mapping des catégories connues (slug_id renvoyé par l'API)
export const categoryMap = {
  0: { label: "Général", icon: helpCircleOutline },
  1: { label: "Enseignement", icon: documentTextOutline },
  2: { label: "Agenda", icon: calendarOutline },
  3: { label: "Application", icon: phonePortraitOutline },
}

export function getCategory(slug_id) {
  return categoryMap[slug_id] ?? categoryMap[0]
}

export function getCategoryIcon(slug_id) {
  return getCategory(slug_id).icon
}

export function getCategoryLabel(slug_id) {
  return getCategory(slug_id).label
}
