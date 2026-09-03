import { attachCrystalPlayer } from './useCrystalPlayer'

export function createVideoElement(): HTMLElement {
  const outer = document.createElement('div')
  outer.id = 'video'
  outer.className = 'video-slot'

  // The actual clipping boundary: inset from `outer` by its padding, so
  // oversized video content gets cropped there instead of painting straight
  // through the padding (an `overflow: hidden` box clips at its own border,
  // padding included, regardless of how much bigger its content is).
  const inner = document.createElement('div')
  inner.className = 'video-slot__inner'
  outer.append(inner)

  // Deferred: the player needs the container mounted with real layout size,
  // but this function returns it before the caller appends it to the DOM.
  queueMicrotask(() => attachCrystalPlayer(inner))

  return outer
}
