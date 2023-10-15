function BritishFoodAttitudes() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'British Food Attitudes';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'british-food-attitudes';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  //to preload the function
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/attitudestoukfood-2018.csv', 'csv', 'header',
      
      function(table) {
        self.loaded = true;
      });
  };

  //setup function
  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //to Create a select DOM element.
    this.select = createSelect();
    this.select.position(600, 500);

    // Fill the options with all company names.
    var questions = this.data.columns;
    // First entry is empty.
    for (var i = 1; i < questions.length; i++) {
      this.select.option(questions[i]);
    }
  };

  //destroy function
  this.destroy = function() {
    this.select.remove();
  };

  //To Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company that  we're interested in from the menue
    var question = this.select.value();

    // to get the column of raw data for question.
    var col = this.data.getColumn(question);

    // to convert all data strings to numbers.
    col = stringsToNumbers(col);

    // to copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // the colour to use for each category.
    var colours = [
        color(102,0,102),
        color(54,102,6),
        color(204,0,0),
        color(0,153,153),
        color(255,0,127)
    ];

    //for the title
    var title = question;

    //to draw the pie chart
    this.pie.draw(col, labels, colours, title);
  };
}
