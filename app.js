d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  // Populate dropdown menu with only one test subject ID
  // data contains information about samples and metadata
  var dropdownMenu = d3.select("#selDataset");
  // initiates the process of populating a dropdown menu (#selDataset) with options based 
  // on the test subject IDs (data.names).
  var initialOption = dropdownMenu.append("option").text(data.names[0]).property("value", data.names[0]);

  // Initial call to update bar chart with the first test subject ID
  // calls the updateCharts() function
  updateCharts(data.names[0]);

  // Update function for dropdown change
  dropdownMenu.on("change", function() {
    var selectedID = this.value;
    updateCharts(selectedID);
  });
});

function updateCharts(selectedID) {
    // Retrieve data for the selected test subject
    // another HTTP GET request is made to fetch the JSON data again
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
      var samples = data.samples.find(sample => sample.id === selectedID);
     // selects the top 10 OTU IDs (otu_ids), corresponding sample values (sample_values), and labels (otu_labels).
      var otu_ids = samples.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      var sample_values = samples.sample_values.slice(0, 10).reverse();
      var otu_labels = samples.otu_labels.slice(0, 10).reverse();
  
      // Create horizontal bar chart
      var traceBar = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        type: "bar",
        orientation: "h"
      };
  
      var layoutBar = {
        title: "Top 10 OTUs",
        yaxis: { title: "OTU IDs" }
      };
  // creates the Plotly traces and layouts for both charts
      Plotly.newPlot("bar", [traceBar], layoutBar);
  
      // Create bubble chart
      var traceBubble = {
        x: samples.otu_ids,
        y: samples.sample_values,
        text: samples.otu_labels,
        mode: 'markers',
        marker: {
          size: samples.sample_values,
          color: samples.otu_ids
        }
      };
  
      var layoutBubble = {
        xaxis: { title: 'OTU IDs' },
      };
  // creates the Plotly traces and layouts for both charts
      Plotly.newPlot('bubble', [traceBubble], layoutBubble);
            // Display sample metadata
            // updates the sample metadata displayed in the HTML element with the ID sample-metadata
            var metadata = data.metadata.find(metadata => metadata.id === parseInt(selectedID));
            var metadataDiv = d3.select("#sample-metadata");
            // clears the previous data
            metadataDiv.html(""); 
      
            Object.entries(metadata).forEach(([key, value]) => {
              metadataDiv.append("p").text(`${key}: ${value}`);
            });
          });
      }
      

