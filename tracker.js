(function( $ ) {
	$.fn.stopScroll = function( options ) {
		options = $.extend({
			delay: 250,
			callback: function() {}
		}, options);
		
		return this.each(function() {
			var $element = $( this ),
				element = this;
			$element.scroll(function() {
				clearTimeout( $.data( element, "scrollCheck" ) );
				$.data( element, "scrollCheck", setTimeout(function() {
					options.callback();
				}, options.delay ) );
			});
		});
	};
	
	$.fn.sendEvent = function(options){
		var options = options || {};
		options.category = options.category || 'element';
		options.action = options.action || 'click';
		options.value = options.value || 1;
		options.label = options.label || 'none';
		options.use = options.use || false;
		options.use_sel = options.use_sel || false;
		return this.each(function(){
			$(this).click(function(e){
				e.preventDefault();
				if(options.use !== false){
					if(options.use_sel!==false){
						console.log('set label using '+options.use+' element '+options.use_sel);
						options.label = $(''+options.use_sel).attr(options.use);
					}
					else{
						options.label = $(this).attr(options.use);
					}
				}
				console.log(options);
				ga('send', 'event', options.category, options.action, options.label, options.value);
			})
		});
	};
})( jQuery );

var Track = {
	//traks scroll stops on items (items are id's)
	beenSeen : function(items, options){
		options = options || {};
		options.category = options.category || 'element';
		options.action = options.action || 'seen';
		options.value = options.value || 1;
		var current = $(window).scrollTop();
		var sel = {id:null, area:0};
		var screen = $(window).height();
			
		$.each(items, function(index, element){
			var otop = $('#'+element).offset().top;
			var oheight = $('#'+element).height();
			var owidth = $('#'+element).width();
			var area = 0;
			if(otop<current & otop+oheight>current){
				area = owidth*(oheight-(current-otop));
			}
			else if(otop>current & otop-screen<current){
				area = owidth*((current+screen)-otop);
			}
			if(area>0){
				if(sel.id==null){
					sel.id = element;
					sel.area = area;
				}
				else{
					if(sel.area<area){
						sel.id = element;
						sel.area = area;
					}
				}
			}
		});
		if(sel.id!=0){
			options.label = options.label || sel.id;
			console.log('element '+sel.id+' with area '+sel.area+' is being seen at '+current);
			ga('send', 'event', options.category, options.action, options.label, options.value);
		}
	},
		
	idClickEvent : function(items, options){
		options = options || {};
		options.category = options.category || 'element';
		options.action = options.action || 'click';
		options.value = options.value || 1;
		$.each(items, function(index, element){
			$('#'+element).click(function(e){
				//e.preventDefault();
				label = label || element;
				console.log('clic a '+element);
				ga('send', 'event', options.category, options.action, options.label, options.value);
			})
		})
	},
			
	idWithLinkEvent : function(items, options){
		options = options || {};
		options.category = options.category || 'element';
		options.action = options.action || 'click';
		options.value = options.value || 1;
		$.each(items, function(index, element){
			$('#'+element+' a').click(function(){
				label = label || element;
				console.log('clic a link de '+element);
				ga('send', 'event', options.category, options.action, options.label, options.value);
			})
		})
	},
			
	idWithLinkByUrlEvent : function(items, options){
		options = options || {};
		options.category = options.category || 'element';
		options.action = options.action || 'click';
		options.value = options.value || 1;
		$.each(items, function(index, element){
			$('#'+element+' a').click(function(e){
				//e.preventDefault();
				var url = $(this).attr('href').replace(/\//g, "_");
				options.label = options.label || element+'_'+url;
				console.log('clic a link de '+element+' valor: '+element+'_'+url);
				ga('send', 'event', options.category, options.action, options.label, options.value);
			})
		})
	},
		
	idLinkEvent : function(items, options){
		options = options || {};
		options.category = options.category || 'element';
		options.action = options.action || 'click';
		options.value = options.value || 1;
		$.each(items, function(index, element){
			$('a#'+element).click(function(e){
				//e.preventDefault();
				console.log('clic a link '+element);
				ga('send', 'event', options.category, options.action, options.label, options.value);
			})
		})
	},
		
	controlScrollStop : function(items, options){
		options = options || {};
		$( window ).stopScroll({
			delay : 5000,
			callback : function(){
				Track.beenSeen(items, options);
			}
		});
	}
};