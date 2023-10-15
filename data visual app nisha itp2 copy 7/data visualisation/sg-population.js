
// Create an instance of singapore population
function singaporePopulation() {
  // Name for the visualization to appear in the menu bar.
  this.name = 'singapore population';

  // Each visualization must have a unique ID with no special characters.
  this.id = 'singapore population';

  // csv file we want to load
  let filename = 'data/sg-population/sg-population.csv';

  this.loaded = false;
  this.chart = null; // Reference to the Chart.js instance

  // to  Preload the data. This function is called automatically by the gallery when a visualization is added.
  this.preload = function() {
    var self = this;
    fetch(filename)
      .then(response => response.text())
      .then(csvData => {
        // for CSV data
        let rows = csvData.trim().split('\n');
        let data = rows.map(row => row.split(','));
        self.data = data;
        self.loaded = true;
      })
      .catch(error => {
        console.error('Failed to load CSV :', error);
      });
  };

  // Basic bar chart settings//
  this.setup = function() {
    if (this.chart) {
      this.chart.destroy();
    }
    let labels = this.data[0].slice(1); // Extract labels from the first row

    let datasets = [];
    // Create datasets for each row (excluding the first row)
    for (let i = 1; i < this.data.length; i++) {
      let rowData = this.data[i];
      let dataset = {
        label: rowData[0], // Use the first column as the dataset label
        data: rowData.slice(1).map(Number), // Convert data values to numbers
        fill: false,  
      };
      datasets.push(dataset);
    }

  //to draw the bar graph
    let options = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
    };

    this.chart = new Chart(document.getElementById('canvas'), options);
  };
  this.draw = function() {
    // Add any drawing functionality here, if needed.
};
  // Destroy the chart instance when switching to another visualization
  this.destroy = function() {
    if (this.chart) {
      this.chart.destroy();
    }
  };
}



