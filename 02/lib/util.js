export const loop = fn => {
  const wrap = t => {
    requestAnimationFrame(wrap)
    fn(t)
  }

  requestAnimationFrame(wrap)
}


export const rnd = n =>
  (Math.random()-.5) * n * 2
