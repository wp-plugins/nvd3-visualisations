
function nvd3Demos(pcs, xmldemo) { // pcs = nro of html containers where charts appearvar xml = false;if (xmldemo)  // XML versions of demos asked	xml = true;// All valid names of chart types// ******************************// simpleline	linePlusBar	scatterbubble	viewfinder	multibar	multibar	// cumulativeline	stackedarea	discretebar	horizontalmultibar	donut	pie	bulletjsChart(pcs, '', 'linePlusBar', {height:'200', width:'350'}, { showLegend: true, tooltips: true, transitionDuration: 3000, useInteractiveGuideline: true, xtime: true, xmldemo: xml });
pcs--;jsChart(pcs, '', 'bullet', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml });pcs--;
jsChart(pcs, '', 'simpleline', {height:'250', width:'300'}, { showLegend: false, transitionDuration:3000, xmldemo: xml });
pcs--;
jsChart(pcs, '', 'scatterbubble', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml });
pcs--;
jsChart(pcs, '', 'viewfinder', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml });
pcs--;
jsChart(pcs, '', 'multibar', {height:'250', width:'300'}, { showLegend: false, xmldemo: xml  });
pcs--;
jsChart(pcs, '', 'cumulativeline', {height:'250', width:'300'}, { showLegend: false, xmldemo: xml  });
pcs--;
jsChart(pcs, '', 'stackedarea', {height:'250', width:'300'}, { showLegend: false, xmldemo: xml  });
pcs--;
jsChart(pcs, '', 'discretebar', {height:'250', width:'300'}, { color: ['red','green','blue','orange','brown','navy','yellow','black'], xmldemo: xml  });
pcs--;
jsChart(pcs, '', 'horizontalmultibar', {height:'250', width:'400'}, { showLegend: false, xmldemo: xml  });
pcs--;
jsChart(pcs, '', 'donut', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml });pcs--;jsChart(pcs, '', 'pie', {height:'250', width:'300'}, { showLegend: true, xmldemo: xml });
}
