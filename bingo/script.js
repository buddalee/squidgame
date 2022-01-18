/*
*
*	jQuery Slot Machine
*
*/
var height_slot_number = '100';

function randomIntFromInterval(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
}

var pastValues = []

function go(tens,units){
	// console.log('units: ', units)
	// console.log('tens: ', tens)
	const value = tens * 10 + units
	console.log('value: ', tens * 10 + units)

	if (pastValues.find(val => val === value) || value === 0 || value > 75) {
		go(randomIntFromInterval(0, 7), randomIntFromInterval(0, 9));
	} else {
		pastValues.push(value)
		addSlots($("#slots_units .number-wrapper"));
		addSlots($("#slots_units .number-wrapper"));
		moveSlots($("#slots_units .number-wrapper"),units);
		addSlots($("#slots_tens .number-wrapper"));
		addSlots($("#slots_tens .number-wrapper"));
		moveSlots($("#slots_tens .number-wrapper"),tens);
	}
}

$(document).ready(function(){
		addSlots($("#slots_units .number-wrapper"));
		addSlots($("#slots_tens .number-wrapper"));
    $('#arm').click(function(e) {
			var arm = $(this).addClass('clicked');
      delay = setTimeout(function() { arm.removeClass('clicked');}, 500);
      e.preventDefault();
      go(randomIntFromInterval(0, 7), randomIntFromInterval(0, 9));
			const pastValuesString = pastValues.map(val => `<span class='value'>${val}</span><span>、</span>`).join('')
			setTimeout(() => {
				document.getElementById('slot-past-value').innerHTML = `<div>${pastValuesString}</div>`
			}, 5000)
	  });
});


function addSlots(jqo, max = 10){
	for(var i = 0; i < max; i++){
		jqo.append("<div class='slot'>"+ i +"</div>");
	}
}

function moveSlots(jqo,num){
	var time	= 6500;
	var number	= num;
	time		+= Math.round(Math.random()*1000);
	jqo.stop(true,true);

	var num_slot    = Math.round((jqo.find('.slot').length)/20);
	var margin_top  = ((num_slot -1) * (height_slot_number * 10)) + (num * height_slot_number);
	jqo.animate(
		{"margin-top":"-"+ margin_top +"px"},
		{'duration' : time, 'easing' : "easeOutElastic"}
	);
}