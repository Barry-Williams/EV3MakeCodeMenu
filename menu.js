let menuOpts: string[], menucommitted: number, menu: number = 0, aPower: number, dPower: number, RLI: number, light = 0, dark = 100
menucommitted = -1
menuOpts = ["calibrate", "follow line", "show rli"]
enum MENU {
    calibrate,
    followLine,
    showRLI,
}


brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    menu += 1
    if (menu >= menuOpts.length) {
        menu = 0
    }
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    menu += 0 - 1
    if (menu < 0) {
        menu = menuOpts.length - 1
    }
})
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.clearScreen()
    if (menucommitted == -1) {
        menucommitted = menu
    } else {
        menu = 0
        motors.stopAll()
        menucommitted = -1
    }
})




forever(function () {
    if (menucommitted == -1) {
        /*if (menu == 1) brick.showString("> calibrate", 1)
        if (menu != 1) brick.showString("calibrate", 1)
        ...this was my first attempt but would have required 2 lines
        of code per option 6 lines of code for this menu
        instead I put my 3 strings in an array*/
        for (let i = 0; i <= menuOpts.length - 1; i++) { //this loops through the array
            brick.showString(menu == i ? "> " + menuOpts[i] : menuOpts[i], i + 1)
            /*menuOpts[i] takes each number of the array and returns the string so 
              menuOpts[0] returns "calibrate"
              the ? is a javascript ternary operator (put this in to google to find more)
              if the condition menu == i is true it returns what is between the ? and the :
              otherwise it returns what is after the : until the ,
              so if menu == 0 the first part part of our loop will return
              "> " + "calibrate" in javascript using + puts the two strings together so:
              "> calibrate" is shown on line 0 + 1 
            */
        }
    }
    if (menucommitted == MENU.calibrate) {
        brick.showString("Calibrating RLI", 1)
        motors.resetAll()
        while (motors.largeA.angle() < 1000) {
            RLI = sensors.color3.reflectedLight()


            //sensors.color3.calibrateLight(LightIntensityMode.Reflected)
            motors.largeAD.tank(50, -50)

            if (RLI < dark) {
                dark = RLI
            }
            if (RLI > light) {
                light = RLI
            }
            brick.showValue("light", light, 2)
            brick.showValue("dark", dark, 3)
            brick.showValue("RLI", RLI, 4)
            brick.showValue("Dangle", motors.largeA.angle(), 5)
        }
        //sensors.color3.calibrateLight(LightIntensityMode.Reflected)
        motors.stopAll()
        //sensors.color3.setThreshold(Light.Dark, dark)
        //sensors.color3.setThreshold(Light.Bright, light)
        pause(1000)
        brick.clearScreen()
        menu = 0
        menucommitted = -1
    }
    if (menucommitted == MENU.followLine) {
        RLI = sensors.color3.light(LightIntensityMode.Reflected)
        aPower = (light - RLI) * 0.4
        dPower = (RLI - dark) * 0.4

        motors.largeAD.tank(aPower, dPower)
    }
    if (menucommitted == MENU.showRLI) {
        brick.showValue("rli", sensors.color3.reflectedLight(), 1)
    }
})
