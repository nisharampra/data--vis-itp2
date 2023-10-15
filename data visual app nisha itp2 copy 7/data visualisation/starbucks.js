function starbucksInSg() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "starbucksInSg";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "starbucksInSg";

  // The variables to preload
  var myMap;
  var canvas;
  var mappa = new Mappa("Leaflet");
  let img;
  // This contain the lat,lang zoom
  var options = {
    lat: 1.357107,
    lng: 103.8194992,
    zoom: 11,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
  };

  // To find data has been loaded or not.
  this.loaded = false;
  //preload function
  this.preload = function () {
    this.StarbucksData = loadTable(
      "data/starbucks/starbucks.csv",
      "csv",
      "header",
      this.csvLoaded.bind(this)
    );
  };

  //testing for csv is loaded
  this.csvLoaded = function () {
    this.loaded = true;
    console.log("CSV Data:", this.StarbucksData);
    console.log("Column Names:", this.StarbucksData.columns);
  };

  this.setup = function () {
    // Clear the previous content of the stage div
    select("#stage").html("");
    //for text  header
    //first text
    const heading1 = createElement("h2", "starbucks in singapore");
    heading1.parent("stage");

    //second text
    const heading2 = createElement("h3", "You can zoom to see the location");
    heading2.parent("stage");

    // To Create the map container
    const mapContainer = createDiv();
    mapContainer.id("map");
    mapContainer.parent("stage");
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: "lib/leaflet file/images/marker-icon-2x.png",
      iconSize: [32, 32], //icon size
    });

    //to create the Leaflet map
    myMap = L.map("map").setView([options.lat, options.lng], options.zoom);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(myMap);
  };

  this.draw = function () {
    if (this.loaded) {
      for (let i = 0; i < this.StarbucksData.getRowCount(); i++) {
        const location = this.StarbucksData.getRow(i);
        const lat = location.getNum("lat");
        const lng = location.getNum("lng");

        // for  custom marker icon
        const customIcon = L.icon({
          iconUrl: "lib/leaflet file/images/marker-icon-2x.png", // Path to the custom marker image
          iconSize: [32, 32],
        });

        // Adding the marker to the map
        L.marker([lat, lng], { icon: customIcon }).addTo(myMap);
      }
    }
  };

  //to destroy the map when it is  clicked to another menue//
  this.destroy = function () {
    // this will clear the map thru div tag
    myMap.remove();
    select("#stage").html('<div id="app"></div>');

    // to create a new map
    canvas = createCanvas(1024, 576);
    canvas.parent("app");
  };
}
