import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CustomGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    // Set up dimensions and margins
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    // Grade-like color palette for consistency
    const gradeColors = {
      A: '#6A994E', // Olive Green
      B: '#A7C957', // Lime Green
      C: '#BC4749', // Beige
      D: '#721817', // Brick Red
      F: '#FFFFFF', // Dark Red
    };

    // Fallback color list for non-grade labels
    const fallbackColors = ['#6A994E', '#A7C957', '#BC4749', '#721817'];

    // Custom text labels for bars
    const customTexts = {
      Jets: 'These students withdrew from the class',
      Ghost: 'These students stayed in class, but did not turn in a substantial amount of work',
      Lost: 'Students did poorly in low stakes and high stakes assignments',
      Shocked: 'Students did well in low stakes assignments, but poorly in one or more high stakes assignments',
    };

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 100]) // Multiply by 100 for percentage
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create axes
    const xAxis = g =>
      g.attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'middle')
        .style('font-size', '12px');

    const yAxis = g =>
      g.attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(d => `${d}%`)) // Format ticks as percentages
        .selectAll('text')
        .style('font-size', '12px');

    // Append axes
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    // Gridlines
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

    // Y-axis label
    svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', 0 - height / 2)
      .attr('y', margin.left - 50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Percentage');

    // Tooltip
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

    // Bars with consistent styling
    svg.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value * 100)) // Multiply by 100 for percentage
      .attr('height', d => y(0) - y(d.value * 100)) // Multiply by 100 for percentage
      .attr('width', x.bandwidth())
      .attr('fill', d => gradeColors[d.label] || fallbackColors[data.indexOf(d) % fallbackColors.length])
      .attr('rx', 5)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${d.label}</strong><br>${customTexts[d.label] || 'No description available'}`
          ) // Show custom text and percentage in tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        tooltip.style('opacity', 0);
      });

  }, [data]);

  return <svg ref={svgRef} width="600" height="400"></svg>;
};

export default CustomGraph;