class TrainManager {
  constructor(map, layerManager) {
    this.trains = new Map()
    this.map = map
    this.control = L.control.trainList(layerManager).addTo(map)
  }

  update(trains) {
    const thisTrains = new Map()
    let changed = false

    trains.forEach((t) => {
      thisTrains.set(t.id, t)
      if (this.trains.has(t.id)) {
        if(distance(this.trains.get(t.id).cars[0].leading.location, t.cars[0].leading.location) > 10){
          this.trains.set(t.id, t)
          this.control.update(t.id, t)
        }
      } else {
        this.trains.set(t.id, t)
        this.control.add(t.id, t)
        changed = true
      }
    })

    this.trains.forEach((train, id) => {
      if (!thisTrains.has(id)) {
        this.trains.delete(id)
        this.control.remove(id)
        changed = true
      }
    })

    if(changed) {
      this.control.reorder()
    }
  }
}

function distance(vector1, vector2) {
  const dx = vector1.x - vector2.x;
  const dy = vector1.y - vector2.y;
  const dz = vector1.z - vector2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}