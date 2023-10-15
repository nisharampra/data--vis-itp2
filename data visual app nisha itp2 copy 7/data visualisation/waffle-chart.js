
function WaffleChart(){
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Waffle Chart';
  // Each visualisation must have a unique ID with no special
  // characters.
    this.id = 'waffle-chart';
      // Property to represent whether data has been loaded.
    this.loaded = false;
    this.waffles = [];
// Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
    this.preload = function(){
        var self = this;
        // Load the data table
        this.data = loadTable(
            './data/waffle/finalData.csv', 'csv', 'header', 
            function(table){
                self.loaded = true;
            }
        )
    }

    this.layout = {
        startX: 20,
        startY: 20,
        waffleWidth: 200,
        waffleHeight: 200,
        waffleWidthPadding: 20,
        waffleHeightPadding: 60,
        secondRowPadding: 100
    }
    
    this.setup = function(){
        var days = ["Monday","Tuesday", "Wednesday", "Thursday","Friday","Saturday","Sunday"];
        var values = ['Take-away','Cooked from fresh','Ready meal','Ate out', 'Skipped meal', 'Left overs']
        for(var i = 0; i<days.length;i++){
            if(i<4){
                // Calculate position for waffle in the first row
                var w_x = this.layout.startX + (i * (this.layout.waffleWidth + this.layout.waffleWidthPadding));
                var w_y = this.layout.startY;
                var w_width = this.layout.waffleWidth;
                var w_height = this.layout.waffleHeight;
                var w = new Waffle(w_x, w_y, w_width, w_height, 8, 8, this.data, days[i], values);
                this.waffles.push(w);
            }else{
                // Calculate position for waffle in the second row
                var w_x = this.layout.startX + this.layout.secondRowPadding;
                w_x += ((i - 4) * (this.layout.waffleWidth + this.layout.waffleWidthPadding));
                var w_y = this.layout.startY + this.layout.waffleHeight + this.layout.waffleHeightPadding;
                var w_width = this.layout.waffleWidth;
                var w_height = this.layout.waffleHeight;
                var w = new Waffle(w_x, w_y, w_width, w_height, 8, 8, this.data, days[i], values);
                this.waffles.push(w);
            }
        }
    }

    this.destroy = function(){
        // Code to destroy the waffle chart
    }

    this.draw = function(){
        if(!this.loaded){
            console.log('Data not yet loaded');
            return;
        }
        // background(255);
        background(255, 192, 203);

        // Draw each waffle
        for(var i = 0; i < this.waffles.length; i++){
            var w = this.waffles[i];
            w.draw();
        }
        // Check for mouse interaction in each waffle
        for(var i = 0; i < this.waffles.length; i++){
            var w = this.waffles[i];
            w.checkMouse(mouseX, mouseY);
        }
    }
   
    
    
}
