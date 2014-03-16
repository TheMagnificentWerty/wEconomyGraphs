(function () {
    //Timing
    var time;
    var oldDateTimeSeconds;
    var trySyncInterval;

    function startAndSyncCounterAt(seconds) {
        var firstTimeSync = false;
        var dateTime = new Date();
        oldDateTimeSeconds = Math.round((dateTime.getTime()-seconds*1000)/1000)*1000;

        clearInterval(trySyncInterval);
        trySyncInterval = setInterval(function() {
                var dateTime = new Date();
                var dateTimeSeconds = dateTime.getTime();
                if(firstTimeSync == false) {
                    var decimals = dateTimeSeconds - Math.floor(dateTimeSeconds/1000)*1000;
                    oldDateTimeSeconds = oldDateTimeSeconds;
                    firstTimeSync = true;
                }
                

                time = dateTimeSeconds - oldDateTimeSeconds;
            
            },10
        );
    }

    //In-game time sync
    setInterval(function(){
            console.log(model.currentTimeInSeconds());
                startAndSyncCounterAt(model.currentTimeInSeconds());
            },1000);

    startAndSyncCounterAt(model.currentTimeInSeconds());


    //UI
    createFloatingFrame('energySmoothie', "auto", "auto", {'rememberPosition': false,'offset':'topCenter','left':337});
    var energyCanvas = "<canvas id='energySmoothieChart' class='smoothieChart'> </canvas>";
	$("#energySmoothie_content").append(energyCanvas);
    var stopButton = "<input id='stopButton' type='button' value='stop'/>";
    $("#energySmoothie_content").append(energyCanvas);
    $("#energySmoothie_content").append(stopButton);
    $("#stopButton").click(function(){stopGraphs();});
    var startButton = "<input id='startButton' type='button' value='stop'/>";
    $("#energySmoothie_content").append(startButton);
    $("#startButton").click(function(){startGraphs();});
    $("#energySmoothie_content").addClass("smoothieFrameContent");
    $("#energySmoothie").addClass("smoothieFrame");
    $("#energySmoothieChart").resizable({
        grid: 20,
        maxHeight: 150,
        maxWidth: 800,
        minHeight: 30,
        minWidth: 80
    });



    createFloatingFrame('metalSmoothie', "auto", "auto", {'rememberPosition': false,'offset':'topCenter','left':-610});
    var metalCanvas = "<canvas id='metalSmoothieChart' class='smoothieChart'> </canvas>";
    $("#metalSmoothie_content").append(metalCanvas);
    $("#metalSmoothie_content").addClass("smoothieFrameContent");
    $("#metalSmoothie").addClass("smoothieFrame");
    $("#metalSmoothieChart").resizable({
        grid: 20,
        maxHeight: 150,
        maxWidth: 800,
        minHeight: 30,
        minWidth: 80
    });

    var oldHandlerArmy = handlers.army;

    // Functions for retrieving the Metal and Energy wasted values
    function getMetalWasteRate() {
        if(model.maxMetal() <= model.currentMetal()) {
            return model.metalGain() - model.metalLoss();
        }
        else {
            return 0;
        }
    }

    function getEnergyWasteRate() {
        if(model.maxEnergy() <= model.currentEnergy()) {
            return model.energyGain() - model.energyLoss();
        }
        else {
            return 0;
        }
    }
    

    //Add to model
    model.energyGain = ko.observable(1.0);
    model.energyLoss = ko.observable(1.0);
    model.metalGain = ko.observable(1.0);
    model.metalLoss = ko.observable(1.0);

     //Add to handler
    handlers.army = function (payload) {
        //model.currentEnergy(payload.energy.current);
       // model.maxEnergy(payload.energy.storage);
        model.energyGain(payload.energy.production);
        model.energyLoss(payload.energy.demand);


       // model.currentMetal(payload.energy.current);
       // model.maxMetal(payload.energy.storage);
        model.metalGain(payload.metal.production);
        model.metalLoss(payload.metal.demand);

        if (oldHandlerArmy) {
            oldHandlerArmy(payload);
        }
    }

    

    //Range calculation function for SmoothieChart
    function rangeFunction(range) {
	  var min = 0;
	  var max = range.max;
      var max = Math.round(max);

	  return {min: min, max: max};
	}

    //Time and timing logic.
    SmoothieChart.timeFormatter = function(date) {
        var secondsFromEpochInChart = date.getTime();
        var nowDate = new Date();
        var secondsFromEpochNow = nowDate.getTime();
        var differenceFromGameStart = secondsFromEpochNow-secondsFromEpochInChart;
        
        var secondsFromGameStart = time;
        
        var chartTime = secondsFromGameStart - differenceFromGameStart;
        var chartTimeSeconds = chartTime / 1000;
        var roundedChartTime = Math.round(chartTimeSeconds/5)*5;
       
        var splitBythirty = roundedChartTime/30;
        var splitBythirtyrounded = Math.round(roundedChartTime/30);

        if(splitBythirty != splitBythirtyrounded) {
           return "";
        }
        else if(roundedChartTime<0) {
            return "";
        }
        else {
            var seconds = roundedChartTime % 60;
            var minutes = Math.floor((roundedChartTime % (60*60)) / 60);
            var hours = Math.floor(roundedChartTime / (60 * 60));
            function pad2(number) { return (number < 10 ? '0' : '') + number }


            var timeString = pad2(seconds);
            if(minutes >0 && hours >0) {
                timeString = pad2(minutes)+":".concat(timeString);
            }
            else {
                timeString = minutes+":".concat(timeString);
            }

            if(hours > 0) {
                timeString = hours+":".concat(timeString);
            }

            return timeString + " ";
       }
        
    };
    
    //Initiate SmoothieCharts
    var energyChart = new SmoothieChart({millisPerPixel:350, 
                                        interpolation: "step",
                                        timestampFormatter:SmoothieChart.timeFormatter,
    									grid:{millisPerLine:5000, 
    										  fillStyle:'rgba(0,0,0,0.50)',
                                              borderVisible:false,
    										  strokeStyle:'rgba(80,80,80,0.40)',
                                              strokeStyleWhenTimeLabeled:"rgba(120,120,120,0.80)",
    										  interpolation:'step',
    										  verticalSections:5,
    										  sharpLines:true},
    									labels:{disabled:false,
                                                fontFamily:'Sansation Bold',
                                                fillStyle:'rgba(180,180,180,0.80)',
                                                axisLabelsFillStyle:'rgba(150,150,150,1)',
                                                precision:0,
                                                fontSize:10,
                                                axisLabelsFontSize:12, },
    									yRangeFunction:rangeFunction});
	
	var metalChart = new SmoothieChart({millisPerPixel:350,
                                        interpolation: "step",
                                        timestampFormatter:SmoothieChart.timeFormatter,
    									grid:{millisPerLine:5000, 
                                                borderVisible:false,
    										  fillStyle:'rgba(0,0,0,0.50)',
    										  strokeStyle:'rgba(80,80,80,0.40)',
                                              strokeStyleWhenTimeLabeled:"rgba(120,120,120,0.80)",
    										  interpolation:'step',
    										  verticalSections:5,
    										  sharpLines:true},
    									labels:{fontFamily:'Sansation Bold',
                                                precision:0,
                                                fillStyle:'rgba(180,180,180,0.8)',
                                                axisLabelsFillStyle:'rgba(150,150,150,1)',
                                                fontSize:10,
                                                axisLabelsFontSize:12,},
    									yRangeFunction:rangeFunction});

    //Initiate TimeSeries
	var energyUsage = new TimeSeries();
	var energyIncome = new TimeSeries();
    var energyWastage = new TimeSeries();

	var metalUsage = new TimeSeries();
	var metalIncome = new TimeSeries();
    var metalWastage = new TimeSeries();

	setInterval(function() {
		energyIncome.append(new Date().getTime(), model.energyGain());
		metalIncome.append(new Date().getTime(), model.metalGain());
        energyWastage.append(new Date().getTime(), getEnergyWasteRate());
        metalWastage.append(new Date().getTime(), getMetalWasteRate());
        energyUsage.append(new Date().getTime(), model.energyLoss());
        metalUsage.append(new Date().getTime(), model.metalLoss());
	},1000);

    //Add TimeSeries to SmoothieChart objects
    
    energyChart.addTimeSeries(energyUsage,{strokeStyle:'rgba(100,100,100,0.8)',lineWidth:2,fillStyle:'rgba(105,105,105,0.50)'});
    //energyChart.addTimeSeries(energyWastage,{strokeStyle:'rgba(255,101,0,1)',lineWidth:2});
	energyChart.addTimeSeries(energyIncome,{strokeStyle:'rgba(200,200,62,0.8)',lineWidth:2});

    
    metalChart.addTimeSeries(metalUsage,{strokeStyle:'rgba(100,100,100,0.8)',lineWidth:2,fillStyle:'rgba(105,105,105,0.50)'});
    //metalChart.addTimeSeries(metalWastage,{strokeStyle:'rgba(255,0,0,1)',lineWidth:2});
	metalChart.addTimeSeries(metalIncome,{strokeStyle:'rgba(0,119,193,0.9)',lineWidth:2});
    

    //Indicate canvas to stream to
	energyChart.streamTo(document.getElementById("energySmoothieChart"),1000);
	metalChart.streamTo(document.getElementById("metalSmoothieChart"),1000);
    

    function stopGraphs() {
        energyChart.stop();
        metalChart.stop();
    }

    function startGraphs() {
        energyChart.start();
        metalChart.start();
    }
    //Tell the game to track the time
    api.time.control();
})();