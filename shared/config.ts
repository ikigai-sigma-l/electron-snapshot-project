export const config = {
  /** Absolute path to the snapshot image file to display. Edit to match your environment. */
  imagePath: '/Users/sigma.l/snapshot.png',
  /** FLV/RTC stream URL the Crystal Player loads into the video container. */
  videoStreamUrl: 'http://192.168.20.22:8889/idp/view/whep',
  /**
   * Max tolerated latency (sec) before the player's watchdog ends playback.
   * Default is 2s; this pull endpoint's frame timecode routinely lags the
   * local clock by just over that, which was tripping the watchdog and
   * ending playback right after the first frame rendered.
   */
  videoMaxLatencySec: 10,
}
