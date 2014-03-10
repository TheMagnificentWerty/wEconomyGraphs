$(function () {

    var time;
    var alphaTime;
    var syncedTime;
    var actualSyncedTime;
    actualSyncedTime = -100;
var trySyncInterval;


     function syncTime(alpha) {
        alphaTime = alpha;
     }
    function startAndSyncCounterAt(seconds) {
        time = Math.floor(seconds);
        clearInterval(trySyncInterval);
        trySyncInterval = setInterval(function() {
               time = time + 1;
               syncedTime = time + alphaTime;
               if(syncedTime + 100 > actualSyncedTime) {
                    actualSyncedTime = actualSyncedTime + 100;
               }
               //console.log(time);
            },10
        );
    }
    startAndSyncCounterAt(model.currentTimeInSeconds());
    setInterval(function(){
                startAndSyncCounterAt(model.currentTimeInSeconds()*1000);
            },100000);

    createFloatingFrame('energySmoothie', "auto", "auto", {'rememberPosition': true,'offset':'topCenter','left':337});
    var energyCanvas = "<canvas id='energySmoothieChart' class='smoothieChart'> </canvas>";
	$("#energySmoothie_content").append(energyCanvas);
    $("#energySmoothie").addClass("smoothieContent");
    $("#energySmoothieChart").resizable({
      grid: 20,
       maxHeight: 150,
      maxWidth: 1280,
      minHeight: 50,
      minWidth: 200
    });

    createFloatingFrame('metalSmoothie', "auto", "auto", {'rememberPosition': true,'offset':'topCenter','left':-610});
    var metalCanvas = "<canvas id='metalSmoothieChart' class='smoothieChart'> </canvas>";
    $("#metalSmoothie_content").append(metalCanvas);
    $("#metalSmoothie").addClass("smoothieContent");
    $("#metalSmoothieChart").resizable({
      grid: 20,
       maxHeight: 150,
      maxWidth: 1280,
    });

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
    oldTime =0 ;
    oldRealTime=0;
    SmoothieChart.timeFormatter = function(date) {
        var secondsFromEpochInChart = date.getTime()/1000;
        //console.log(secondsFromEpochInChart);
        var nowDate = new Date();
        var secondsFromEpochNow = nowDate.getTime()/1000;

        var differenceFromGameStart = secondsFromEpochNow-secondsFromEpochInChart;
        

        var secondsFromGameStart = syncedTime/100;

        var dateDecimals = Math.floor(date.getTime()/1000) - date.getTime()/1000;
        var timeDecimals = Math.floor(time/100) - time/100;

        var syncBy = (timeDecimals - dateDecimals) * 100;

        syncTime(syncBy);
        

        var chartTime = secondsFromGameStart - differenceFromGameStart;

        var roundedChartTime = Math.floor(chartTime - (chartTime % 5));

        var splitBythirty = roundedChartTime/30
        var splitBythirtyrounded = Math.round(roundedChartTime/30);

       // if(splitBythirty != splitBythirtyrounded) {
       //    return "";
       // }
       // else {
            var timeDate = new Date(roundedChartTime * 1000);

            var seconds = roundedChartTime % 60;
            var minutes = Math.floor((roundedChartTime % (60*60)) / 60);
            var hours = Math.floor(roundedChartTime / (60 * 60));
            function pad2(number) { return (number < 10 ? '0' : '') + number }


            var timeString = pad2(seconds);
            if(minutes >0 && hours >0) {
                timeString = pad2(minutes)+":".concat(timeString);
            }
            else if(minutes >0) {
                timeString = minutes+":".concat(timeString);
            }

            if(hours > 0) {
                timeString = hours+":".concat(timeString);
            }

            return "-"+Math.round(differenceFromGameStart);
       //}
        
    };
    
    //SmoothieChart.timeFormatter = function() {
         
//return 1;
    //};
    //{millisPerPixel:100,grid:{fillStyle:'rgba(0,0,0,0.17)',sharpLines:true,millisPerLine:10000,verticalSections:20},labels:{disabled:true}}
    var energyChart = new SmoothieChart({millisPerPixel:100, 
                                        timestampFormatter:SmoothieChart.timeFormatter,
    									grid:{millisPerLine:5000, 
    										fillStyle:'rgba(0,0,0,0.85)',
    										strokeStyle:'rgba(255,255,255,0.25)',
                                            strokeStyleWhenTimeLabeled:"rgba(255,255,255,0.70)",
    										interpolation:'bezier',
    										verticalSections:5,
    										sharpLines:true},
    									labels:{disabled:false,
                                            fontFamily:'Sansation Bold',
                                            fillStyle:'rgba(255,255,255,0.60)',
                                            precision:0,
                                            fontSize:10 },
    									yRangeFunction:rangeFunction});
	
	var metalChart = new SmoothieChart({millisPerPixel:30,
                                        timestampFormatter:SmoothieChart.timeFormatter,
    									grid:{millisPerLine:5000, 
    										fillStyle:'rgba(0,0,0,0.85)',
    										strokeStyle:'rgba(255,255,255,0.25)',
                                            strokeStyleWhenTimeLabeled:"rgba(255,255,255,0.70)",
    										interpolation:'bezier',
    										verticalSections:5,
    										sharpLines:true},
    									labels:{fontFamily:'Sansation Bold',
                                            precision:0,
                                            fillStyle:'rgba(255,255,255,0.60)',
                                            fontSize:10},
    									yRangeFunction:rangeFunction});


	var energyUsage = new TimeSeries();
	var energyIncome = new TimeSeries();
	var metalUsage = new TimeSeries();
	var metalIncome = new TimeSeries();
    var oldtime = 0;
	setInterval(function() {

		//energyIncome.append(new Date().getTime(), model.energyGain());
		//energyUsage.append(new Date().getTime(), model.energyLoss());
		metalIncome.append(new Date().getTime(), model.metalGain());
		metalUsage.append(new Date().getTime(), model.metalLoss());
          
	},100);
	//energyChart.addTimeSeries(energyUsage,{strokeStyle:'#848484',lineWidth:2,fillStyle:'rgba(105,105,105,0.75)'});
	//energyChart.addTimeSeries(energyIncome,{strokeStyle:'#ddd01f',lineWidth:2});

	metalChart.addTimeSeries(metalUsage,{strokeStyle:'#848484',lineWidth:2,fillStyle:'rgba(105,105,105,0.75)'});
	metalChart.addTimeSeries(metalIncome,{strokeStyle:'#01b3f4',lineWidth:2});

	//energyChart.streamTo(document.getElementById("energySmoothieChart"),100);
	metalChart.streamTo(document.getElementById("metalSmoothieChart"),0);
    

    api.time.control();
});