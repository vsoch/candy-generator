
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
    constructor(candy, width, height, divid, resetButton, formButton, githubButton) {

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
        this.githubButton = githubButton || "#github-button"

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
        $(this.githubButton).on("click", {client: this}, this.loadGitHub);
        $(this.saveButton).on("click", {client: this}, this.saveSVG);
     
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
        client.chooseTemplate(form, client);
        client.setTemplate();    
        client.setFacts();
    }

    loadGitHub(event) {
        var client = event.data.client
        var uri = $("#github-uri").val();
        if (uri == "") {
            $.notify("Please enter the name of a repository!", "warning");
            return
        }
        // Split into org/repo
        var parts = uri.split("/")
        if (parts.length != 2) {
            $.notify("The repository should be in the format ORG/NAME", "warning");        
            return
        }

        // Otherwise, make the GitHub call
        fetch('https://api.github.com/repos/' + uri)
		.then(response => response.json())
		.then(data => {
                   console.log(data);
                   window.github_data = data;		
		})
		.catch(error => console.error(error));

        // timeout to see data - yeah yeah I know, imperfect :)
        setTimeout(function(){ client.renderGitHub(client) }, 500);        
    }
     
    // Whatever GitHub data we have, render it
    renderGitHub(client) {
        client.setFacts()
        console.log(window.github_data);
    }

    // Update font color
    setFont(client) {
        var color = client.items.choices["font_color"]
        client.setTemplate();
        client.setFacts();
    }

    // Update title color
    setTitleColor(client) {
        var color = client.items.choices["title_color"]
        client.setTemplate();
        client.setFacts();
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
                   .size(40)
                   .stroke(client.items.choices["texture_color"])
                   .background(client.items.choices['color']);
           client.svg.call(t);
           client.paths.style("fill", t.url());         

        } else if (texture == "circles") {
           var t = textures.circles()
                   .size(40)
                   .fill(client.items.choices["texture_color"])
                   .background(client.items.choices['color']);
           client.svg.call(t);
           client.paths.style("fill", t.url());         

        } else if (texture == "patch") {
           var t = textures.circles()
                   .size(35)
                   .complement()
                   .fill(client.items.choices["texture_color"])
                   .background(client.items.choices['color']);
           client.svg.call(t);
           client.paths.style("fill", t.url());         

        } else if (texture == "honeycomb") {
           var t = textures.paths()
                   .d("hexagons")
                   .size(14)
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
                   .size(40)
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
                   .size(40)
                   .background(client.items.choices['color'])
                   .stroke(client.items.choices["texture_color"]); 
           client.svg.call(t);
           client.paths.style("fill", t.url());                                                   

        } else if (texture == "nylon") {
           var t = textures.paths()
                   .d("nylon")
                   .lighter()
                   .strokeWidth(2)
                   .size(40)
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
                   .size(40)
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

        function updateFont (event) {
            console.log("Updating font color to " + event.target.value);
            client.items.choices["font_color"] = event.target.value;
            client.setFont(client)
        }

        function updateTitleColor (event) {
            console.log("Updating title color to " + event.target.value);
            client.items.choices["title_color"] = event.target.value;
            client.setTitleColor(client)
        }

        this.colorChooser = document.querySelector("#candy-color");
        this.colorChooser.addEventListener("change", updateColor, false);        
        this.textureColorChooser = document.querySelector("#texture-color");
        this.textureColorChooser.addEventListener("change", updateTexture, false);        
        this.fontColorChooser = document.querySelector("#font-color");
        this.fontColorChooser.addEventListener("change", updateFont, false);        
        this.titleColorChooser = document.querySelector("#title-color");
        this.titleColorChooser.addEventListener("change", updateTitleColor, false);        
    }

    // set the chosen template
    setTemplate() {

        var choice = this.items.choices['template']
        d3.select(this.divid).html("");
        var client = this;

        this.svg = d3.select(this.divid).append("svg")
          .attr("id", "svg")
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

         this.group.append("text")
           .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0]; })
           .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1]; })
           .attr("fill", client.items.choices['title_color'])
           .attr("font-size", 26)
           .attr("id", "candy-title")
           .text(function(d) { return "Happy Halloween!"; });    

         // Date the candy for the right year
         this.group.append("text")
           .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0] + 500; })
           .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1] - 10; })
           .attr("fill", "yellow")
           .attr("font-size", 16)
           .text(function(d) { 
             var date = new Date();
             return date.getFullYear()   
           });    

         this.group.append("text")
           .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0]; })
           .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1] + 20; })
           .attr("fill", "yellow")
           .attr("font-size", 14)
           .classed('nutrition-box', true)
           .style('display', 'none')
           .attr("id", "candy-subtitle")
           .text("");    

         // Nutrition facts
         this.group.append('rect')
          .attr('width', '300')
          .attr('height', '60')
          .attr('x', function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0]})
          .attr('y', function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1] + 60})
          .attr('fill', 'rgba(0,0,0,0)')
          .attr('stroke', client.items.choices['font_color'])
          .attr('stroke-dasharray', '10,5')
          .classed('nutrition-box', true)
          .style('display', 'none')
          .attr('stroke-linecap', 'butt')

         // Add text that says NUTRITION FACTS
         this.group.append("text")
           .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0]; })
           .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1] + 55; })
           .attr("fill", client.items.choices['font_color'])
           .attr("font-size", 12)
           .attr("font-family", "Arial")
           .classed('nutrition-box', true)
           .style('display', 'none')
           .text("NUTRITION FACTS");    

         // Hidden spot for eventual avatar image
         this.group.append("svg:image")
           .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0] + 400; })
           .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1] + 10; })
           .attr('width', 100)
           .attr('height', 100)
           .classed('nutrition-box', true)
           .attr('id', 'avatar-image')
           .attr("xlink:href", "")

         var start = 75;
         for (var i=1; i<=5; i++) {
           this.group.append("text")
             .attr("x", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[0] + 5; })
             .attr("y", function(d) { var center = getTextLocation(d3.select("#candy-path"), d.xoffset, d.yoffset); return center[1] + start; })
             .attr("fill", client.items.choices['font_color'])
             .attr("font-size", 10)
             .attr("font-family", "Arial")
             .classed('nutrition-box', true)
             .attr('id', 'nutrition-facts' + i)
             .style('display', 'none')
             .text("");    
           start += 10;
         }
    }

    // Set title for the candy
    setTitle(title) {
        if (title != null) {
           $("#candy-title").text(title);     
        }
    }

    setSubtitle(subtitle) {
        if (subtitle != null) {
           if (subtitle.length > 60) {
               subtitle = subtitle.slice(0, 59) + "..."
           }
           $("#candy-subtitle").text(subtitle);     
        }
    }

    // Set nutrition facts in the box
    setFacts() {
        if (window.github_data != null) {

          this.setTitle(window.github_data['full_name'])
          this.setSubtitle(window.github_data['description'])

          var lang = window.github_data['language']

          var license = "unknown";
          if (window.github_data.license != null) {
              license = window.github_data['license']['name']
          }
          var issues = window.github_data['open_issues']
          var stars = window.github_data['stargazers_count']
          var subscribers = window.github_data['subscribers_count']
          var watchers = window.github_data['watchers_count']
          var size = window.github_data['size']
          var owner = window.github_data['owner']['login']
          var logo = window.github_data['owner']['avatar_url']

          var line1 = "INGREDIENTS: " + "language " + lang + ";";
          var line2 = "license: " + license + ";";
          var line3 = "issues: " + issues + "; stars ⭐️: " + stars + "; watchers 👀️: " + watchers;
          var line4 = "subscribers: " + subscribers + "; " + "size: " + size + ";";
          var line5 = "owner: " + owner + ";";

          $("#nutrition-facts1").text(line1);          
          $("#nutrition-facts2").text(line2);          
          $("#nutrition-facts3").text(line3);          
          $("#nutrition-facts4").text(line4); 
          $("#nutrition-facts5").text(line5); 
          $("#avatar-image").attr("xlink:href", logo);
          $("#avatar-image").attr("src", logo);
          $("#avatar-image").attr("href", logo);
          $(".nutrition-box").show();
        }
    }

    // Reset Choices and Chandy
    reset(event) {
        var client;
        if (event != null) {client = event.data.client} else {client = this}
        this.svg = null;
        this.img = null;
        client.items.choices = {"texture": "solid", "texture_color": "green", "color": "purple", "font_color": "white", "title_color": "white"};
        client.chooseTemplate("crunch");
        client.setTemplate();
        client.setFacts();
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

