led.enable(false)
let HORIZONTAL_SPEED = 80
let WINCH_SPEED = 80
let ROTATION_SPEED = 70
let PRESSED = 0
let RELEASED = 1
let SERVO_STALL = 90
let spool_outer = 0
let spool_inner = 0
let gripper = 0
let rotor = 0
let hoist = 0
let left = 0
let right = 0
let forward = 0
let backward = 0
radio.setGroup(80)
pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
basic.forever(function () {
    hoist = 1024 - pins.analogReadPin(AnalogPin.P1)
    left = pins.digitalReadPin(DigitalPin.P13)
    right = pins.digitalReadPin(DigitalPin.P15)
    forward = pins.digitalReadPin(DigitalPin.P14)
    backward = pins.digitalReadPin(DigitalPin.P16)
    if (left == PRESSED && right == PRESSED) {
        rotor = SERVO_STALL
    } else if (left == RELEASED && right == PRESSED) {
        rotor = SERVO_STALL + ROTATION_SPEED
    } else if (left == PRESSED && right == RELEASED) {
        rotor = SERVO_STALL - ROTATION_SPEED
    } else {
        rotor = SERVO_STALL
    }
    if (forward == PRESSED && backward == RELEASED) {
        spool_inner = SERVO_STALL - HORIZONTAL_SPEED
        spool_outer = SERVO_STALL + HORIZONTAL_SPEED
    } else if (forward == RELEASED && backward == PRESSED) {
        spool_inner = SERVO_STALL + HORIZONTAL_SPEED
        spool_outer = SERVO_STALL - HORIZONTAL_SPEED
    } else if (forward == RELEASED && backward == RELEASED) {
        spool_inner = Math.map(hoist, 0, 1023, SERVO_STALL - WINCH_SPEED, SERVO_STALL + WINCH_SPEED)
        spool_outer = spool_inner
    } else {
        spool_inner = SERVO_STALL
        spool_outer = spool_inner
    }
    radio.sendValue("rotate", rotor)
    radio.sendValue("inner", spool_inner)
    radio.sendValue("outer", spool_outer)
    radio.sendValue("gripper", gripper)
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (control.eventValue() == EventBusValue.MICROBIT_BUTTON_EVT_DOWN) {
        gripper = 1
    } else {
        gripper = 0
    }
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (control.eventValue() == EventBusValue.MICROBIT_BUTTON_EVT_DOWN) {
        gripper = 1
    } else {
        gripper = 0
    }
})