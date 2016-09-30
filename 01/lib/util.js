export const loop = fn => {
  const wrap = t => {
    requestAnimationFrame(wrap)
    fn(t)
  }

  requestAnimationFrame(wrap)
}
