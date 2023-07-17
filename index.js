d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
  .then(function(data) {
    let treemap = d3.treemap()
      .size([500, 500])
      .padding(1);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select(".container")
      .append("svg")
      .attr("id", "treemap")
      .attr("width", 1200)
      .attr("height", 600)
      .style("display", "inline-block");

    let categories = [];

    data.children.forEach((category, i) => {
      if (i === 5 || i === 6) {
        categories.push(category.name);
        let root = d3.hierarchy(category)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        treemap(root);

        let node = svg.selectAll(`.node${i}`)
          .data(root.leaves())
          .enter().append("g")
          .attr("class", `node${i}`)
          .attr("transform", d => `translate(${d.x0 + (i - 5) * 500},${d.y0})`);

        node.append("rect")
          .attr("class", "tile")
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0)
          .attr("fill", () => color(i))
          .attr("data-name", d => d.data.name)
          .attr("data-category", d => d.data.category)
          .attr("data-value", d => d.data.value)
          .on("mouseover", function(e, d) {
            let tooltip = d3.select("body")
              .append("div")
              .attr("id", "tooltip")
              .style("opacity", 0);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.attr("data-value", d.data.value);
            tooltip.html("Name: " + d.data.name + "<br/>" + "Value: " + d.data.value)
                .style("left", (e.pageX) + "px")
                .style("top", (e.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.remove()
          });
      }
    });

    let legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(1050,50)");

    categories.forEach((d, i) => {
      let legendRow = legend.append("g")
        .attr("transform", `translate(0,${i * 20})`);

      legendRow.append("rect")
        .attr("class", "legend-item")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(i + 5));

      legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(d);
    });
  });
