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
Need to transfer over javascript app is referencing remotely to a local repo so I can view data in field.

6-2-14
X - Change model to use usb breakout instead of mini usb
X - Change model to fit new accelerometer
X - Change model to fit single 3mm led
X - Change model to fit a single dip switch
X - Add Arduino logic to show one 3mm led illuminated when ready for data, i.e., when the delay loop is done.
X - Add Arduino logic to change data head based on dip switch setting, one for 'hand' other for 'mount'.
X - Add Arduino logic to make time relative to the data its spitting out, not to the time since the Arduino has been on.

9-1-14
X - http://adlervermillion.com/how-to-read-a-patent/
X - http://physics.rutgers.edu/~aatish/teach/srr/workshop3.pdf
X - Get processing code to loop through the test array.

9-7-14
Call processing from node app. Similar to a button on click load array data for that test and play video.

10-5-14
Got processing function to execute when I click 'redraw' button. Now need to send function text from html.

11-2-14
Notes: Got processing code executing and stopping correctly. Code stops with noLoop after running through entire array. 'Test' button on render page quickly flashes a 'test' message. This is to test executing code during processing. Next step is to send data from front end to Processing code.
