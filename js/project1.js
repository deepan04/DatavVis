 var chartGroup = "chartGroup";
var heatmapChart = dc.heatMap("#heatmap",chartGroup);
var barChart = dc.barChart("#barchart",chartGroup);

// var rowChart = dc.rowChart("#time");
// var pieChart= dc.pieChart("#class");
// var lineChart= dc.lineChart("#stackline")

var gridDimension,gridGroup,restDimension,restGroup;
var x=0;

d3.csv("data/Final_merge_hour.csv", function(error, experiments) {
  experiments.forEach(function(x) {
    x.count_ratio_uber= +x.count_ratio_uber;
    x.count_ratio_crime= +x.count_ratio_crime;
    x.count_ratio_food= +x.count_ratio_food;
    x.count_ratio_yellow= +x.count_ratio_yellow;
    x.count_ratio_green= +x.count_ratio_green;
    x.count_ratio_taxi= +x.count_ratio_taxi;
  });
  ndx = crossfilter(experiments),
  dimensionAndGroups();
  drawGraph();
});

function dimensionAndGroups()
{

  gridDimension=ndx.dimension(function(d) {return [d.gridRow, d.gridColumn];}),
  gridGroup=  gridDimension.group().reduceSum(function(d) {return (d.count_ratio_uber);});

  restDimension=ndx.dimension(function(d) {return +d.gridRow;}),
  restGroup=  restDimension.group().reduceSum(function(d) {return d.count_ratio_food*3890;});
  // classDimension=ndx.dimension(function(d) { return d.Class;}),
  // classGroup=classDimension.group().reduceSum(function(d) {return d.count_ratio_uber;});
  // hourDimension=ndx.dimension(function(d) {return +d.hour;}),
  // uberGroup=hourDimension.group().reduceSum(function(d) { if(d.Class=="Uber"){return d.count_ratio_uber;}else{return d.count_ratio_taxi;}});
  // crimeGroup=hourDimension.group().reduceSum(function(d) {return d.count_ratio_crime;});

};

function drawGraph()
{
  var colors = d3.scale.category10();
  //var color = d3.scale.category20b();

  var heatColorMapping = d3.scale.linear()
              .domain([200000,50000,13])
              .range(["red", "#e5e5e5", "green"]);


  heatmapChart
                  .dimension(gridDimension)
                  .group(gridGroup)
                  .keyAccessor(function(d) { return +d.key[0]; })
                  .valueAccessor(function(d) { return +d.key[1]; })
                  .colorAccessor(function(d) { return +d.value*1021836; })
                  .title(function(d) {
                      return " Row:   " + d.key[0] + "\n" +
                             " Column:   " + d.key[1] + "\n" +
                             " Uber:   " + d.value*1021836;})
                  .colors(heatColorMapping)
                  .renderlet(function(chart){
       chart.selectAll('rect').each(function(d){
            d3.select(this).attr("style", "fill: " + heatColorMapping(+d.value*1021836));
})
});
                  //  .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
                  // .calculateColorDomain();

heatmapChart.render();

barChart
                .dimension(restDimension)
                .group(restGroup)
                .brushOn(true)
                .centerBar(true)
                .x(d3.scale.linear().domain([0,18]))
                .xAxis().ticks(20);

        barChart.render();

//   rowChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
//             .margins({top: 20, left: 10, right: 10, bottom: 20})
//             .group(timeGroup)
//             .dimension(timeDimension)
//
//             .colors(colors)
//             .title(function (d) {
//                    return d.value;
//                })
//               //  .elasticX(true)
//             .xAxis();
//
//   pieChart
//     .colors(colors)
//      .radius(200)
//     // .slicesCap()
//     .innerRadius(50)
//     .dimension(classDimension)
//     .group(classGroup)
//     .legend(dc.legend().x(85).y(10).itemHeight(33).gap(5))
//
//     .on('pretransition', function(chart) {
//
//         chart.selectAll('text.pie-slice').text(function(d) {
//             return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
//         // chart.selectAll('')
//         })
//     });
//
// lineChart
// .renderArea(true)
// .brushOn(true)
// .transitionDuration(1000)
// .margins({top: 30, right: 50, bottom: 45, left: 40})
// .dimension(hourDimension)
// //.rangeChart(volumeChart)
// .x(d3.scale.ordinal().domain(hourDimension))
// //  .round(d3.time.month.round)
// .xUnits(dc.units.ordinal)
// .elasticY(true)
// .renderHorizontalGridLines(true)
// .group(uberGroup)
// .valueAccessor(function (d) {
//      return d.value;
//  })
//  .stack(crimeGroup, 'Crime Count', function (d) {
//             return d.value;
//         })
//  .renderlet(function (chart) {
// // rotate x-axis labels
//
//  chart.selectAll('g.x text')
//  .style("font-size","14px")
// .attr('transform', 'translate(12,20) rotate(90)');
// });




 // dc.renderAll();
};
