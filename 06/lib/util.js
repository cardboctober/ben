export const loop = fn => {
  const wrap = t => {
    requestAnimationFrame(wrap)
    fn(t)
  }

  requestAnimationFrame(wrap)
}


export const rnd = n =>
  (Math.random()-.5) * n * 2

export const fill = (array, fn) => {
  for (var i = 0; i < array.length; i++) {
    array[i] = fn(i)
  }
}

// deal with weird mod behaviour
// export const wrap = (v, min, max) =>
