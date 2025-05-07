import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NotProgressingGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    // Sort the data to ensure "Progressing" comes first and "Not Progressing" comes second
    const sortedData = [...data].sort((a, b) => {
      if (a.label === 'Progressing') return -1;
      if (b.label === 'Progressing') return 1;
      return 0;
    });

    // Set up dimensions and margins
    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    // Define custom colors for bars
    const barColors = {
      Progressing: '#A7C957', // Green
      'Not Progressing': '#BC4749', // Red
    };

    // Create scales
    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, 1]) // Since the data is in decimal, the range is from 0 to 1
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create axes
    const xAxis = g =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'middle')
        .style('font-size', '12px');

    const yAxis = g =>
      g.attr('transform', `translate(${margin.left},0)`)
        .call(
          d3.axisLeft(y).tickFormat(d => `${Math.round(d * 100)}%`) // Format y-axis ticks as percentages
        )
        .selectAll('text')
        .style('font-size', '12px');

    // Append axes to the SVG
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    // Add gridlines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#e0e0e0');

    // Add y-axis label
    svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', 0 - height / 2)
      .attr('y', margin.left - 50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Percentage of Students');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold');

    // Create a tooltip
    const tooltip = d3.select(svgRef.current.parentNode)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '5px 10px')
      .style('border-radius', '4px')
      .style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Create bars with custom colors
    svg.append('g')
      .selectAll('rect')
      .data(sortedData)
      .join('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', d => barColors[d.label] || '#CCCCCC') // Assign colors based on label
      .attr('rx', 5) // Add rounded corners
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8); // Highlight bar on hover
        tooltip
          .style('opacity', 1)
          .html(`${d.label}: ${Math.round(d.value * 100)}%`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1); // Reset bar opacity
        tooltip.style('opacity', 0); // Hide tooltip
      });
  }, [data]);

  return <svg ref={svgRef} width="500" height="300"></svg>;
};

export default NotProgressingGraph;