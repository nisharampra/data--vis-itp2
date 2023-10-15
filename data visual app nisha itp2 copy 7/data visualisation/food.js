function Food(){

    // Name for the visualisation that will appear in the menu bar.
    this.name = ' Food ';

    // Each visualisation must have a unique ID with no special
    this.id = 'food';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // variable
    var bubbles=[];
    var maxAmt;
    var years=[];
    var yearButtons = [];   

    // to Preload the data. This function will be called automatically by the
    this.preload = function() {
        var self = this;
        this.data = loadTable(
            './data/food/foodData.csv' ,'csv','header',
            
            function(table) {
                self.loaded = true;
            });
    };
       
   //the setup function 
    this.setup = function() {
        console.log("in the set up");
        this.data_setup();
    };

    //this will destroy the chart when clicked on the other menu
    this.destroy = function() {
        console.log("in destroy");
        //clear away the years button
        select("#years").html("");
    };
   //draw function
    this.draw = function() {

        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        translate(width/2,height/2);
        for (var i = 0; i < bubbles.length; i++)
        {
            bubbles[i].update(bubbles);
            bubbles[i].draw();
        }
    };

    this.data_setup = function() {

        bubbles = [];
        maxAmt;
        years = [];
        yearButtons = [];

        var rows = this.data.getRows();
        var numColumns = this.data.getColumnCount();

        for (var i = 5; i < numColumns; i++)
        {
            var y = this.data.columns[i];
            years.push(y);
            b = createButton(y,y);
            b.parent('years')
            b.mousePressed(function()
            {
                changeYear(this.elt.value,years,bubbles);
                console.log(this.elt.value);
                var yearString = this.elt.innerHTML;
                var yearIndex = years.indexOf(yearString);

            })
            yearButtons.push(b);
        }
        maxAmt = 0;

        for(var i = 0; i < rows.length; i++) 
        {
            if(rows[i].get(0) != "")
            {
                var b = new Bubble(rows[i].get(0));

                for (var j = 5; j < numColumns; j++)
                {
                    if(rows[i].get(j) != "")
                    {
                        var n = rows[i].getNum(j);
                        if (n > maxAmt)
                        {
                            maxAmt = n; // keep a tally of the highest value
                        }
                        b.data.push(n);
                    }
                    else
                    {
                        b.data.push(0);
                    }
                    
                }
                bubbles.push(b);
            }
        }
        for (var i = 0; i < bubbles.length; i++)
        {
            bubbles[i].setMaxAmt(maxAmt);
            bubbles[i].setData(0);
        }

    };

    function changeYear(year, _years, _bubbles) {
        var y = _years.indexOf(year);

        for (var i =0; i < _bubbles.length; i++)
        {
            _bubbles[i].setData(y);
        }
    }
    
}
