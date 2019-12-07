let dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
d3.json(dataUrl, (err, data) => {
  if (err) throw err;

  let dataset = data.data;

  let width = 800,
  height = 500,
  padding = 60;

  const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"];


  function getDate(m) {
    let str = m.substring(5, 7);
    return months[Number(str)] + '-' + m.substring(0, 4);
  }

  const maxDate = new Date(dataset[dataset.length - 1][0]);
  const minDate = new Date(dataset[0][0]);

  const xScale = d3.time.scale().
  domain([minDate, maxDate]).
  range([padding, width - padding]);

  const yScale = d3.scale.linear().
  domain([0, d3.max(dataset, d => d[1])]).
  range([height - padding, padding]);

  let tip = d3.tip().
  attr("id", 'tooltip').
  offset([-20, 0]).
  html(function (d) {
    return `<strong> ${getDate(d[0])} </strong><br><stroncg>$ ${d[1]} Billion</strong>`;
  });


  const svg = d3.select('#landmark').
  append('svg').
  attr('width', width).
  attr('height', height).
  append('g').
  attr('transform', 'translate(19, 1)');
  svg.call(tip);


  const xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(d3.time.years, 5);

  const yAxis = d3.svg.axis().scale(yScale).orient('left');

  const xAxisgen = svg.append('g').
  attr('transform', `translate(0, ${height - padding})`).
  attr('id', 'x-axis').
  call(xAxis);

  const yAxisgen = svg.append('g').
  attr({
    transform: `translate(60, 0)`,
    id: 'y-axis' }).

  call(yAxis);


  const bar = svg.selectAll('rect').
  data(dataset).
  enter().
  append('rect').
  attr({
    x: (d, i) => xScale(new Date(d[0])),
    y: (d, i) => yScale(d[1]),
    height: (d, i) => height - padding - yScale(d[1]),
    width: 2.5,
    class: 'bar',
    "data-date": (d, i) => dataset[i][0],
    'data-gdp': (d, i) => dataset[i][1] }).

  on("mouseover", function (d, i) {
    tip.show(d).
    attr("data-date", d[0]);
  }).
  on("mouseout", tip.hide);

});