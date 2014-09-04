import processing.serial.*;
 
float bx;
float by;
int bs = 20;

Serial myPort;
String response="";
String[] search;

PFont fontA;

void setup() 
{
  size(400, 200);
  
  String portName = Serial.list()[1];
  myPort = new Serial(this, portName, 9600);
  
  fontA = loadFont("Arial-Black-48.vlw");
  // Set the font and its size (in units of pixels)
  textFont(fontA, 20);  
  
  bx = width/2.0;
  by = height/2.0;
  rectMode(RADIUS);  
}

void draw() 
{ 
  background(0);
  
  fill(153);
  response = getResponse();
  //println(response);
  // Test if the accelerometer has been single tapped
  if (match(response, "SINGLE") != null) {
    fill(255);  //Set the fill color of the box
    text("Single Tap", bx-50, height/3+10);
  } else {  //Test if the accelerometer has been double tapped
    fill(153); //Set the fill color of the box
    text("Double Tap", bx-50, height/3+10);
  }
  
  response = getResponse();
  text(response, bx-((response.length()*10)/2), height/3*2-10);

}

String getResponse()
{
  String serial_string="";
  int message_complete=0;
  char val = 0;        // Data received from the serial port

  while(message_complete==0)
  {
    if(myPort.available() > 0)
    {
      val=(char)myPort.read();
      serial_string = serial_string + str(val);
      if(val == '\r')
      {
        message_complete=1;
      }
    }
  }
  
  return serial_string;
} 

