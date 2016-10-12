
// wrappers around sylvester with homogenous coord stuff

// hacky m3 -> m4
const toHom = (m) =>
  $M(
    m.elements
      .map(r => r.concat([0]))
      .concat([[0,0,0,1]])
  )


export const translate = (x,y,z) =>
  $M([
    [1,0,0,x],
    [0,1,0,y],
    [0,0,1,z],
    [0,0,0,1]
  ])

export const scale = (s) =>
  Matrix.Diagonal([s,s,s,1])

export const rotateX = a =>
  toHom(Matrix.RotationX(a))

export const rotateY = a =>
  toHom(Matrix.RotationY(a))

export const perspective = p =>
  $M([
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,p,1-p]
  ])

export const I = Matrix.I(4)
