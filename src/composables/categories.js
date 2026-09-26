import { helpCircleOutline, calendarOutline, phonePortraitOutline } from "ionicons/icons"
import crozierIcon from "../assets/icons/crozier.svg"

export const categoryMap = {
  0: { label: "Général", icon: helpCircleOutline },
  1: { label: "Homélies", iconSrc: crozierIcon },
  2: { label: "Agenda", icon: calendarOutline },
  3: { label: "Application", icon: phonePortraitOutline },
}

function getCategory(slug_id) {
  return categoryMap[slug_id] ?? categoryMap[0]
}

export function getCategoryLabel(slug_id) {
  return getCategory(slug_id).label
}
