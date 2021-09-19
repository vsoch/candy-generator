
// Candy Generator!
// Requires JQuery and D3 and a candy.json!


class CandyGen {

    // Copyright © 2021 Vanessa Sochat MIT License
    // See github.com/vsoch/candy-generator for full license

    // Keep record of candy bases!
    items = {
        templates: [],
        choices: {}
    };

    // The constructor is called when we create a Candy Gen object
    constructor(candy, width, height, divid, resetButton, formButton) {

        // Choose a random template to start with
        this.width = width || 800;
        this.height = height || 500;
        this.divid = divid || "#candy";

        // Loaded candy json
        this.candy = candy;
        this.items.templates = Object.keys(this.candy);

        // Button identifiers
        this.resetButton = resetButton || "#resetCandy"
        this.textureButton = resetButton || "#candy-texture"
        this.formButton = formButton || "#candy-form"

        // Variables for the svg, and candy image svg within
        this.reset();

        // Setup color choosers
        this.setupChoosers()        
                
        // Tell the user the chosen parameters
        this.status()

        // Event binding for buttons, setup of color picker
        $(this.resetButton).on("click", {client: this}, this.reset);
        $(this.textureButton).on("change", {client: this}, this.changeTexture);
        $(this.formButton).on("change", {client: this}, this.changeForm);
     
    }

    // Print a status for the user
    status() {
        console.log("template: " + this.items.choices["template"])
    }

    // Choose a template, either randomly or by choice
    chooseTemplate(choice, client) {
    
        client = client || this
                    
        // If a choice is provided and it is in the array
        if (choice != null && client.items.templates.includes(choice)) {
            var choice = client.items.choices["template"] = this.candy[choice];  
            this.items.choices["template"] = choice; 
            
        // Otherwies choose randomly
        } else {
            var index = Math.floor(Math.random() * client.items.templates.length);
            client.items.choices["template"] = this.candy[client.items.templates[index]];  
        }
    }
  
    // Set the candy texture
    changeTexture(event) {
        var client = event.data.client
        var texture = $(this).val();
        client.setTexture(texture, client)    
    }

    // Change the candy form (background)
    changeForm(event) {
        var client = event.data.client
        var form = $(this).val();
        client.chooseTemplate(form, client)
        client.setTemplate()    
    }
       
    // Actually set a texture
    setTexture(texture, client) {

        // If no client provided, use this
        client = client || this

        // Default texture is current
        texture = texture || client.items.choices['texture']

        // If solid texture, set fill to selected color
        if (texture == "solid") {
             console.log("updating texture")
             client.paths.style("fill", client.items.choices['color']); 

        // Diagonal lines
        } else if (texture == "lines") {
           var t = textures.lines()
                   .orientation("diagonal")
                   .size(40)
                   .strokeWidth(26)
                   .stroke(client.items.choices["color"])
                   .background(client.items.choices['texture_color']);
           client.svg.call(t);
           client.paths.style("fill", t.url());

        } else if (texture == "checkers") {
           var t = textures.lines()
                   .orientation("3/8", "7/8")
                   .stroke(client.items.choices["texture_color"])
                   .background(client.items.choices['color']);
           client.svg.call(t);
           client.paths.style("fill", t.url());         

        } else if (texture == "circles") {
           var t = textures.circles()
                   .fill(client.items.choices["texture_color"])
                   .background(client.items.choices['color']);
           client.svg.call(t);
           client.paths.style("fill", t.url());         

        } else if (texture == "patch") {
           var t = textures.circles()
                   .complement()
                   .fill(client.items.choices["texture_color"])
                   .background(client.items.choices['color']);
           client.svg.call(t);
           client.paths.style("fill", t.url());         

        } else if (texture == "honeycomb") {
           var t = textures.paths()
                   .d("hexagons")
                   .size(8)
                   .strokeWidth(2)
                   .background(client.items.choices['color'])
                   .stroke(client.items.choices["texture_color"]);
           client.svg.call(t);
           client.paths.style("fill", t.url());         

        } else if (texture == "caps" || texture == "crosses" || texture == "woven") {
           var t = textures.paths()
                   .d(texture)
                   .lighter()
                   .thicker()  
                   .strokeWidth(2)
                   .background(client.items.choices['color'])
                   .stroke(client.items.choices["texture_color"]);
           client.svg.call(t);
           client.paths.style("fill", t.url());                         

        } else if (texture == "waves") {
           var t = textures.paths()
                   .d("waves")
                   .thicker()
                   .strokeWidth(2)
                   .background(client.items.choices['color'])
                   .stroke(client.items.choices["texture_color"]); 
           client.svg.call(t);
           client.paths.style("fill", t.url());                                                   

        } else if (texture == "nylon") {
           var t = textures.paths()
                   .d("nylon")
                   .lighter()
                   .strokeWidth(2)
                   .shapeRendering("crispEdges")
                   .background(client.items.choices['color'])
                   .stroke(client.items.choices["texture_color"]); 
           client.svg.call(t);
           client.paths.style("fill", t.url());                                                   

        } else if (texture == "squares") {
           var t = textures.paths()
                   .d("squares")
                   .thicker()
                   .strokeWidth(2)
                   .background(client.items.choices['color'])
                   .stroke(client.items.choices["texture_color"]); 
           client.svg.call(t);
           client.paths.style("fill", t.url());                                                   
        }
        client.items.choices['texture'] = texture;
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
            client.setTexture(client.items.choices["texture"], client)
        }       
        function updateTexture (event) {
            console.log("Updating texture color to " + event.target.value);
            client.items.choices["texture_color"] = event.target.value;
            client.setTexture(client.items.choices["texture"], client)
        }

        this.colorChooser = document.querySelector("#candy-color");
        this.colorChooser.addEventListener("change", updateColor, false);        
        this.textureColorChooser = document.querySelector("#texture-color");
        this.textureColorChooser.addEventListener("change", updateTexture, false);        
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
          .attr('transform', function(d) {return "scale("+ d.scale + ")"})

          // Set any attributes provided by default
          .each(function (d) {
              for (var attr of d.attrs) {
                  d3.select(this).attr(attr[0], attr[1])
                     if (attr[0] == "fill") {
                       d3.select("#candy-color").value = attr[1];                      
                     }
                  }
              })

         // TODO: this will load a repository name for a candy
         // TODO: "nutrition facts" based on repository metadata
         this.group.append("text")
           .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0]; })
           .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1]; })
           .attr("fill", "white")
           .attr("font-size", 26)
           .text(function(d) { return "HAPPY HALLOWEEN!"; });
    }

    // Reset Choices and Chandy
    reset(event) {
        var client;
        if (event != null) {client = event.data.client} else {client = this}
        this.svg = null;
        this.img = null;
        client.items.choices = {"texture": "solid", "texture_color": "green", "color": "purple"};
        client.chooseTemplate("hersheys");
        client.setTemplate();
    }
}

// Helper functions
function getTextLocation (selection, xoffset, yoffset) {
  var element = selection.node();
  var bbox = element.getBBox();
  return [bbox.x + xoffset, bbox.y + yoffset];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}