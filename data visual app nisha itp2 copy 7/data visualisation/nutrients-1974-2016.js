function NutrientsTimesSeries(){

      this.name = "Nutrients: 1974-2016";

      this.id   = "nutrients-timeseries";

      this.title = "Nutrients: 1974-2016";

      this.loaded = "false";  

      this.xAxisLabel ="Year";
      this.yAxisLabel = "%";  

      this.colors = [];

      var marginSize = 35;

      this.layout = {marginSize: marginSize,
                     leftMargin: marginSize * 2,
                     rightMargin: width - marginSize,
                     topMargin: marginSize,
                     bottomMargin: height - marginSize * 2,
                     pad: 5,
                     plotWidth: function() {return this.rightMargin - this.leftMargin;},
                     plotHeight: function() {return this.bottomMargin - this.topMargin;}, 
                     grid: true,
                     numXTickLabels: 10,
                     numYTickLabels: 8,
                    };

        
        
        this.preload = function() {
        var self = this;
        this.data = loadTable(
          './data/food/nutrients74-16.csv', 'csv', 'header',
          // Callback function to set the value
          // this.loaded to true.
          function(table) {
            self.loaded = true;
          }); 

    };
        
        this.setup = function(){
        // Font defaults.
        textSize(16);

        // Set the min and max years: assumes data is sorted by date.
        this.startYear = Number(this.data.columns[1]);
        this.endYear = Number(this.data.columns[this.data.columns.length -1]);
            
            this.minPercentage = 80;
            this.maxPercentage = 400;

        for(var i = 0; i < this.data.getRowCount(); i++)
        {
            this.colors.push(color(random(0,255),random(0,255),random(0,255)));
        }

        // Set the min and max percentage, 
        //do a dynamic find min and max in the data source
        this.minPercentage = 80;   
        this.maxPercentage = 400;
    };


       this.destroy = function() {
       };

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // draw the title above the plot    
        this.drawTitle();    

        // draw all y-axis labels
        print(this.mapNutrientsToHeight);
        drawYAxisTickLabels(this.minPercentage,
                            this.maxPercentage,
                            this.layout,
                            this.mapNutrientsToHeight.bind(this),
                            0);
         
         //draw x and y axis
         drawAxis(this.layout); 

        //draw x and y axis labels
         drawAxisLabels(this.xAxisLabel,
                        this.yAxisLabel,
                        this.layout); 
        var numYears = this.endYear - this.startYear;
            
        
        //loop all over the rows and draw
            for(var i=0; i<this.data.getRowCount();i++){//each row each one nutrient
            var row = this.data.getRow(i);
                print("row:"+row);
            var title= row.getString(0);
            var previous =null;
                for(var j=1; j<numYears;j++){
            var current ={"year":this.startYear + j-1,
                          "percentage":row.getNum(j)
                         };
               if(previous!=null){
               stroke(this.colors[i]);
               line(this.mapYearToWidth(previous.year),
               this.mapNutrientsToHeight(previous.percentage),
               this.mapYearToWidth(current.year),
               this.mapNutrientsToHeight(current.percentage));
                
            //draw the x ticks that will be the year
            var xLabelSkip = ceil(numYears/this.layout.numXTickLabels) ;
                
            if(i%xLabelSkip==0){
               var currentTextSize = textSize();
               textSize(9);   drawXAxisTickLabel(previous.year,this.layout,this.mapYearToWidth.bind(this));
            }    
        }else{
                    this.makeLegendItem(title,i,this.colors[i]);
                
                 }

                previous = current;
               }
            }
            this.drawYearBesidesMouse();
            
    };  
        
     this.makeLegendItem = function(label,i,colour){
         
         var boxWidth = 50;
         var boxHeight = 10;
         
         var x = 800;
         var y = 50 + (boxHeight+5) * i;
         
         noStroke();
         fill(colour);
         rect(x,y,boxWidth,boxHeight);
         
         fill("black");
         noStroke()
         textAlign("left" , "center");
         textSize(12);
         text(label,x + boxWidth , y + boxHeight/2);
      } 
     
    this.drawYearBesidesMouse = function(){
        var year =this.mapMouseXToYear(mouseX);
        fill(0);
        noStroke();
        text(year,mouseX,mouseY);
    }    
        
    this.mapMouseXToYear =function(value){
        var v = map(value,
                    this.layout.leftMargin,
                    this.layout.rightMargin,
                    this.startYear,
                    this.endYear);
               return int(v);    
        
    }    
        
    this.drawTitle = function (){
         fill(0);
         noStroke();
         textAlign("center", "center")

        var textX = this.layout.plotWidth()/2 + this.layout.leftMargin;
        var textY = this.layout.topMargin - ( this.layout.marginSize /2);
        text(this.title,textX,textY);
    }

    this.mapYearToWidth = function(value){
        var v = map(value,
                    this.startYear,
                    this.endYear,
                    this.layout.leftMargin,
                    this.layout.rightMargin);
            return v;
        }

    this.mapNutrientsToHeight = function(value){
        var v = map(value,
                    this.minPercentage,
                    this.maxPercentage,
                    this.layout.bottomMargin,
                    this.layout.topMargin);
            return v;
        }
    }