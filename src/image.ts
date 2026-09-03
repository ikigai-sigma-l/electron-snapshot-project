export function createImageElement(): { element: HTMLElement; button: HTMLButtonElement } {
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

  const button = document.createElement('button')
  button.className = 'load-image-button'
  button.textContent = 'snapshot'

  const setLoaded = (loaded: boolean) => {
    wrapper.classList.toggle('is-loaded', loaded)
    button.textContent = loaded ? 'clear' : 'snapshot'
  }

  const load = async () => {
    const result = await window.imageAPI.load()
    if (!result.exists) return

    img.src = result.dataUrl!
    setLoaded(true)
  }

  const clear = () => {
    img.src = ''
    setLoaded(false)
  }

  button.addEventListener('click', () => {
    if (wrapper.classList.contains('is-loaded')) {
      clear()
    } else {
      load()
    }
  })

  return { element: wrapper, button }
}
