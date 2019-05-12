{
  init: (elevators, floors) => {
    floors.forEach((floor) => {
      floor.on('up_button_pressed', () => {
        const floorNum = floor.floorNum()
        const elevatorInit = elevators.find(e => e.init)
        if(elevatorInit) {
          const currentFloor = elevatorInit.currentFloor()
          elevatorInit.goingUpIndicator(currentFloor <= floorNum)
          elevatorInit.goingDownIndicator(currentFloor >= floorNum)
          elevatorInit.goToFloor(floorNum)
        }
      })
      floor.on('down_button_pressed', () => {
        const floorNum = floor.floorNum()
        const elevatorInit = elevators.find(e => e.init)
        if(elevatorInit) {
          const currentFloor = elevatorInit.currentFloor()
          elevatorInit.goingUpIndicator(currentFloor <= floorNum)
          elevatorInit.goingDownIndicator(currentFloor >= floorNum)
          elevatorInit.goToFloor(floorNum)
        }
      })
    })
    elevators.forEach((elevator) => {
      elevator.init = true
      elevator.on('idle', () => {
        // What should I do ?
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
          console.log(`going to ${farestFloor.floorNum()}`);
        }
        console.log(`idle ${currentFloor}`)
      })

      elevator.on('floor_button_pressed', (floorNum) => {
        // Should add floor to destinations ordered by direction and not already exists
        if(!elevator.destinationQueue.some(e => e === floorNum)) {
          const currentFloor = elevator.currentFloor()
          const destinationDirection = elevator.destinationDirection()
          const sortFn = (a, b) => destinationDirection === 'up' ? a < b : a > b

          elevator.destinationQueue.push(floorNum)
          elevator.destinationQueue.sort(
            (a, b) => currentFloor < floorNum ? sortFn(a, b) : !sortFn(a, b)
          )
          const nextDestination = elevator.destinationQueue[0]
          elevator.goingUpIndicator(currentFloor <= elevator.destinationQueue[0])
          elevator.goingDownIndicator(currentFloor >= elevator.destinationQueue[0])
          elevator.checkDestinationQueue()
        }

        console.log(`floor_button_pressed ${floorNum}, going to ${elevator.destinationQueue}`)
      })

      elevator.on('passing_floor', (floorNum, direction) => {
        // Should stop if floor is selected for current direction
        const currentFlour = floors.find(
          (floor) => floor.floorNum() === floorNum
        )
        if(currentFlour && currentFlour.buttonStates[direction]) {
          elevator.goToFloor(floorNum, true)
        }
        console.log(`passing_floor ${floorNum} ${direction}, going to ${elevator.destinationQueue}`)
      })

      elevator.on('stopped_at_floor', (floorNum) => {
        // Shoud set next direction if no direction
        const nextDestination = elevator.destinationQueue[0]
        elevator.goingUpIndicator(!nextDestination || floorNum <= nextDestination)
        elevator.goingDownIndicator(!nextDestination || floorNum >= nextDestination)
        console.log(`stopped_at_floor ${floorNum}, going to ${elevator.destinationQueue}`)
      })
    })
  },
  update: (dt, elevators, floors) => {}
}
