flinch
======

flinch


Notes
3-18-14
Added pipes to seperate data elements on a data point. Now need to figure out how to add newline to each element. - DONE

3-19-14
Need to fix the name of the file so its something unique. This is for clicking 'graph' on the webpage.
Right now when you click graph it sends the name of the file to the server which is the files location path.
This is confusing the webserver as it thinks it is requesting a route to another place which is causing the
server to 404.
Need to fix how the date is being formatted right now everything says is in 1969. Think this is beause 'date'
is actually just a normal milli() field from Arduino. Should populate this field with current date on the Node
side. So to sum it up make the date of the database entry be date.now() or something similar.

3-26-14
- Event emitter in sensor-events.js for .open() isn't working correctly. Should emit an event each time data comes
  across arduino.
Need to transfer over javascript app is referencing remotely to a local repo so I can view data in field.
- Add events for data coming in, ready to fire, testing, etc.
- Add command line entry for hand or rest shooting, and shooter name. Take this data and save it to the Mongo document.
  Display this data on the nav menu on the right with an icon 'r' for rest and 'h' for hand or something similar.

6-2-14
Change model to use usb breakout instead of mini usb
Change model to fit new accelerometer
Change model to fit single 3mm led
Change model to fit a single dip switch
Add Arduino logic to show one 3mm led illuminated when ready for data, i.e., when the delay loop is done.
Add Arduino logic to change data head based on dip switch setting, one for 'hand' other for 'mount'.
Add Arduino logic to make time relative to the data its spitting out, not to the time since the Arduino has been on.
