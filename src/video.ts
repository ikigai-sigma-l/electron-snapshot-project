import { attachCrystalPlayer } from './useCrystalPlayer'

export function createVideoElement(): HTMLElement {
  const container = document.createElement('div')
  container.id = 'video'
  container.className = 'video-slot'

  // Deferred: the player needs the container mounted with real layout size,
  // but this function returns it before the caller appends it to the DOM.
  queueMicrotask(() => attachCrystalPlayer(container))

  return container
}
