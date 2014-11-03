/*
  Andor Salga
  Floating Gun
  Processing compliant
*/

float[][] readingArray = {
    {16.00,0.08,0.08,8.47},
    {17.00,0.08,0.08,8.71},
    {19.00,0.00,0.08,8.71},
    {20.00,0.00,0.24,8.79},
    {22.00,0.16,0.31,8.24},
    {23.00,0.24,0.16,8.94},
    {25.00,0.00,0.08,9.02},
    {26.00,0.00,0.00,8.79},
    {28.00,0.16,0.24,8.79},
    {29.00,0.08,0.16,9.02},
    {31.00,0.00,0.08,8.79},
    {33.00,0.16,0.00,8.87},
    {34.00,0.08,0.08,8.79},
    {36.00,0.16,0.16,8.32},
    {37.00,0.31,-31.85,46.44},
    {40.00,7.53,66.69,-25.42},
    {42.00,86.61,-6.75,-31.93},
    {43.00,22.83,58.13,30.91},
    {45.00,-50.21,30.05,23.93},
    {46.00,5.02,-30.28,16.24},
    {48.00,-17.26,-6.75,28.71}
};

//int a = a;

import processing.opengl.*;

float r = 0;
float grow = 1;
float descend = 0;
float dir = 0;
boolean isGrowing = false;
float growSpeed = 0.01;
boolean waiting = false;
int frameCounter = 0;

void setup(){
  size(500, 500, OPENGL);
}

void draw(int num){
  camera();
  background(200);

  translate(250, 280, 340);

  strokeWeight(1);
  fill(0, abs(250 * sin(frameCount/20.0)),0);

  pushMatrix();
  translate(0, 10, 0);
  box(20, 1, 20);
  popMatrix();

  frameCounter++;

 
  for(int i = 0; i < readingArray.length; i++) {
    
    // Create pitchRoll array from x, y, z coordinates from readingArray. pitchArray[0] = PITCH. pitchArray[1] = ROLL.
    float[] pitchRoll = convertAccel(readingArray[i][1], readingArray[i][2], readingArray[i][3]);
    tilt(pitchRoll);
    /*for(int j = 0; j < pitchRoll.length; j++) {
      
      // Print each element from pitchRoll.
      println(pitchRoll[j]);
    }*/
  }
  println("Done");
 // tilt();
  translate(30, 20, -50);

  fill(100);
  stroke(0);
  strokeWeight(3);

  if( waiting == false)
  {
  // barrel
  box(20,3,3);

  // barrel 'hole'
  fill(0);
  strokeWeight(4);
  pushMatrix();
  translate(-9.5, 0, 0);
  box(1, 1, 0.6);
  popMatrix();

  // handle
  pushMatrix();
  fill(100, 50, 0);
  translate(8, 4, 0);
  box(4.3, 5, 3);
  popMatrix();

  // trigger
  fill(60);
  pushMatrix();
  translate(4.8, 2.5, 0);
  box(2, 2, 3);
  popMatrix();
  }
}

void tilt(float[] pitchRoll) {
  float pitch = pitchRoll[0];
  float roll = pitchRoll[1];
  
  // X is front-to-back:
  rotateX(radians(roll + 90));
  // Y is left-to-right:
  rotateY(radians(pitch) );
}

float[] convertAccel(float xAxis, float yAxis, float zAxis) {
  // apply trigonometry to get the pitch and roll:
  float pitch = atan(xAxis/sqrt(pow(yAxis,2) + pow(zAxis,2)));
  float roll = atan(yAxis/sqrt(pow(xAxis,2) + pow(zAxis,2)));
  //convert radians into degrees
  pitch = pitch * (180.0/PI);
  roll = roll * (180.0/PI) ;
  
  float[] array = {pitch, roll};
  return array;
}

