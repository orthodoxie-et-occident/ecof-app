import createVerovioModule from "verovio/wasm"
import { VerovioToolkit } from "verovio/esm"

let toolkitPromise = null

export function getVerovioToolkit() {
  if (!toolkitPromise) {
    toolkitPromise = createVerovioModule().then((mod) => new VerovioToolkit(mod))
  }
  return toolkitPromise
}
