// box plot javascript code


d3.json("/age").then(response => {
    var trace = [];
    var data= [];
    var layout = {
        title: 'Age of Male Olympians through the Years',
        showlegend: false
      };
    response.forEach(el => {
        Object.entries(el).forEach(([key, value]) => {
            trace[el] = {
                y: value,
                type: "box",
                name: key,
                marker: {
                    color: "rgb(8,81,156)",
                    outliercolor: "rgba(219, 64, 82, 0.6)",
                    line: {
                        outliercolor: "rgba(219, 64, 82, 1.0)",
                        outlierwidth: 2
                    }
                },
                boxpoints: "suspectedoutliers"
            };
            data.push(trace[el]);
        })
    })
    return Plotly.newPlot('graph', data, layout, {displayModeBar: false});
})



// connected scatterplot javascript code

d3.json("/buildAll").then(response => {
    // set the dimensions and margins of the graph
    console.log("buildAll json is working!") 
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
         width = 460 - margin.left - margin.right,
         height = 400 - margin.top - margin.bottom;
     // append the svg object to the body of the page
     var svg = d3.select("#connected_scatter")
         .append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
         .append("g")
             .attr("transform",
                 "translate(" + margin.left + "," + margin.top + ")");
     //Read the data
     response.forEach(el => {
         Object.entries(el).forEach(function([year, yBuildData]) { 
            var row = metaData.append("p");
            row.text(`${year}: ${yBuildData}`);
          }) 
     }) 
     // Now use this dataset to make scatterplot:
     function buildScatter (data) {
        // Add X axis --> year
        var x = d3.scaleTime()
        .domain(d3.extent(data, data => data.yBuildData))
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        // Add Y axis
        var y = d3.scaleLinear()
        .domain(d3.extent(data, data => data.year))
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));
        // Add the line
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#9eb6c1")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.yBuildData) })
            )
        .on("mouseover", function(d) {   
            d3.select(this).attr("stroke-width", 3)
                .style("stroke", "#63031a");
            div.transition()        
                .duration(70)      
                .style("opacity", .7);      
            div .html(formatTime(d.date) + "<br/>"  + d.close)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            d3.select(this).attr("stroke-width", 1.5)
                .style("stroke", "#9eb6c1");
            div.transition()        
                .duration(200)      
                .style("opacity", 0);   
        });
        // Add the points
        svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return x(d.year) } )
            .attr("cy", function(d) { return y(d.yBuildData) } )
            .attr("r", 2)
            .attr("fill", "#9eb6c1")
     })
})
