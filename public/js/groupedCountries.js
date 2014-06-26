$(function(){

	$.each(dane.jezyki, function(i, jezyk){
		$('tbody').append('<tr><td>'+jezyk.langRef.language+'</td><td>'+jezyk.count+'</td><td>'+((jezyk.count/dane.ludnoscSwiata)*100).toFixed(2)+'</td></tr>');
	});
});