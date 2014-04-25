
	$(document).ready(function() {
			
		/* Onclick of buttons with class '.data-points' and convert that file to a MongooseJS document */	
		$('.convert').click(function(){
			
			$.get('/convert/' + this.name, function(data) {
				console.log(data);
				files = ['test.txt', 'test2.txt'];
				$.get('/files', function(data) {
					$('#siteMenu').html(data);
				});
			});				
		});
		
		$('.chart').click(function(){
		
			$.get('/chart/' + this.name, function(pkg) {
			
				var title = JSON.stringify(pkg.head);			// To display reading data at top of graph, time, g's, freq
				$('#container').highcharts({
					chart: {
						renderTo: 'container',
						zoomType: 'x'
					},
					title: {
						text: title
					},
					xAxis: {
						type: 'linear',
						title: {
							text: 'Time'
						}
					},
					yAxis: {
						title: {
							text: 'G Force'
						}
					},
					series: [{
						name: 'x',
						data: pkg.x,
						visible: true
					}, {
						name: 'y',
						data: pkg.y
					}, {
						name: 'z',
						data: pkg.z
					}]
				});
					
				
				
				var chart = $('#container').highcharts();				// Create graph
				
				
				/* Chart manip */
				$('button.x').click(function(e) {
					var series = chart.series[0];
					if (series.visible) {
						series.hide();
						$('button.x').html('Show - X');
					} else {
						series.show();
						$('button.x').html('Hide - X');
					}
				});
				
			    $('button.y').click(function() {
			        var series = chart.series[1];
			        if (series.visible) {
			            series.hide();
			            $('button.y').html('Show - Y');
			        } else {
			            series.show();
			            $('button.y').html('Hide - Y');
			        }
			    });
				
				$('button.z').click(function(e) {
					var series = options.series[2];
					if (series.visible) {
						series.hide();
						$('button.z').html('Show - Z');
					} else {
						series.show();
						$('button.z').html('Hide - Z');
					}
				});
				/* end chart */
				
			});
		});
		
		
		
		

	});