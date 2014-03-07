$(function () {
    var energyCanvas = $('<canvas/>',{'id':'energySmoothieChart'})
    .width(280)
    .height(76)
	$("body").append(energyCanvas);

    var metalCanvas = $('<canvas/>',{'id':'metalSmoothieChart'})
    .width(280)
    .height(76);
    $("body").append(metalCanvas);

    

   function rangeFunction(range) {
	  // TODO implement your calculation using range.min and range.max
	  var min = 0;
	  var max = range.max + range.max/20;
	  return {min: min, max: max};
	}
    //{millisPerPixel:100,grid:{fillStyle:'rgba(0,0,0,0.17)',sharpLines:true,millisPerLine:10000,verticalSections:20},labels:{disabled:true}}
    var energyChart = new SmoothieChart({millisPerPixel:350, 
    									grid:{millisPerLine:10000, 
    										fillStyle:'rgba(0,0,0,0.75)',
    										strokeStyle:'rgba(255,255,255,0.25)',
    										interpolation:'bezier',
    										verticalSections:10,
    										sharpLines:true},
    									labels:{disabled:true},
    									yRangeFunction:rangeFunction});
	
	var metalChart = new SmoothieChart({millisPerPixel:350, 
    									grid:{millisPerLine:10000, 
    										fillStyle:'rgba(0,0,0,0.75)',
    										strokeStyle:'rgba(255,255,255,0.25)',
    										interpolation:'bezier',
    										verticalSections:10,
    										sharpLines:true},
    									labels:{disabled:true},
    									yRangeFunction:rangeFunction});


	var energyUsage = new TimeSeries();
	var energyIncome = new TimeSeries();
	var metalUsage = new TimeSeries();
	var metalIncome = new TimeSeries();
	setInterval(function() {
		  energyIncome.append(new Date().getTime(), model.energyGain());
		  energyUsage.append(new Date().getTime(), model.energyLoss());
		  metalIncome.append(new Date().getTime(), model.metalGain());
		  metalUsage.append(new Date().getTime(), model.metalLoss());
	});
	energyChart.addTimeSeries(energyUsage,{strokeStyle:'#850505',lineWidth:0,fillStyle:'rgba(254,1,39,0.50)'});
	energyChart.addTimeSeries(energyIncome,{strokeStyle:'#ddd01f',lineWidth:2});

	metalChart.addTimeSeries(metalUsage,{strokeStyle:'#850505',lineWidth:0,fillStyle:'rgba(254,1,39,0.50)'});
	metalChart.addTimeSeries(metalIncome,{strokeStyle:'#01b3f4',lineWidth:2});


	energyChart.streamTo(document.getElementById("energySmoothieChart"),5);
	metalChart.streamTo(document.getElementById("metalSmoothieChart"),5);
});