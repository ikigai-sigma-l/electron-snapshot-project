import './style.css'
import { createVideoElement } from './video'
import { createImageElement } from './image'

const container = document.createElement('div')
container.className = 'media-container'
container.append(createVideoElement(), createImageElement())

document.querySelector<HTMLDivElement>('#app')!.append(container)
