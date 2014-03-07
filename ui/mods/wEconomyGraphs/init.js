$(document).ready(function () {

    createFloatingFrame('energySmoothie', 320, 58, {'offset': 'topRight', 'left': -320});
    var energyCanvas = "<canvas id='energySmoothieChart' height='40' width='280'> </canvas>";
	$("#energySmoothie_content").append(energyCanvas);


    createFloatingFrame('metalSmoothie', 320, 58, {'offset': 'topRight', 'left': -320});
    var metalCanvas = "<canvas id='metalSmoothieChart' height='40' width='280'> </canvas>";
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