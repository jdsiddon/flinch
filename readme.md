flinch
======

flinch


Notes
3-18-14
Added pipes to seperate data elements on a data point. Now need to figure out how to add newline to each element. - DONE

3-19-14
- Need to fix the name of the file so its something unique. This is for clicking 'graph' on the webpage.
  Right now when you click graph it sends the name of the file to the server which is the files location path.
  This is confusing the webserver as it thinks it is requesting a route to another place which is causing the
  server to 404.
- Need to fix how the date is being formatted right now everything says is in 1969. Think this is beause 'date'
  is actually just a normal milli() field from Arduino. Should populate this field with current date on the Node
  side. So to sum it up make the date of the database entry be date.now() or something similar.
