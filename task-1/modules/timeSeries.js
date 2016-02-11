d3.timeSeries = function(){
    
//internal variable
//will need default variable which can be overwritten later
var w = 800,
    h = 600,
    m = {t:20,r:35,b:20,l:35},  //margins around drawing
    chartW = w - m.l - m.r,
    chartH = h - m.t - m.b,
    timeRange = [new Date(), new Date()],
    binSize,
    maxY = 1200,
    scaleX = d3.time.scale().range([0,chartW]).domain(timeRange),
    scaleY = d3.time.scale().range([chartH,0]).domain([0,maxY]),    
    valueAccessor = function(d){return d;},
    layout = d3.layout.histogram();
    
    //create histogram layout

   
//main function that gets returned
//take data and use histogram layout to transform into a series of (x,y)
//    _selection.each(function(_d){
//            //"selection" --> d3.select('.plot')
//            var data = layout(_d);
//            console.log(data);  //should see x,y coordinates
    
function exports(_selection){
    var bins = binSize.range(timeRange[0],timeRange[1]);
    bins.unshift(timeRange[0]);
    bins.push(timeRange[1]);
    
    layout
        .range(timeRange)
        .bins(bins);

		chartW = w - m.l - m.r,
		chartH = h - m.t - m.b;

		scaleX.range([0,chartW]).domain(timeRange);
		scaleY.range([chartH,0]).domain([0,maxY]);
    
    


		_selection.each(draw);
	}

function draw(d){
    //console.log(d);
    
    var data = layout(d);
    //console.log(data);
    
    //create generators
    var lineGenerator = d3.svg.line()
        .x(function(d){return scaleX(d.x.getTime() + d.dx/2)})
        .y(function(d){return scaleY(d.y)})
        .interpolate('basis');
    
    var areaGenerator = d3.svg.area()
        .x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
		.y0(chartH)
		.y1(function(d){ return scaleY(d.y)})
		.interpolate('basis');

    //axis
    var axisX = d3.svg.axis()
        .orient('bottom')
        .scale(scaleX)
        .ticks(d3.time.year);
    
    
    //append DOM
    //var svg = d3.select(this).append('svg');

    var svg = d3.select(this)
        .selectAll('svg')
        .data([d]);
    
    
//draw the (x,y) as a line and maybe an area as well 
//append div, append svg, append g, append line, append path    
    
// only area seemed to work here... 
//    var svg = d3.select(this)
//        .append('svg')
//        .attr('class','plot_area')
//        .attr('width',w)
//        .attr('height',h);
//    
//    var svgEnter = svg.append('g')
//        .attr('transform','translate('+m.l+','+m.t+')');
//    
//        svgEnter.append('path')
//                .attr('class','line')
//                .datum(data)
//                .attr('d', lineGenerator)
//        
//        svgEnter.append('path')
//                .attr('class','area')
//                .datum(data)
//                .attr('d', areaGenerator)
//        
//        svg.append('g')
//		 .attr('class','axis')
//		 .attr('transform','translate('+m.l+','+(m.t+chartH)+')')
//		 .call(axisX);
//        
        
                
    
	var svgEnter = svg.enter().append('svg')
    
        svgEnter.append('g').attr('class','area')
                .attr('transform','translate('+m.l+','+m.t+')')
                .append('path');
    
        svgEnter.append('g').attr('class','line')
                .attr('transform','translate('+m.l+','+m.t+')')
                .append('path');
    
        svgEnter.append('g').attr('class','axis')
                .attr('transform','translate('+m.l+','+(m.t+chartH)+')');

	    svg.attr('width',w).attr('height',h);

        svg.select('.line')
                .select('path')
                .datum(data)
                .attr('d', lineGenerator);
    
	    svg.select('.area')
			    .select('path')
			    .datum(data)
			    .attr('d',areaGenerator);
      
    //add axis
        svg.select('.axis')
            .call(axisX);
    
    
    
    
}
    

    
    
    
//getters and setters    
//allows us to modify and acces internal variable    
    
exports.width = function(_x){      //underscore is convention for user input
    if(!arguments.length) return w;
    w = _x;
    return this;  //return exports
}
    
exports.height = function(_h){
    if(!arguments.length) return h;
    height = _h;
    return this;  //return exports
        
}    

exports.timeRange = function(_r){
    if(!arguments.length) return timeRange;
    timeRange = _r;
    return this; 
    
}

exports.maxY = function(_y){
	if(!arguments.length) return maxY;
	maxY = _y;
	return this;
}
    
exports.binSize = function(interval){
    if(!arguments.length) return binSize;
    binSize = interval;
    return this;
}    
    
exports.value = function(_accessor){
    if(!arguments.length) return valueAccessor;
    valueAccessor = _accessor;
    layout.value(_accessor);
    return this;
    
}
    
    
    
    
return exports;
    
    
}

