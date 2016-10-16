
// expensive, but pure-ish,
// (could be pre-computed)

const layerForce = (data) => {

  const z = d3.scaleLinear()
    .domain([0,data.length])
    .range([-1,4])

  const r = d3.scaleLinear()
    .range([0,1.2])

  const cache = {}

  const layers = data.map( (attendees, i) => {

    const nodes = attendees
      .map(a => {
        if(cache[a]) {
          return {
            _id: a,
            x: cache[a].x,
            y: cache[a].y
          }
        } else {
          return {
            _id: a
          }
        }
      })

    const simulation = d3.forceSimulation(nodes)
          .force('collide', d3.forceCollide(4))
          .force('attract', d3.forceManyBody().strength(.1))

    simulation.stop()
    for (var c = 0; c < 50; c++) {
      simulation.tick()
    }

    r.domain(
      d3.extent(nodes.map(n => Math.abs(n.x)))
    )

    nodes.forEach(n => {
      cache[n._id] = {
        x: n.x,
        y: n.y
      }

    })

    const clean = nodes.map(n => ({
      _id: n._id,
      x: r(n.x),
      z: r(n.y),
      y: z(i) + Math.random()*.1,
      r: r(2)
    }))

    return clean;

  })

  const links = []

  for (var l = 0; l < layers.length - 1; l++) {
    layers[l].forEach( a => {
      layers[l+1].forEach( b => {
        if(a._id === b._id) {
          links.push([a,b])
        }
      })
    })

  }

  return {
    layers,
    links
  }

}

export default layerForce
