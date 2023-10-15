function pieLovers() {
  // Name for the visualization to appear in the menu bar.
  this.name = "PieLovers";

  // Each visualization must have a unique ID with no special characters.
  this.id = "PieLovers";

  let pielikedDatas = [30, 40, 50, 25]; // data of ppl who love pie
  let category = "grade "; // category
  let img; //variable for image

  //To preload the image
  this.preload = function () {
    img = loadImage("data/pie/pie.jpeg");
  };
  this.draw = function () {
    background(255, 192, 203);
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(20);
    fill(0, 0, 0);
    text("pie lovers from diffrent grades", 260, 200);

    let maxpieliked = max(pielikedDatas);
    let imageWidth = 60;
    let imageSpacing = 100;
    let startY = height - 80;
    let x = 100;

    //the array will storen the x-cordinated of the data
    let dataX = [];
    //the array will store the y cordinate of the data
    let dataY = [];

    //loop to draw the data
    for (let i = 0; i < pielikedDatas.length; i++) {
      let imageHeight = map(pielikedDatas[i], 0, maxpieliked, 0, 200);
      drawImage(x, startY, imageWidth, imageHeight);
      textAlign(CENTER);
      fill(0);
      //to display the catorgray below the image e.g. grade 1
      text(category + " " + (i + 1), x + imageWidth / 2, startY + 20);

      // Store the coordinates of each data
      dataX.push(x + imageWidth / 2);
      dataY.push(startY - imageHeight);

      x += imageSpacing;
    }

    // Draw the line that will be connecting the data points
    stroke(128, 0, 128); //line color
    strokeWeight(1); //line thicknes

    noFill();
    beginShape();

    for (let i = 0; i < dataX.length; i++) {
      vertex(dataX[i], dataY[i]);
    }
    endShape();

    // Draw the data labels along the line
    textAlign(LEFT, BOTTOM);

    for (let i = 0; i < dataX.length; i++) {
      fill(128, 0, 128);
      text(pielikedDatas[i], dataX[i] + 5, dataY[i] - 5);
    }
    // Draw a side graph
    stroke(0);
    beginShape();

    vertex(width - 50, startY);
    for (let i = 0; i < dataY.length; i++) {
      vertex(width - 50, dataY[i]);
    }
    vertex(width - 50, dataY[dataY.length - 1]);
    endShape();
  };
  // to Draw the image on the bar//
  function drawImage(x, y, w, h) {
    image(img, x, y - h, w, h);
  }
}
