{
  init: (elevators, floors) => {
    let elevator = elevators[0]

    elevator.on("idle", () => {

    })

    elevator.on("floor_button_pressed", (floorNum) => {
      elevator.goToFloor(floorNum)
    })

    elevator.on("passing_floor", (floorNum, direction) => {

    })

    elevator.on("stopped_at_floor", function(floorNum) {

    })

    floors.forEach((floor) => {
      floor.on("up_button_pressed", () => {
        const floorNum = floor.floorNum()
        elevator.goToFloor(floorNum)
      })
      floor.on("down_button_pressed", () => {
        const floorNum = floor.floorNum()
        elevator.goToFloor(floorNum)
      })
    })
  },
  update: (dt, elevators, floors) => {}
}
