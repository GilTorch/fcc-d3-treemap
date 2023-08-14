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
let globalMousePos = { x: undefined, y: undefined }
window.addEventListener('mousemove', (event) => {
    globalMousePos = { x: event.clientX, y: event.clientY };
  });

const tooltip = select('body').append('div').attr('id', 'tooltip')


const margin = {
    top: 50, 
    bottom: 300,
    left: 50, 
    right: 50
}

const width = window.innerWidth*0.7 - margin.left - margin.right;
const height = window.innerHeight*0.9 - margin.top - margin.bottom;

const drawTreemap = async (dataURL,root) => {
    const data = await json(dataURL)
    console.table(data)
    const treemapRoot = hierarchy(data)
                    .sum(function(d){ return d.value})

    treemap()
        .size([width, height])
        .padding(0.35)
        (treemapRoot)

    const leaves = treemapRoot.leaves();

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
          .attr('x',(d) => { return d.x0; })
          .attr('y',(d) => { return d.y0; })
          .attr('width',(d) => { return d.x1 - d.x0; })
          .attr('height',(d) => { return d.y1 - d.y0; })
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
        .attr("fill", "black")
        .attr('class', 'text')
        .attr('width', 0)
        .attr('height', 0)
        .attr("x", (d) => { return d.x0})    // +10 to adjust position (more right)
        .attr("y", (d) => { return d.y0+10}) 
        .selectAll('tspan')
            .data(d => d.data.name.split(" ").map(element => ({...d, text: element})))
            .enter()
            .append('tspan')
            .append('tspan')  
                .attr('x', d => d.x0)
                .attr('y', (d,i) => 10 + d.y0+i*10)
                .attr('class', 'tspan')
                .text(d => d.text)

        const categories = data.children.map(element => element.name)
 
        const legends = root.append('g')
                            // .attr('class', 'legend-container')
                            // .attr('tranform', `translate(${0},${height+100})`)

      const NUMBER_OF_LEGENDS = categories.length;
      const NUMBER_OF_LEGENDS_PER_COLUMN = 5;
      // const NUMBER_OF_LEGEND_COLUMNS = Math.floor(NUMBER_OF_LEGENDS / NUMBER_OF_LEGENDS_PER_COLUMN) + 1;

      const LEGEND_WIDTH = 20; 
      const LEGEND_HEIGHT = 20;
      
      const LEGEND_SPACING_X = 60;
      const LEGEND_SPACING_Y = 40;

      const LEGEND_TOP_BASE_POSITION = height + 50;
      const LEGEND_LEFT_BASE_POSITION = ((width - LEGEND_WIDTH) / 2) - 100
  

      const legendYPosition = (index, spacing = LEGEND_SPACING_Y) => {
        let indexPosition = index % NUMBER_OF_LEGENDS_PER_COLUMN
        return LEGEND_TOP_BASE_POSITION + indexPosition*spacing;
      } 

      const legendXPosition = (index, spacing = LEGEND_SPACING_X) => {
        const CURRENT_COLUMN = Math.floor(index / NUMBER_OF_LEGENDS_PER_COLUMN)
        return LEGEND_LEFT_BASE_POSITION +  margin.left + CURRENT_COLUMN*spacing
      }
        

      legends.selectAll('.legend')
        .data(categories)
        .join('rect')
            .attr('class', 'legend')
            .attr('fill',d => colorsByCategory[d])
            .attr('x', (_,i) => legendXPosition(i))
            .attr('y', (_,j) =>  legendYPosition(j))
            .attr('width',LEGEND_WIDTH)
            .attr('height',LEGEND_HEIGHT)
         
      const legendText = legends.append('g')
        legendText
        .selectAll('legend-text')
            .data(categories)
            .enter()
            .append('text')
            .attr('class', 'legend-text')
            .text(d => d)
            .attr('fill', 'black')
            .attr('font-size', '12px')
            .attr('x',(_,i) => legendXPosition(i) + 25)
            .attr('y', (_,j) => legendYPosition(j) + (LEGEND_HEIGHT / 2) + 5)
}
          
        const svg = select('#svg-container')
                        .append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)

drawTreemap(videoGameSales, svg)