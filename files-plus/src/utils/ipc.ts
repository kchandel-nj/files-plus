export function whenIpcReady(fn: () => void) {
  if (window.ipcRenderer) {
    fn()
  } else {
    const interval = setInterval(() => {
      if (window.ipcRenderer) {
        clearInterval(interval)
        fn()
      }
    }, 50)
  }
}