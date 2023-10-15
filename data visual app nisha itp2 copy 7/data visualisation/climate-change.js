function ClimateChange() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Climate Change';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'climate-change';

  // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '℃';

  var marginSize = 35;

  // Layout the object to store all common plot layout parameters and method
  this.layout = {
    marginSize: marginSize,

// Positions of the margins. Having double margins on the left and bottom
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean that will be enable or disable background grid.
    grid: false,

    numXTickLabels: 8,
    numYTickLabels: 8,
  };
// Indicates whether data has been loaded with this property.
  this.loaded = false;

  // Preload the data. 
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/surface-temperature/surface-temperature.csv', 'csv', 'header',
      // Callback function to set the value
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    // Font defaults.
    textSize(16);
    textAlign('center', 'center');

    // Set min and max years
    this.minYear = this.data.getNum(0, 'year');
    this.maxYear = this.data.getNum(this.data.getRowCount() - 1, 'year');

    //  min and max temperature for mapping the canvas height.
    this.minTemperature = min(this.data.getColumn('temperature'));
    this.maxTemperature = max(this.data.getColumn('temperature'));

    // to find mean temperature to plot average marker.
    this.meanTemperature = mean(this.data.getColumn('temperature'));

    // to ount the number of frames drawn since the visualisation
    this.frameCount = 0;

    this.startSlider = createSlider(this.minYear,
                                    this.maxYear - 1,
                                    this.minYear,
                                    1);
    this.startSlider.position(400, 10);

    this.endSlider = createSlider(this.minYear + 1,
                                  this.maxYear,
                                  this.maxYear,
                                  1);
    this.endSlider.position(600, 10);
  };

  //destroy functiom
  this.destroy = function() {
    this.startSlider.remove();
    this.endSlider.remove();
  };

  //draw function
  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //  prevent slider ranges overlapping.
    if (this.startSlider.value() >= this.endSlider.value()) {
      this.startSlider.value(this.endSlider.value() - 1);
    }
    this.startYear = this.startSlider.value();
    this.endYear = this.endSlider.value();

    // y-axis tick labels.
    drawYAxisTickLabels(this.minTemperature,
                        this.maxTemperature,
                        this.layout,
                        this.mapTemperatureToHeight.bind(this),
                        1);

    // Draw the x and y axis.
    drawAxis(this.layout);

    // Draw the x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot the average line.
    stroke(200);
    strokeWeight(1);
    line(this.layout.leftMargin,
         this.mapTemperatureToHeight(this.meanTemperature),
         this.layout.rightMargin,
         this.mapTemperatureToHeight(this.meanTemperature));

    // width of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;
    var segmentWidth = this.layout.plotWidth() / numYears;
//to count the number of year
    var yearCount = 0;

    // Loop the rows
    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Create an object to store data for the current year.
      var current = {
        // conversion of the  strings to numbers.
        'year': this.data.getNum(i, 'year'),
        'temperature': this.data.getNum(i, 'temperature')
      };

      if (previous != null
          && current.year > this.startYear
          && current.year <= this.endYear) {

        
        noStroke();
          fill(this.mapTemperatureToColour(current.temperature));
        var yearRange=this.endSlider.value() - this.startSlider.value();
          var offset=
          map(current.year,this.startSlider.value(),this.endSlider.value() ,0,yearRange);
          rect(this.layout.leftMargin+(offset-1)*segmentWidth,this.layout.topMargin,segmentWidth,this.layout.bottomMargin-this.layout.topMargin);
        // Draw line segments connecting previous year to current
        stroke(0);
        line(this.mapYearToWidth(previous.year),
             this.mapTemperatureToHeight(previous.temperature),
             this.mapYearToWidth(current.year),
             this.mapTemperatureToHeight(current.temperature));

        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // to draw the tick label marking the start of the previous year.
        if (yearCount % xLabelSkip == 0) {
          drawXAxisTickLabel(previous.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }

        // When six or fewer years are displayed also draw the final
        // year x tick label.
        if ((numYears <= 6
             && yearCount == numYears - 1)) {
          drawXAxisTickLabel(current.year, this.layout,
                             this.mapYearToWidth.bind(this));
        }

        yearCount++;
      }

      // Stop drawing this frame when the number of years drawn is
      // equal to the frame count. This creates the animated effect
      // over successive frames.
      if (yearCount >= this.frameCount) {
        break;
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }

    // Count the number of frames since this visualisation
    // started. This is used in creating the animation effect and to
    // stop the main p5 draw loop when all years have been drawn.
    this.frameCount++;

    // Stop animation when all years have been drawn.
    if (this.frameCount >= numYears) {
      //noLoop();
    }
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapTemperatureToHeight = function(value) {
    return map(value,
               this.minTemperature,
               this.maxTemperature,
               this.layout.bottomMargin, // Lower temperature at bottom.
               this.layout.topMargin);   // Higher temperature at top.
  };

  this.mapTemperatureToColour = function(value) {
    var red =  map(value,
                   this.minTemperature,
                   this.maxTemperature,
                   0,
                   255);
    var blue = 255 - red;
    return color(red, 0, blue, 100);
  };
}
