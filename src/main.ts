import './style.css'
import { createVideoElement } from './video'
import { createImageElement } from './image'

const container = document.createElement('div')
container.className = 'media-container'

const { element: imageElement, button: imageButton } = createImageElement()
container.append(createVideoElement(), imageElement)

document.querySelector<HTMLDivElement>('#app')!.append(container, imageButton)
