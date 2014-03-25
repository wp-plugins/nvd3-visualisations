function myData() {
    var series1 = [];
    for(var i =1; i < 100; i ++) {
        series1.push({
            x: i, y: 100 / i
        });
    }

    return [
        {
            key: "Series #1",
            values: series1,
            color: "#0000ff"
        }
    ];
}

charts = new Array();

function svgChart(chartX) {

// console.info(chartX);
charts.push(chartX+' ');

nv.addGraph(function() {
    var chart = nv.models.lineChart();

    chart.xAxis
        .axisLabel("X-axis Label");

    chart.yAxis
        .axisLabel("Y-axis Label")
        .tickFormat(d3.format("d"))
        ;

	var cID = charts.pop();
	d3.select("#chart"+cID+" svg")
        .datum(myData())
        .transition().duration(500).call(chart);

    nv.utils.windowResize(
            function() {
                chart.update();
            }
        );
	return chart;
});

};

function jsChart(id, height, width) {
/*
	if (width)
		width = '';
*/
		var svg = "<svg style='height:"+height+"px;"+width+"'/>";

	$('#chart'+id).empty();
	$('#chart'+id).html(svg);

	svgChart(id);
}