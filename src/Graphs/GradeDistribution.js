import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GradeDistribution = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    // Set up dimensions and margins
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    // Define elegant colors for grades
    const gradeColors = {
      A: '#6A994E', // Olive Green
      B: '#A7C957', // Lime Green
      C: '#FFD166', // Beige
      D: '#BC4749', // Brick Red
      F: '#721817', // Dark Red
      W: '#1E90FF'
    };

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create axes
    const xAxis = g =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '12px');

    const yAxis = g =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
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
      .text('Number of Students');

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

    // Create bars with elegant colors
    svg.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', d => gradeColors[d.label] || '#CCCCCC') // Assign colors based on grade
      .attr('rx', 5) // Add rounded corners
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8); // Highlight bar on hover
        tooltip
          .style('opacity', 1)
          .html(`Grade: ${d.label}<br>Students: ${d.value}`)
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

  return <svg ref={svgRef} width="600" height="400"></svg>;
};

export default GradeDistribution;