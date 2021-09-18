
// Candy Generator!
// Requires JQuery and D3.

var candy = {"candybar": {"paths": Array("M 357.85362,254.60232 C 353.45057,252.93429 21.078496,252.66671 -0.29183729,254.314 -9.2381626,255.0036 -12.17978,254.78916 -13.625171,253.34201 c -1.533659,-1.53552 -1.854543,-13.23294 -1.854543,-67.60517 v -65.74841 l 180.235924,0.26383 c 161.18977,0.23594 180.66192,0.0435 184.26712,-1.82079 5.02251,-2.59723 23.18071,-2.89862 25.18108,-0.41795 0.8834,1.0955 0.96263,9.20618 0.23121,23.66667 -0.61202,12.1 -1.14336,42.48582 -1.18072,67.52402 -0.0601,40.24162 -0.31266,45.61792 -2.177,46.33334 -3.09164,1.18637 -8.66422,0.79228 -13.22428,-0.93523 z"),
"attrs": [["fill", "#401d02"], ["stroke-width", 1.33333337], ["fill-opacity", 1]],
"transform": "translate(21.002386,1.9093079)"}}

class CandyGen {

    // Copyright © 2021 Vanessa Sochat MIT License
    // See github.com/vsoch/candy-generator for full license

    // Keep record of candy bases!
    items = {
        templates: Object.keys(candy),
        choices: {}
    };

    // The constructor is called when we create a Candy Gen object
    constructor(width, height, divid, resetButton) {

        // Choose a random template to start with
        this.chooseTemplate()
        this.width = width || 800;
        this.height = height || 800;
        this.divid = divid || "#candy";

        // Button identifiers
        this.resetButton = resetButton || "#resetCandy"

        // Variables for the svg, and candy image svg within
        this.svg = null;
        this.img = null;
        this.setTemplate();

        // Setup color choosers
        this.setupChoosers()        
                
        // Tell the user the chosen parameters
        this.status()

        // Event binding for buttons, setup of color picker
        $(this.resetButton).on("click", {client: this}, this.reset);
     
    }

    // Print a status for the user
    status() {
        console.log("template: " + this.items.choices["template"])
    }

    // Choose a template, either randomly or by choice
    chooseTemplate(choice) {
    
        // If a choice is provided and it is in the array
        if (choice != null && this.items.templates.include(choice)) {
            this.items.choices["template"] = choice; 
        
        // Otherwies choose randomly
        } else {
            var index = Math.floor(Math.random() * this.items.templates.length);
            this.items.choices["template"] = candy[this.items.templates[index]];  
        }
    }

    setupChoosers() {
    
        var client = this

        // Fill in options for candy form
        for (var name of this.items.templates) {
            $("#candy-form").append("<option>" + name + "</option>");
        }

        // Callback to update color of candy
        function updateColor (event) {
            console.log("Updating color to " + event.target.value);
            d3.select("#candy-path").attr("fill", event.target.value);
            client.items.choices["color"] = event.target.value;
        }       
        this.colorChooser = document.querySelector("#candy-color");
        this.colorChooser.addEventListener("change", updateColor, false);        
    }

    // set the chosen template
    setTemplate() {

        console.log(this.items.choices['template'])
        var choice = this.items.choices['template']
        d3.select(this.divid).html("");

        this.svg = d3.select(this.divid).append("svg")
          .attr("width", this.width)
          .attr("height", this.height);

        this.group = this.svg.selectAll('paths')
          .data(Array(choice))
          .enter()
          .append("g")
          .attr("transform", function(d) {return d.transform})

        this.paths = this.group.append('svg:path')
          .attr('d', function(d) {return d.paths})
          .attr('id', "candy-path")
          .attr('transform', "scale(2)")

          // Set any attributes provided by default
          .each(function (d) {
              for (var attr of d.attrs) {
                  d3.select(this).attr(attr[0], attr[1])}
              })

         // TODO: this will load a repository name for a candy
         // TODO: need to have backgrounds / textures / "nutrition facts" based on repository metadata
         this.group.append("text")
           .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path")); return center[0]; })
           .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path")); return center[1]; })
           .attr("fill", "white")
           .attr("font-size", 26)
           .text(function(d) { return "HAPPY HALLOWEEN!"; });
    }

    // Reset Choices and Chandy
    reset(event) {
        var client = event.data.client
        client.items.choices = {};
        client.chooseTemplate();
        client.setTemplate();
    }
}

// Helper functions
function getTextLocation (selection) {
  var element = selection.node();
  var bbox = element.getBBox();
  return [bbox.x + 50, bbox.y + bbox.height + 50];
}
