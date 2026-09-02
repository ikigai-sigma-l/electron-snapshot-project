import { IKGPlayerFactory } from '@ikigaians/ikgplayer'
import { config } from '../shared/config'

export function attachCrystalPlayer(container: HTMLElement) {
  // The installed player ignores this `type` argument entirely and always
  // resolves the real adapter (flv/rtc) from the URL at load() time. It
  // creates its own internal <video> element and mounts it into `container`
  // — passing a pre-existing <video> element instead (as this used to) means
  // that internal element never gets attached to the DOM, so it decodes and
  // "plays" invisibly.
  const player = IKGPlayerFactory.create('flv', {
    container,
  })
  player.setMaxLatency(config.videoMaxLatencySec)
  player.setVolume(0)
  player.on('error', (err) => {
    console.error('Crystal Player error:', err)
  })
  player.load(config.videoStreamUrl).then(() => {
    return player.play()
  }).catch((err) => {
    console.error('Crystal Player failed to load/play stream:', err)
  })

  return () => {
    player.destroy()
  }
}
