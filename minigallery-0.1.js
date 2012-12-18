// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'miniGallery',
      defaults = {
          width: 150,
          height: 150,
          offset: 3000,
          delay: 50,
          padding: 5,
          animateDurationIn: 200,
          animateDurationOut: 800,
          easeIn: 'easeInQuint',
          easeOut: 'easeInOutElastic',
          caret: '<b class="mini-gallery-caret" />'
      };

    // The actual plugin constructor
    function Plugin( element, options ) {
      this.element = element;

      // jQuery has an extend method which merges the contents of two or
      // more objects, storing the result in the first object. The first object
      // is generally empty as we don't want to alter the default options for
      // future instances of the plugin
      this.options = $.extend( {}, defaults, options );

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
    }

    Plugin.prototype = {

        init: function() {
          // Place initialization logic here
          // You already have access to the DOM element and
          // the options via the instance, e.g. this.element
          // and this.options
          // you can add more functions like the one below and
          // call them like so: this.yourOtherFunction(this.element, this.options).

          var el = $(this.element),
              options = this.options,
              self = this;

          // Hide followed uls
          el.find('ul:first-child').addClass('mini-gallery-active');
          el.find('ul:not(:first-child)').hide();

          el.find('ul').each(function (index) {
            var lis = $(this).find('li');

            // Apply width & padding, also make them stay at center
            $(this)
              .attr('id', 'handle' + index)
              .css({
                width: (lis.length * (options.width + options.padding * 2)) + 'px',
                margin: '0 auto',
                height: options.height + 'px',
                position: 'relative'
              })
              .data('order', index);

            lis.each(function (iindex) {
              $(this).css({
                listStyleType: 'none',
                position: 'absolute',
                top: '0',
                padding: '0 ' + options.padding + 'px'
              });

              if (index === 0) {
                $(this).css({
                  left: (iindex * (options.width + options.padding * 2)) + 'px'
                });
              }
              else {
                $(this).css({
                  left: options.offset + 'px'
                });
              }
            });
          });

          // Gallery wrapper
          el.find('> div:first-child')
            .css({
              height: options.height + 'px',
              overflow: 'hidden',
              position: 'relative'
            });

          // Auto-active first link
          var firstLink = el.find('> div a').eq(0);
          self.addCaret(firstLink, options.caret).addClass('active');

          // Handle click event
          el.find('> div a').click(function (e) {
            e.preventDefault();


            if (!$(this).hasClass('active')) {
              var clickedLink = $(this);

              // Active clicked link
              el.find('> div a').removeClass('active');
              clickedLink.addClass('active');

              $('b.mini-gallery-caret').fadeOut(function () {
                $(this).remove(); // Remove old caret

                self.addCaret(clickedLink, options.caret);
              });

              var clickedHandle = $('#' + clickedLink.attr('href'));

              var currentOrder = el.find('.mini-gallery-active').data('order');
              var clickedOrder = clickedHandle.data('order');
              var listOut = el.find('.mini-gallery-active li');
              var listIn = clickedHandle.find('li');

              if (currentOrder < clickedOrder) {
                var offsetSide = -1 * options.offset;
              }
              else {
                var offsetSide = options.offset;
              }

              // Animate out
              el.find('.mini-gallery-active').removeClass('mini-gallery-active');

              listOut.each(function (index) {
                var li = $(this);
                var delay = (currentOrder < clickedOrder) ? index * options.delay : (listOut.length - index) * options.delay;

                setTimeout(function () {
                  li.animate({
                    left: offsetSide + 'px'
                  }, options.animateDurationIn, options.easeIn);
                }, delay);
              });

              // Animate in
              setTimeout(function () {
                clickedHandle.addClass('mini-gallery-active');

                listOut.parent().hide();
                listIn.parent().show();

                listIn.each(function (index) {
                  var li = $(this);
                  var delay = (currentOrder < clickedOrder) ? index * options.delay : (listIn.length - index) * options.delay;

                  li.css({
                    left: offsetSide + 'px'
                  })

                  setTimeout(function () {
                    li.animate({
                      left: (index * (options.width + options.padding * 2)) + 'px'
                    }, options.animateDurationOut, options.easeOut);
                  }, delay);
                });
              }, options.animateDurationIn + options.delay * listOut.length);
            }
          });
        },

        addCaret: function (el, caret) {
          var newCaret = $(caret).hide();

          newCaret.css({
            left: ((el.width() / 2) - 10) + 'px' // Substract self width
          });
          el.prepend(newCaret);
          newCaret.fadeIn();

          return el;
        },

        yourOtherFunction: function(el, options) {
          // some logic
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
        }
      });
    };

})( jQuery, window, document );