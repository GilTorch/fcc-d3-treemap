console.log('hello world')
const {
    json,
    select,
    hierarchy,
    treemap
} = d3;

const kickstarterPledges = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
const movieSales = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
const videoGameSales = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"


// Capture mouse positions
let globalMousePos = { x: undefined, y: undefined}
window.addEventListener('mousemove', (event) => {
    globalMousePos = { x: event.clientX, y: event.clientY };
  });

const tooltip = select('body').append('div').attr('id', 'tooltip')


const margin = {
    top: 50, 
    bottom: 50,
    left: 50, 
    right: 50
}

const width = window.innerWidth*0.7 - margin.left - margin.right;
const height = window.innerHeight*0.7 - margin.top - margin.bottom;

const drawTreemap = async (dataURL,root) => {
    const data = await json(dataURL)
    console.table(data)
    const treemapRoot = hierarchy(data)
                    .sum(function(d){ return d.value})

    treemap()
        .size([width, height])
        .padding(2)
        (treemapRoot)

    const leaves = treemapRoot.leaves();

    console.log('Leaves',leaves)

    const colorsByCategory = {
        "Wii": "#4B91C3",
        "GB": "#FFC992",
        "PS2": "#DE5253",
        "SNES": "#D1C0DD",
        "GBA": "#E992CE",
        "2600": "#D2D2D2",
        "NES": "#ADE4A0",
        "DS": "#BED1EC",
        "PS3": "#55B356",
        "3DS": "#FFADAB",
        "PS": "#A2786F",
        "XB": "#F9C5DB",
        "PSP": "#C9CA4E",
        "X360": "#FF993E",
        "NES": "#ADE4A0",
        "PS4": "#A884C9",
        "N64": "#D0B0A9",
        "PC": "#999999",
        "XOne": "#E2E2A4"
    }

    root
        .selectAll("rect")
        .data(leaves)
        .enter()
        .append("rect")
          .attr('x', function (d) { return d.x0; })
          .attr('y', function (d) { return d.y0; })
          .attr('width', function (d) { return d.x1 - d.x0; })
          .attr('height', function (d) { return d.y1 - d.y0; })
          .style("fill", d => colorsByCategory[d.data.category])
          .on('mousemove', ()=> {
            tooltip.style('left', globalMousePos.x+'px');
            tooltip.style('top', globalMousePos.y-80+'px');
          })
          .on('mouseover', (e,d) => {
            const data = d.data; 
            const { name, value, category } = data;
            const html= `
               <p>Name: ${name}</p>
               <p>Value: ${value}</p>
               <p>Category: ${category}</p>
            `
            tooltip.html(html)
            tooltip.style('left', globalMousePos.x+'px');
            tooltip.style('top', globalMousePos.y+'px'-50);
            tooltip.style('opacity',1)
          })
          .on('mouseout', ()=> {
            tooltip.style('opacity',0)
          }) 

    root
        .selectAll("text")
        .data(leaves)
        .enter()
        .append("text")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr('width', 50)
        .attr("x", function(d){ return d.x0})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+10}) 
        .attr('weight',d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('text-overflow', "")
        .selectAll('tspan')
            .data(d => d.data.name.split(" ").map(element => ({...d, text: element})))
            .enter()
            .append('tspan')
                .attr('x', d => d.x0)
                .attr('y', (d,i) => 10 + d.y0+i*10)
                .text(d => d.text)


}

const svg = select('#svg-container')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)


drawTreemap(videoGameSales, svg)