{
  init: (elevators, floors) => {
    let elevator = elevators[0]

    elevator.on("idle", () => {

    })

    elevator.on("floor_button_pressed", (floorNum) => {

    })

    elevator.on("passing_floor", (floorNum, direction) => {

    })

    elevator.on("stopped_at_floor", function(floorNum) {

    })

    floors.forEach((floor) => {
      floor.on("up_button_pressed", () => {
      })
      floor.on("down_button_pressed", () => {
      })
    })
  },
  update: (dt, elevators, floors) => {}
}
