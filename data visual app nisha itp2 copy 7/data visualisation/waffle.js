function Waffle(x, y, width, height, boxes_across, boxes_down, table, columnHeading, possibleValues) {

    // Store the initial parameters as local variables
    var x = x;
    var y = y;
    var height = height;
    var width = width;
    var boxes_down = boxes_down;
    var boxes_across = boxes_across;

    // Extract the data for the specified column from the table
    var column = table.getColumn(columnHeading);
    var possibleValues = possibleValues;

    // Define an array of colors to use for different categories
    var colours = ["red", "green", "blue", "purple", "yellow", "orange"];

    // Initialize arrays to store category information and boxes
    var legendDrawn = false;
    var categories = [];
    var boxes = [];

    // Function to find the index of a category in the categories array
    function categoryLocation(categoryName) {
        for (var i = 0; i < categories.length; i++) {
            if (categoryName == categories[i].name) {
                return i;
            }
        }
        return -1;
    }

    // Function to calculate category counts and the number of boxes for each category
    function addCategories() {
        // Initialize category information with possibleValues and assign colors
        for (var i = 0; i < possibleValues.length; i++) {
            categories.push({
                "name": possibleValues[i],
                "count": 0,
                "colour": colours[i % colours.length]
            })
        }

        // Count occurrences of each category in the data
        for (var i = 0; i < column.length; i++) {
            var catLocation = categoryLocation(column[i]);

            if (catLocation != -1) {
                categories[catLocation].count++;
            }
        }

        // Calculate the number of boxes needed for each category based on counts
        for (var i = 0; i < categories.length; i++) {
            categories[i].boxes = round((categories[i].count / column.length) * (boxes_down * boxes_across));
        }
    }

    // Function to create and arrange boxes based on the number of categories
    function addBoxes() {
        var currentCategory = 0;
        var currentCategoryBox = 0;

        // Calculate the dimensions of each box
        var boxWidth = width / boxes_across;
        var boxHeight = height / boxes_down;
        for (var i = 0; i < boxes_down; i++) {
            boxes.push([]);
            for (var j = 0; j < boxes_across; j++) {
                // Check if the current category has the required number of boxes
                if (currentCategoryBox == categories[currentCategory].boxes) {
                    currentCategoryBox = 0;
                    currentCategory++;
                }
                // Create a new box with its corresponding category
                boxes[i].push(new Box(x + (j * boxWidth), y + (i * boxHeight), boxWidth, boxHeight, categories[currentCategory]));
                currentCategoryBox++;
            }
        }
    }

    // Call the functions to set up the waffle chart
    addCategories();
    addBoxes();


    this.draw = function () {
        // Draw the waffle diagram with boxes for each category
        fill(0);
        textSize(20);
        textAlign(LEFT, BOTTOM);
        text(columnHeading, x, y);
        for (var i = 0; i < boxes.length; i++) {
            for (var j = 0; j < boxes[i].length; j++) {
                if (boxes[i][j].category != undefined) {
                    boxes[i][j].draw();
                }
            }
        }

        // Check if the legend hasn't been drawn yet
        if (!legendDrawn) {
            drawLegend();
            // Set the flag to true to prevent drawing the legend again
            legendDrawn = true;
        }
    }
    this.draw = function () {
        // Draw the waffle diagram with boxes for each category
        fill(0);
        textSize(20);
        textAlign(LEFT, BOTTOM);
        text(columnHeading, x, y);
        for (var i = 0; i < boxes.length; i++) {
            for (var j = 0; j < boxes[i].length; j++) {
                if (boxes[i][j].category != undefined) {
                    boxes[i][j].draw();
                }
            }
        }


    }

    this.checkMouse = function (mouseX, mouseY) {
        // Check if the mouse is over any box and display category information
        for (var i = 0; i < boxes.length; i++) {
            for (var j = 0; j < boxes[i].length; j++) {
                if (boxes[i][j].category != undefined) {
                    var mouseOver = boxes[i][j].mouseOver(mouseX, mouseY);
                    if (mouseOver != false) {
                        push();
                        fill(0);
                        textSize(20);
                        var tWidth = textWidth(mouseOver);
                        textAlign(LEFT, TOP);
                        rect(mouseX, mouseY, tWidth + 20, 40);
                        fill(255);
                        text(mouseOver, mouseX + 10, mouseY + 10);
                        break;
                    }
                }
            }
        }
    }
}

