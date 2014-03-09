(function () {
    createFloatingFrame('energySmoothie', 284, 44, {'rememberPosition': true,'offset':'topCenter','left':337});
    var energyCanvas = "<canvas id='energySmoothieChart' class='smoothieChart' height='40' width='280'> </canvas>";
	$("#energySmoothie_content").append(energyCanvas);


    createFloatingFrame('metalSmoothie', 284, 44, {'rememberPosition': true,'offset':'topCenter','left':-610});
    var metalCanvas = "<canvas id='metalSmoothieChart' class='smoothieChart' height='40' width='280'> </canvas>";
    $("#metalSmoothie_content").append(metalCanvas);

    handlers.army = function (payload) {
        model.currentEnergy(payload.energy.current);
        model.maxEnergy(payload.energy.storage);
        model.energyGain(payload.energy.production);
        model.energyLoss(payload.energy.demand);

        model.currentMetal(payload.metal.current);
        model.maxMetal(payload.metal.storage);
        model.metalGain(payload.metal.production);
        model.metalLoss(payload.metal.demand);
    }

    model.energyGain = ko.observable(1.0);
    model.energyLoss = ko.observable(1.0);
    model.metalGain = ko.observable(1.0);
    model.metalLoss = ko.observable(1.0);

   function rangeFunction(range) {
	  // TODO implement your calculation using range.min and range.max
	  var min = 0;
	  var max = range.max;
      var max = Math.round(max);

	  return {min: min, max: max};
	}
    //{millisPerPixel:100,grid:{fillStyle:'rgba(0,0,0,0.17)',sharpLines:true,millisPerLine:10000,verticalSections:20},labels:{disabled:true}}
    var energyChart = new SmoothieChart({millisPerPixel:350, 
    									grid:{millisPerLine:10000, 
    										fillStyle:'rgba(0,0,0,0.85)',
    										strokeStyle:'rgba(255,255,255,0.25)',
    										interpolation:'bezier',
    										verticalSections:5,
    										sharpLines:true},
    									labels:{disabled:false,
                                            fontFamily:'Sansation Bold',
                                            precision:0,
                                            fontSize:10 },
    									yRangeFunction:rangeFunction});
	
	var metalChart = new SmoothieChart({millisPerPixel:350, 
    									grid:{millisPerLine:10000, 
    										fillStyle:'rgba(0,0,0,0.85)',
    										strokeStyle:'rgba(255,255,255,0.25)',
    										interpolation:'bezier',
    										verticalSections:5,
    										sharpLines:true},
    									labels:{fontFamily:'Sansation Bold',
                                            precision:0,
                                            fontSize:10},
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
	energyChart.addTimeSeries(energyUsage,{strokeStyle:'#848484',lineWidth:2,fillStyle:'rgba(105,105,105,0.75)'});
	energyChart.addTimeSeries(energyIncome,{strokeStyle:'#ddd01f',lineWidth:2});

	metalChart.addTimeSeries(metalUsage,{strokeStyle:'#848484',lineWidth:2,fillStyle:'rgba(105,105,105,0.75)'});
	metalChart.addTimeSeries(metalIncome,{strokeStyle:'#01b3f4',lineWidth:2});


	energyChart.streamTo(document.getElementById("energySmoothieChart"),5);
	metalChart.streamTo(document.getElementById("metalSmoothieChart"),5);
})();