// Chart Params
var svgWidth = 960;
var svgHeight = 500;
var margin = { top: 30, right: 40, bottom: 100, left: 200 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

function val() {
    dd=document.getElementById("selDataset").value;
    loaddata(dd);
  }

  var xTeam = 0;
  var yPoints = 0;
  var ywin = 0;
  var yloose = 0;
  var ydraw = 0;

function loaddata(file) {

  d3.json(`${file}`).then(function(EPLdata) {
    console.log(EPLdata);
    console.log([EPLdata]);
  
    // Format the data
    EPLdata.forEach(function(data) {
      data.W = +data.W;
      data.D = +data.D;
      data.L = +data.L;
      data.P = +data.P;
      data.GP = +data.GP;
      data.GF = +data.GF;
      data.GA = +data.GA;
      data.Dif = +data.Dif;
      data.Standing = +data.Standing;
      data.Season = +data.Season;
    });
    d3.select("svg").remove();
    svg = d3
      .select("body")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    drawline(EPLdata);
  })}

  loaddata("1992-93");

  function drawline(e) {
    // Create scaling functions
   xTeam = d3.scaleBand()
   .domain(e.map(d => d.Team))
   .range([0, width])
   .padding(0.1);
 
   yPoints = d3.scaleLinear()
   .domain([0, d3.max(e, d => d.P)])
   .range([height, 0]);
 
   ywin = d3.scaleLinear()
   .domain([0, d3.max(e, d => d.W)])
   .range([height, 0]);
 
   yloose = d3.scaleLinear()
   .domain([0, d3.max(e, d => d.L)])
   .range([height, 0]);
 
   ydraw = d3.scaleLinear()
   .domain([0, d3.max(e, d => d.D)])
   .range([height, 0]);
 
 // Create two new functions passing our scales in as arguments
 // These will be used to create the chart's axes
 var bottomAxis = d3.axisBottom(xTeam);
 var leftAxis = d3.axisLeft(yPoints).ticks(5);
 var rightAxis = d3.axisRight(ywin);
 
 // Append two SVG group elements to the chartGroup area,
 // and create the bottom and left axes inside of them
 chartGroup.append("g")
   .classed("axis", true)
   .call(leftAxis);
 
 chartGroup.append("g")
   .classed("axis", true)
   .attr("transform", `translate(${width}, 0)`)
   .call(rightAxis);
   
 chartGroup.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis)
   .selectAll("text")	
   .attr("dx", "-60")
   .attr("dy", "-6")
   .attr("transform", "rotate(-90)");
 
 // Line generators for each line
 var lineW = d3.line()
   .x(d => xTeam(d.Team) +(xTeam.bandwidth()/2))
   .y(d => ywin(d.W));
 
 var lineL = d3.line()
   .x(d => xTeam(d.Team) +(xTeam.bandwidth()/2))
   .y(d => ywin(d.L));
 
 var lineD = d3.line()
   .x(d => xTeam(d.Team) +(xTeam.bandwidth()/2))
   .y(d => ywin(d.D));
 
 // Create one SVG rectangle per piece of tvData
 // Use the linear and band scales to position each rectangle within the chart
 chartGroup.selectAll(".bar")
   .data(e)
   .enter()
   .append("rect")
     .attr("class", "bar")
     .attr("x", d => xTeam(d.Team))
     .attr("y", d => yPoints(d.P))
     .attr("width", xTeam.bandwidth())
     .attr("height", d => height - yPoints(d.P))
 
 chartGroup.append("path")
   .data([e])
   .attr("d", lineL)
   .classed("line lost", true);
 
 chartGroup.append("path")
   .data([e])
   .attr("d", lineW)
   .classed("line won", true);
 
 chartGroup.append("path")
   .data([e])
   .attr("d", lineD)
   .classed("line drawn", true);

  chartGroup.append("text")
  .attr("transform", `translate(${width -350}, ${height -390})`)
    .classed("won", true)
    .text("Won matches");

  chartGroup.append("text")
  .attr("transform", `translate(${width -250}, ${height -390})`)
    .classed("lost", true)
    .text("Lost matches");

  chartGroup.append("text")
   .attr("transform", `translate(${width -150}, ${height -390})`)
     .classed("drawn", true)
     .text("Drawn matches");
    
  chartGroup.append("text")
    .attr("dx", "-250")
    .attr("dy", "-30")
    .attr("transform", "rotate(-90)")
    .text("Obtained Points");

  chartGroup.append("text")
    .attr("dx", "-250")
    .attr("dy", "760")
    .attr("transform", "rotate(-90)")
    .text("Total Matches");
}