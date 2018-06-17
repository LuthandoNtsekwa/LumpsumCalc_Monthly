
var div_Width;

var clickflag = 1;
$(document).ready(function () {
	/**custom slider code**/
	var slider = document.getElementById("yearsRange");
	var output = document.getElementById("yearsVal");
	output.innerHTML = slider.value;

	slider.oninput = function() {
	  output.innerHTML = this.value;
	}
	
	
	/** calculate button click  **/
	$('#btnInvestmentResult').on('click', function(){
		var txtLoanAmt = $('#txtInvestmentAmount').val();
		var txtTerm = $('#yearsRange').val();
		var txtInterestRate = $('#txtAnnualRate').val();
		
		calculate_return(txtLoanAmt, txtTerm,txtInterestRate);
		$('.result-container').show();
		$('table.highchart').highchartTable();
	});
	
	/** reset button click**/
	$('#btnReset').on('click', function(){
		reset_everything();
	});
	 
});
	


    /* Number validation 
    $('#ROI, #PPAI').keydown(function (e) {
        var key = e.charCode || e.keyCode || 0;
        //alert(key);
        if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key == 8 || key == 46 || key == 9)
            return true;
        else
            return false;
    });*/

    



function numbers(value) {

    var numberRs = new Array();
    numberRs = value;
    numberRs = numberRs.toString();

    var x = numberRs.split('.');
    var x1 = x.length > 1 ? '.' + x[1] : '';

    numberRs = numberRs.replace(x1, '');
    var len = numberRs.length;
    var val = '';

    switch (len) {
        case 4: val = numberRs.substr(0, 1) + "," + numberRs.substr(1, 1) + numberRs.substr(2, 1) + numberRs.substr(3, 1); break;
        case 5: val = numberRs.substr(0, 1) + numberRs.substr(1, 1) + "," + numberRs.substr(2, 1) + numberRs.substr(3, 1) + numberRs.substr(4, 1); break;
        case 6: val = numberRs.substr(0, 1) + "," + numberRs.substr(1, 1) + numberRs.substr(2, 1) + "," + numberRs.substr(3, 1) + numberRs.substr(4, 1) + numberRs.substr(5, 1); break;
        case 7: val = numberRs.substr(0, 1) + numberRs.substr(1, 1) + "," + numberRs.substr(2, 1) + numberRs.substr(3, 1) + "," + numberRs.substr(4, 1) + numberRs.substr(5, 1) + numberRs.substr(6, 1); break;
        case 8: val = numberRs.substr(0, 1) + "," + numberRs.substr(1, 1) + numberRs.substr(2, 1) + "," + numberRs.substr(3, 1) + numberRs.substr(4, 1) + "," + numberRs.substr(5, 1) + numberRs.substr(6, 1) + numberRs.substr(7, 1); break;
        case 9: val = numberRs.substr(0, 1) + numberRs.substr(1, 1) + "," + numberRs.substr(2, 1) + numberRs.substr(3, 1) + "," + numberRs.substr(4, 1) + numberRs.substr(5, 1) + "," + numberRs.substr(6, 1) + numberRs.substr(7, 1) + numberRs.substr(8, 1); break;
        case 10: val = numberRs.substr(0, 1) + "," + numberRs.substr(1, 1) + numberRs.substr(2, 1) + "," + numberRs.substr(3, 1) + numberRs.substr(4, 1) + "," + numberRs.substr(5, 1) + numberRs.substr(6, 1) + numberRs.substr(7, 1) + numberRs.substr(8, 1) + numberRs.substr(9, 1); break;
        case 11: val = numberRs.substr(0, 1) + numberRs.substr(1, 1) + "," + numberRs.substr(2, 1) + numberRs.substr(3, 1) + "," + numberRs.substr(4, 1) + numberRs.substr(5, 1) + "," + numberRs.substr(6, 1) + numberRs.substr(7, 1) + "," + numberRs.substr(8, 1) + numberRs.substr(9, 1) + numberRs.substr(10, 1); break;
        case 12: val = numberRs.substr(0, 1) + "," + numberRs.substr(1, 1) + numberRs.substr(2, 1) + "," + numberRs.substr(3, 1) + numberRs.substr(4, 1) + "," + numberRs.substr(5, 1) + numberRs.substr(6, 1) + "," + numberRs.substr(7, 1) + numberRs.substr(8, 1) + "," + numberRs.substr(9, 1) + numberRs.substr(10, 1) + numberRs.substr(11, 1); break;
        default: val = numberRs; break;
    }

    val = val + x1;
    return val;
}

function custom_convert_to_money(numbers){
	return parseFloat(numbers).toFixed(2).replace(/./g, function(c, i, a) {
		return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
	});
}

/* SIP calculation */

function calculate_return(aValue,term,iRate) {
	
	//clean the exisiting rows fo regeneration purpose
	document.getElementById("highchart_table").getElementsByTagName('tbody')[0].innerHTML = '';
	
	var rate = parseFloat(iRate/12/100);
	var period = parseInt(term);
	var value = parseFloat(aValue);
	var months = period * 12;
    var futureValue = value;
	
	var obj = {Year:1977, Amount:value,Earn:0, YearlyInterest:0};
	for(var i = 1; i <= months; i++){
		obj.Amount = obj.Amount * ( 1 + rate);
		//obj.YearlyInterest = obj.Amount - value;
		//console.log((Math.pow(1 + rate, months) - 1) / rate);
		//console.log(obj.YearlyInterest);
		//obj.Amount += obj.YearlyInterest;
		obj.Earn =  obj.Amount - value;
		
		//calculate year
		today = new Date();
		today.setMonth(new Date().getMonth() + i);
		obj.Year = today.toISOString();
		
	
		build_chart_table(obj);
	}
	
	
	
	$('.yourInvestAmt').html(custom_convert_to_money(aValue));
	$('.maturityValAmt').html(custom_convert_to_money(obj.Amount));
	$('.intersEarnAmt').html(custom_convert_to_money(obj.Amount- aValue ));

	//return -result;
}

//here we are building the highchart
function build_chart_table(obj){
	// Find a <tbody> element of the table with with id="highchart_table":
	var table = document.getElementById("highchart_table").getElementsByTagName('tbody')[0];
	
	// Create an empty <tr> element and add it to the last position of the table:
	var row = table.insertRow(-1);

	// Insert new cells (<td> elements):
	var yearCell = row.insertCell(0);
	var maturityAmtCell = row.insertCell(1);
	var earningsCell = row.insertCell(2);

	// Add some text to the new cells:
	yearCell.innerHTML = obj.Year;
	maturityAmtCell.innerHTML = parseFloat(obj.Amount).toFixed(2);
	earningsCell.innerHTML = parseFloat(obj.Earn).toFixed(2);
}

//here we are reseting all fields and we hide the result div
function reset_everything(){
	$('.result-container').hide();
	$('#txtInvestmentAmount').val('');
	$('#txtInvestTermYear').val('');
	$('#txtAnnualRate').val('');
	//remove the exisiting rows fo regeneration purpose
	document.getElementById("highchart_table").getElementsByTagName('tbody')[0].innerHTML = '';
}