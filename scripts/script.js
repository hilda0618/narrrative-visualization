// Load data and set up the visualization
d3.csv('data/cars2017.csv').then(data => {
    processData(data);
    initVisualization(data);
}).catch(error => {
    console.error('Error loading the data:', error);
});

//process data
function processData(data) {
    data.forEach(d => {
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.AverageCityMPG = +d.AverageCityMPG;
        d.EngineCylinders = +d.EngineCylinders;
    });
}

//initalize scene order and set the first scene
function initVisualization(data) {
    let currentSceneIndex = 0;
    const scenes = [drawScatterPlot, drawHighwayOverview, drawCityMPGOverview, drawImpactOfEngineCylinders];

    const svg = setupSVG();
    updateScene(currentSceneIndex, data, svg);  // Draw the initial scene
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentSceneIndex = Math.max(currentSceneIndex - 1, 0);
        updateScene(currentSceneIndex, data, svg);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        currentSceneIndex = Math.min(currentSceneIndex + 1, scenes.length - 1);
        updateScene(currentSceneIndex, data, svg);
    });

    function updateScene(index, data, svg) {
        scenes[index](data, svg);
    }

}

//set up canvas
function setupSVG() {
    const margin = { top: 50, right: 30, bottom: 60, left: 60 },  // Increased top margin
          width = 1400 - margin.left - margin.right,  // Increased width
          height = 600 - margin.top - margin.bottom;  // Adjusted height

    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    return svg;
}

//draw scattor plot for scene 1
function drawScatterPlot(data, svg) {
    svg.selectAll("*").remove();  // Clear the SVG

    // Show the summary description
    document.getElementById('scatter-description').style.display = 'block';
    
    const margin = {top: 40, right: 100, bottom: 60, left: 80},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const xValue = d => d.AverageCityMPG,
          xScale = d3.scaleLinear().domain([0, d3.max(data, xValue)]).range([0, width]),
          xAxis = d3.axisBottom(xScale);

    const yValue = d => d.AverageHighwayMPG,
          yScale = d3.scaleLinear().domain([0, d3.max(data, yValue)]).range([height, 0]),
          yAxis = d3.axisLeft(yScale);

    // color scale for different fuel type
    const fuelTypes = Array.from(new Set(data.map(d => d.Fuel)));
    const colorScale = d3.scaleOrdinal()
        .domain(fuelTypes)
        .range(d3.schemeCategory10);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "left")
        .style("width", "200px")
        .style("padding", "10px")
        .style("background", "white")
        .style("border", "1px solid #cccccc")
        .style("border-radius", "5px")
        .style("pointer-events", "none");

    // setup x and y scale
    const x = d3.scaleLinear()
        .range([0, width]);

    const y = d3.scaleLinear()
        .range([height, 0]);

    x.domain([0, d3.max(data, d => +d.AverageHighwayMPG)]);
    y.domain([0, d3.max(data, d => +d.AverageCityMPG)]);

    const dots = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", d => d.EngineCylinders > 0 ? d.EngineCylinders * 1.5 : 3) // Scale size by engine cylinders
        .attr("cx", d => x(+d.AverageHighwayMPG))
        .attr("cy", d => y(+d.AverageCityMPG))
        .style("fill", d => colorScale(d.Fuel))
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`Make: ${d.Make}<br>Fuel: ${d.Fuel}<br>Highway MPG: ${d.AverageHighwayMPG}<br>City MPG: ${d.AverageCityMPG}`)
                   .style("left", (event.pageX) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });
        

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text("Average Highway MPG");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 40)
        .text("Average City MPG");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("City vs Highway MPG");

    // legend of fuel types
    const fuelLegend = svg.selectAll(".legend")
        .data(fuelTypes)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width + 20},${i * 25})`)
        .style("cursor", "pointer")
        .on("click", function(event, d) {
            const isActive = !d3.select(this).classed("active");
            fuelLegend.classed("active", false);
            d3.select(this).classed("active", isActive);
            
            if (isActive) {
                dots.style("opacity", dot => dot.Fuel === d ? 1 : 0.1);
            } else {
                dots.style("opacity", 1);
            }
        });

    fuelLegend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

    fuelLegend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d);

    //add annotation
    svg.append("text")
        .attr("class", "annotation")
        .attr("text-anchor", "end")
        .attr("x", 750)
        .attr("y", 0)  // Position the first line
        .text("Electric Fuel performs better")  // First line of text
        .append("tspan")  // Add a <tspan> element for the second line
        .attr("x", 750)  // Align the second line with the first line
        .attr("dy", "1.2em")  // Move the second line down by 1.2 times the font size
        .text("in overall MPG");  // Second line of text
}

//draw bar chart for highway mpg
function drawHighwayOverview(data, svg) {
    // Hide the summary description
    document.getElementById('scatter-description').style.display = 'none';

    // First, clear any existing SVG content
    svg.selectAll("*").remove();

    
    // Calculate the maximum MPG for each make
    const maxMpgPerMake = d3.rollups(data, 
        v => ({
            maxHighwayMPG: d3.max(v, d => d.AverageHighwayMPG),
            maxCityMPG: d3.max(v, d => d.AverageCityMPG),
            Fuel: v[0].Fuel  // Assuming all entries for a make have the same Fuel
        }), 
        d => d.Make);

    // Set up the scales
    const x = d3.scaleBand()
                .range([0, 800])
                .padding(0.1)
                .domain(maxMpgPerMake.map(d => d[0]));  // Car makes

    const y = d3.scaleLinear()
                .range([400, 0])
                .domain([0, d3.max(maxMpgPerMake, d => d[1].maxHighwayMPG)]);  // Max MPG values

    // Define the tooltip div
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "left")
    .style("background", "white")
    .style("border", "1px solid #cccccc")
    .style("padding", "5px")
    .style("pointer-events", "none");

    // Append the x-axis to the svg
    svg.append("g")
       .attr("transform", "translate(0,400)") // Positioning the x-axis at the bottom
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end");

    // Append the y-axis to the svg
    svg.append("g")
       .call(d3.axisLeft(y));

    // Labels for the x-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 800 / 2)  // Centered under the chart
        .attr("y", 470)  // Below the bottom of the chart
        .text("Car Make");

    // Labels for the y-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -150)
        .text("Average Highway MPG");

    // Adding title for the chart
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", 400)
        .attr("y", -20)  // Positioning the title at the top of the chart
        .attr("text-anchor", "middle")
        .style("font-size", "20px")  // Larger font size
        .style("font-weight", "bold")  // Bold text
        .style("font-family", "Arial, sans-serif")  // Font family
        .text("Average Highway MPG by Car Make");

    // Draw bars
    svg.selectAll(".bar")
       .data(maxMpgPerMake)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", d => x(d[0]))
       .attr("width", x.bandwidth())
       .attr("y", d => y(d[1].maxHighwayMPG))
       .attr("height", d => 400 - y(d[1].maxHighwayMPG))
       .attr("fill", "#6aade4")
       .on("mouseover", function(event, d) {
            // Highlight the bar
            d3.select(this).attr('fill', 'pink');

            //show data
            tooltip.style("opacity", 1)
               .html(`Make: ${d[0]}<br>Fuel: ${d[1].Fuel}<br>Highway MPG: ${d[1].maxHighwayMPG}<br>`)
               .style("left", `${event.pageX + 10}px`)
               .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function(d) {
            // Remove highlight
            d3.select(this).attr('fill', '#6aade4');

            // Remove tooltip
            tooltip.style("opacity", 0);
        });
    
    // Add annotation
    svg.append("text")
        .attr("class", "annotation")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(0)")
        .attr("y", 30)
        .attr("x", 800)
        .text("Hyundai has the highest MPG because of Electric Engine.");
}

//draw bar chart for city mpg
function drawCityMPGOverview(data, svg) {
    // First, clear any existing SVG content
    svg.selectAll("*").remove();

    // Calculate the maximum MPG for each make
    const maxMpgPerMake = d3.rollups(data, 
        v => ({
            maxHighwayMPG: d3.max(v, d => d.AverageHighwayMPG),
            maxCityMPG: d3.max(v, d => d.AverageCityMPG),
            Fuel: v[0].Fuel  // Assuming all entries for a make have the same Fuel
        }), 
        d => d.Make);

    // Set up the scales
    const x = d3.scaleBand()
                .range([0, 800])
                .padding(0.1)
                .domain(maxMpgPerMake.map(d => d[0]));  // Car makes

    const y = d3.scaleLinear()
                .range([400, 0])
                .domain([0, d3.max(maxMpgPerMake, d => d[1].maxCityMPG)]);  // Max MPG values

    // Define the tooltip div
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "left")
    .style("background", "white")
    .style("border", "1px solid #cccccc")
    .style("padding", "5px")
    .style("pointer-events", "none");

    // Append the x-axis to the svg
    svg.append("g")
       .attr("transform", "translate(0,400)") // Positioning the x-axis at the bottom
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end");

    // Append the y-axis to the svg
    svg.append("g")
       .call(d3.axisLeft(y));

    // Labels for the x-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 800 / 2)  // Centered under the chart
        .attr("y", 470)  // Below the bottom of the chart
        .text("Car Make");

    // Labels for the y-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -150)
        .text("Average City MPG");

    // Adding title for the chart
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", 400)
        .attr("y", -20)  // Positioning the title at the top of the chart
        .attr("text-anchor", "middle")
        .style("font-size", "20px")  // Larger font size
        .style("font-weight", "bold")  // Bold text
        .style("font-family", "Arial, sans-serif")  // Font family
        .text("Average City MPG by Car Make");

    // Draw bars
    svg.selectAll(".bar")
       .data(maxMpgPerMake)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", d => x(d[0]))
       .attr("width", x.bandwidth())
       .attr("y", d => y(d[1].maxCityMPG))
       .attr("height", d => 400 - y(d[1].maxCityMPG))
       .attr("fill", "#69b3a2") // A different fill color for city MPG
       .on("mouseover", function(event, d) {
            // Highlight the bar
            d3.select(this).attr('fill', 'pink');

            //show data
            tooltip.style("opacity", 1)
               .html(`Make: ${d[0]}<br>Fuel: ${d[1].Fuel}<br>City MPG: ${d[1].maxCityMPG}<br>`)
               .style("left", `${event.pageX + 10}px`)
               .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function(d) {
            // Remove highlight
            d3.select(this).attr('fill', '#69b3a2');

            // Remove tooltip
            tooltip.style("opacity", 0);
        });
    

    // Add annotation
    svg.append("text")
        .attr("class", "annotation")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(0)")
        .attr("y", 30)
        .attr("x", 800)
        .text("Ferrari has the least efficient MPG in city.");
}

//to be implemented
function drawDetailedViewByOrigin(data, svg) {
    svg.selectAll("*").remove(); // Clear the SVG for new drawing
    let originData = data.filter(d => d.Origin === "Japan"); // Filter for Japanese cars

    const x = d3.scaleBand()
        .range([0, 800])
        .padding(0.1)
        .domain(originData.map(d => d.Make));

    const y = d3.scaleLinear()
        .range([400, 0])
        .domain([0, d3.max(originData, d => d.AverageHighwayMPG)]);

    svg.append("g")
       .attr("transform", "translate(0,400)")
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end");

    svg.append("g")
       .call(d3.axisLeft(y));

    // Labels for the x-axis
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 800 / 2)  // Centered under the chart
    .attr("y", 470)  // Below the bottom of the chart
    .text("Car Make");

    // Labels for the y-axis
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -30)
    .attr("x", -150)
    .text("Average Highway MPG");

    // Adding title for the chart
    svg.append("text")
    .attr("class", "chart-title")
    .attr("x", 400)
    .attr("y", -20)  // Positioning the title at the top of the chart
    .attr("text-anchor", "middle")
    .style("font-size", "20px")  // Larger font size
    .style("font-weight", "bold")  // Bold text
    .style("font-family", "Arial, sans-serif")  // Font family
    .text("Average City MPG by Car Make");

    svg.selectAll(".bar")
       .data(originData)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => x(d.Make))
       .attr("width", x.bandwidth())
       .attr("y", d => y(d.AverageHighwayMPG))
       .attr("height", d => 400 - y(d.AverageHighwayMPG))
       .attr("fill", "#de2910");

}

//draw highway vs cylinder chart
/*function drawImpactOfEngineCylinders(data, svg) {
    svg.selectAll("*").remove(); // Clear the SVG for new drawing
    let groupedData = d3.groups(data, d => d.EngineCylinders)
        .map(group => ({
            EngineCylinders: group[0],
            AverageMPG: d3.mean(group[1], d => d.AverageHighwayMPG)
        }));

    const x = d3.scaleBand()
        .range([0, 800])
        .padding(0.1)
        .domain(groupedData.map(d => d.EngineCylinders));

    const y = d3.scaleLinear()
        .range([400, 0])
        .domain([0, d3.max(groupedData, d => d.AverageMPG)]);

    svg.append("g")
       .attr("transform", "translate(0,400)")
       .call(d3.axisBottom(x));


    svg.append("g")
       .call(d3.axisLeft(y));


    // Labels for the x-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 800 / 2)  // Centered under the chart
        .attr("y", 470)  // Below the bottom of the chart
        .text("Cylinder #");

    // Labels for the y-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -200)
        .text("Average MPG");

    // Adding title for the chart
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", 400)
        .attr("y", 0)  // Positioning the title at the top of the chart
        .attr("text-anchor", "middle")
        .style("font-size", "20px")  // Larger font size
        .style("font-weight", "bold")  // Bold text
        .style("font-family", "Arial, sans-serif")  // Font family
        .text("Average MPG by Cylinder");

    svg.selectAll(".bar")
       .data(groupedData)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => x(d.EngineCylinders))
       .attr("width", x.bandwidth())
       .attr("y", d => y(d.AverageMPG))
       .attr("height", d => 400 - y(d.AverageMPG))
       .attr("fill", "#2a9d8f");
}*/

//draw city vs cylinder chart
function drawImpactOfEngineCylinders(data, svg) {
    svg.selectAll("*").remove(); // Clear the SVG for new drawing

    let groupedData = d3.groups(data, d => d.EngineCylinders)
        .map(group => ({
            EngineCylinders: group[0],
            AverageMPG: d3.mean(group[1], d => d.AverageCityMPG)
        }));

    // Sort the grouped data by the number of cylinders
    groupedData.sort((a, b) => d3.ascending(a.EngineCylinders, b.EngineCylinders));

    const x = d3.scaleBand()
        .range([0, 800])
        .padding(0.1)
        .domain(groupedData.map(d => d.EngineCylinders)); // Updated domain after sorting

    const y = d3.scaleLinear()
        .range([400, 0])
        .domain([0, d3.max(groupedData, d => d.AverageMPG)]);

    svg.append("g")
       .attr("transform", "translate(0,400)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .call(d3.axisLeft(y));

    // Labels for the x-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 800 / 2)  // Centered under the chart
        .attr("y", 470)  // Below the bottom of the chart
        .text("Cylinder #");

    // Labels for the y-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -200)
        .text("Average City MPG");

    // Adding title for the chart
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", 400)
        .attr("y", 0)  // Positioning the title at the top of the chart
        .attr("text-anchor", "middle")
        .style("font-size", "20px")  // Larger font size
        .style("font-weight", "bold")  // Bold text
        .style("font-family", "Arial, sans-serif")  // Font family
        .text("Average City MPG by Cylinder");

    svg.selectAll(".bar")
       .data(groupedData)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => x(d.EngineCylinders))
       .attr("width", x.bandwidth())
       .attr("y", d => y(d.AverageMPG))
       .attr("height", d => 400 - y(d.AverageMPG))
       .attr("fill", "#E9D220");
    
    // Add annotation
    svg.append("text")
        .attr("class", "annotation")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(0)")
        .attr("y", 30)
        .attr("x", 800)
        .text("Eletric car with 0 cylinder performs the best");
}




