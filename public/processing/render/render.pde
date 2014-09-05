/*
  Andor Salga
  Floating Gun
  Processing compliant
*/
int a = a;

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



//  translate(0, 3 * sin(frameCount/10.0),0);
  rotateY(r+=0.01);
  rotateX(r+=0.01);
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
