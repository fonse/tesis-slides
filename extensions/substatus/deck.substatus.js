/*!
Deck JS - deck.status
Copyright (c) 2011 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt
https://github.com/imakewebthings/deck.js/blob/master/GPL-license.txt
*/

/*
This module adds a (current)/(total) style status indicator to the deck.
*/
(function($, deck, undefined) {
	var $d = $(document),
	
	updateCurrent = function(e, from, to) {
		var opts = $[deck]('getOptions');
		var slide = $[deck]('getSlide', to);
		$(opts.selectors.statusCurrent).text(slide.data('rootSlide'));
		
		var substatus = $(opts.selectors.substatus).html('');
		if (slide.parents('.slide').size() || slide.find('.pseudo-slide').size()){
			var parent = slide.find('.pseudo-slide').size() ? slide : slide.parents('.slide');
			
			if(parent.find('.pseudo-slide')){
				substatus.append(parent.attr('id') == slide.attr('id') ? '<b class="current">' : '<b>');
			}
			
			parent.find('.slide').each(function(i, child){
				substatus.append(child.id == slide.attr('id') ? '<b class="current">' : '<b>');
			});
		}
	};
	
	/*
	Extends defaults/options.
	
	options.selectors.statusCurrent
		The element matching this selector displays the current slide number.
		
	options.selectors.statusTotal
		The element matching this selector displays the total number of slides.
	*/
	$.extend(true, $[deck].defaults, {
		selectors: {
			statusCurrent: '.deck-status-current',
			statusTotal: '.deck-status-total',
			substatus: '.deck-substatus'
		}
	});
	
	$d.bind('deck.init', function() {
		var opts = $[deck]('getOptions'),
		slides = $[deck]('getSlides'),
		$current = $[deck]('getSlide'),
		ndx;
		
		// Set total slides once
		/* Determine root slides by checking each slide's ancestor tree for
		any of the slide classes. */
		var rootIndex = 1,
		slideTest = $.map([
			opts.classes.before,
			opts.classes.previous,
			opts.classes.current,
			opts.classes.next,
			opts.classes.after
		], function(el, i) {
			return '.' + el;
		}).join(', ');
		
		/* Store the 'real' root slide number for use during slide changes. */
		$.each(slides, function(i, $el) {
			var $parentSlides = $el.parentsUntil(opts.selectors.container, slideTest);

			$el.data('rootSlide', $parentSlides.length ?
				$parentSlides.last().data('rootSlide') :
				rootIndex++
			);
		});
		
		$(opts.selectors.statusTotal).text(rootIndex - 1);
		
		// Find where we started in the deck and set initial state
		$.each(slides, function(i, $el) {
			if ($el === $current) {
				ndx = i;
				return false;
			}
		});
		updateCurrent(null, ndx, ndx);
	})
	/* Update current slide number with each change event */
	.bind('deck.change', updateCurrent);
})(jQuery, 'deck');

