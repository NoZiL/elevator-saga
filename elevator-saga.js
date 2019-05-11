{
  init: (elevators, floors) => {
    floors.forEach((floor) => {
      floor.on('up_button_pressed', () => {})
      floor.on('down_button_pressed', () => {})
    })
    elevators.forEach((elevator) => {
      elevator.on('idle', () => {
        elevator.goingUpIndicator(true)
        elevator.goingDownIndicator(true)
        const currentFloor = elevator.currentFloor()
        const floorsToGo = floors.filter(
          floor => floor.buttonStates.up || floor.buttonStates.down
        )
        if(floorsToGo.length > 0) {
          const farestFloor = floorsToGo
            .reduce((max, floor) => {
              const distance = Math.abs(floor.floorNum() - currentFloor)
              return (max > distance) ? max : floor
            })
          elevator.goingUpIndicator(currentFloor <= farestFloor.floorNum())
          elevator.goingDownIndicator(currentFloor >= farestFloor.floorNum())
          elevator.goToFloor(farestFloor.floorNum())
        }
        console.log('idle')
      })

      elevator.on('floor_button_pressed', (floorNum) => {
        const currentFloor = elevator.currentFloor()
        const destinationDirection = elevator.destinationDirection()
        const sortFn = (a, b) => destinationDirection === 'up' ? a < b : a > b

        elevator.destinationQueue.push(floorNum)
        elevator.destinationQueue.sort(
          (a, b) => currentFloor < floorNum ? sortFn(a, b) : !sortFn(a, b)
        )
        elevator.goingUpIndicator(currentFloor <= elevator.destinationQueue[0])
        elevator.goingDownIndicator(currentFloor >= elevator.destinationQueue[0])
        elevator.checkDestinationQueue()

        console.log('floor_button_pressed', floorNum)
      })

      elevator.on('passing_floor', (floorNum, direction) => {
        const currentFlour = floors.find(
          (floor) => floor.floorNum() === floorNum
        )
        if(currentFlour && currentFlour.buttonStates[direction]) {
          elevator.goToFloor(floorNum)
        }
        console.log('passing_floor', floorNum, direction)
      })

      elevator.on('stopped_at_floor', (floorNum) => {
        elevator.goingUpIndicator(true)
        elevator.goingDownIndicator(true)
        console.log('stopped_at_floor', floorNum)
      })
    })
  },
  update: (dt, elevators, floors) => {}
}
