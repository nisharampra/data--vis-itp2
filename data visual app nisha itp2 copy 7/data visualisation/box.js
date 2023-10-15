function Box(x, y, width, height, category){
    // Constructor function for the Box class

    // Store the initial parameters as local variables
    var x = x;
    var y = y;
    var height = height;
    var width = width;

    // Assign the category to the box instance
    this.category = category;

    // Function to check if the mouse is over the box and return the category name if true
    this.mouseOver = function(mouseX, mouseY){
        if(mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height){
            return this.category.name;
        }
        return false; // Return false if the mouse is not over the box
    }

    // Function to draw the box with its corresponding category color
    this.draw = function(){
        fill(category.colour);
        rect(x, y, width, height);
    }
}
