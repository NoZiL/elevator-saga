{
  init: (elevators, floors) => {
    const elevator = elevators[0]
    const requestedAtFloor = new Map()

    elevator.on("idle", () => {
      const requested = requestedAtFloor.keys()
      const currentFloor = elevator.currentFloor()

      // TODO: find the highest to go down or lowest to go up
      const firstRequested = requested.next()

      if(!firstRequested.done) {
        elevator.goToFloor(firstRequested.value)
        requestedAtFloor.delete(firstRequested.value)
      }

      console.log("idle", currentFloor, requested)
    })

    elevator.on("floor_button_pressed", (floorNum) => {
      const direction = elevator.destinationDirection
      elevator.goToFloor(floorNum)
      console.log("floor_button_pressed")
    })

    elevator.on("passing_floor", (floorNum, direction) => {
      console.log("passing_floor", floorNum, direction)
    })

    elevator.on("stopped_at_floor", (floorNum) => {
      console.log("stopped_at_floor", floorNum)
    })

    floors.forEach((floor) => {
      floor.on("up_button_pressed", () => {
        const floorNum = floor.floorNum()

        if(elevator.destinationQueue.length > 0) {
          addRequestedFloor(requestedAtFloor, floorNum, 'up')
        } else {
          elevator.goToFloor(floorNum)
        }

        console.log("up_button_pressed", requestedAtFloor)
      })
      floor.on("down_button_pressed", () => {
        const floorNum = floor.floorNum()

        if(elevator.destinationQueue.length > 0) {
          addRequestedFloor(requestedAtFloor, floorNum, 'down')
        } else {
          elevator.goToFloor(floorNum)
        }

        console.log("down_button_pressed", requestedAtFloor)
      })

      const addRequestedFloor = (requestedAtFloor, floorNum, direction) => {
        const requestedAtFloorDirections = requestedAtFloor.get(floorNum)
        if(requestedAtFloorDirections) requestedAtFloorDirections.add(direction)
        else requestedAtFloor.set(floorNum, new Set([direction]))
      }
    })
  },
  update: (dt, elevators, floors) => {
  }
}
