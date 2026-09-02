import { config } from '../shared/config'

export function createImageElement(): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'image-slot'

  const img = document.createElement('img')
  img.id = 'image'
  img.className = 'image-slot__img'

  const spinner = document.createElement('div')
  spinner.className = 'image-slot__spinner'
  spinner.setAttribute('role', 'status')
  spinner.setAttribute('aria-label', 'loading')

  wrapper.append(img, spinner)

  let lastMtimeMs: number | null = null

  const poll = async () => {
    const result = await window.imageAPI.poll()

    if (!result.exists) {
      lastMtimeMs = null
      wrapper.classList.remove('is-loaded')
      return
    }

    if (result.mtimeMs === lastMtimeMs) return

    lastMtimeMs = result.mtimeMs!
    img.src = result.dataUrl!
    wrapper.classList.add('is-loaded')
  }

  poll()
  setInterval(poll, config.imageCheckIntervalMs)

  return wrapper
}
