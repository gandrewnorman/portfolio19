/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 * ======================================================================== */
( function( $ ) {

    var main = {
        common: {
            init: function() {
                // Run everywhere.

                /* Modernizer for WebP images in CSS backgrounds ******************************************************************************/
                Modernizr.on( 'webp', function( result ) {
                    if ( result ) {
                        // supported browsers
                        $( '.logo' ).toggleClass( 'webp' );
                    } else {
                        // not-supported browsers
                        $( '.logo' ).toggleClass( 'no-webp' );
                    }
                } );

                /* Showing Menu  ******************************************************************************/
                $( '.menu, .overlay' ).click( function() {
                    $( '.menu' ).toggleClass( 'clicked' );
                    $( '#nav' ).toggleClass( 'show' );
                } );

                /* HIDE HEADER ON SCROLL DOWN  ******************************************************************************/
                var didScroll;
                var lastScrollTop = 0;
                var delta = 5;
                var navbarHeight = $( 'a.logo' ).outerHeight();

                $( window ).scroll( function( event ) {
                    didScroll = true;
                } );

                setInterval( function() {
                    if ( didScroll ) {
                        hasScrolled();
                        didScroll = false;
                    }
                }, 250 );

                function hasScrolled() {
                    var st = $( this ).scrollTop();

                    // Make sure they scroll more than delta
                    if ( Math.abs( lastScrollTop - st ) <= delta )
                        return;
                    // If they scrolled down and are past the navbar, add class .nav-up.
                    // This is necessary so you never see what is "behind" the navbar.
                    if ( st > lastScrollTop && st > navbarHeight ) {
                        // Scroll Down
                        $( 'a.logo' ).removeClass( 'nav-down' ).addClass( 'nav-up' );
                        console.log( 'nav up' );
                    } else {
                        // Scroll Up
                        if ( st + $( window ).height() < $( document ).height() ) {
                            $( 'a.logo' ).removeClass( 'nav-up' ).addClass( 'nav-down' );
                            // $( '.menu-helper' ).addClass( 'hidden' );
                            console.log( 'nav down' );
                        }
                    }

                    lastScrollTop = st;
                }

                /* MAGNIFIC POPUP CODE *****************************************************************/
                $( '.portfolio-box' ).magnificPopup( {
                    type: 'iframe',
                    iframe: {
                        patterns: {
                            youtube: {
                                index: 'youtube.com/',
                                id: function( url ) {
                                    var m = url.match( /[\\?\\&]v=([^\\?\\&]+)/ );
                                    if ( !m || !m[ 1 ] ) return null;
                                    return m[ 1 ];
                                },
                                src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0'
                            }
                        }
                    }
                } );

                $( '.portfolio-image-box' ).magnificPopup( {
                    type: 'image',
                    gallery: {
                        enabled: true
                    }
                } );

                console.log( 'common fired' );
            },
            finalize: function() {

                console.log( 'loaded last fired' );
            }
        },
        home: {
            init: function() {
                // Run on page with body class `home`.
                /*CANVAS RAINBOX CODE **********************************************************
                 *******************************************************************************************/
                var canvas = document.getElementById( 'rainbox' );
                var ctx = canvas.getContext( '2d' );
                //making the canvas full screen
                rainbox.height = window.innerHeight;
                rainbox.width = window.innerWidth;
                //creating string for drops
                var emojidrops = "🎬 🎥 🎵 💧 ⚡ 🌴";
                //converting the string into an array of single characters
                emojidrops = emojidrops.split( " " );
                var font_size = 16;
                var columns = rainbox.width / font_size; //number of columns for the rain
                //an array of drops - one per column
                var drops = [];
                //x below is the x coordinate
                //1 = y co-ordinate of the drop(same for every drop initially)
                for ( var x = 0; x < columns; x++ )
                    drops[ x ] = 1;
                //drawing the characters
                function draw() {
                    //translucent BG to show trail
                    ctx.fillStyle = "rgba(17, 17, 17, 0.25)";
                    ctx.fillRect( 0, 0, rainbox.width, rainbox.height );
                    ctx.fillStyle = "#ede9e3"; //@ivory text
                    ctx.font = font_size + "px brandon-grotesque";
                    //looping over drops
                    for ( var i = 0; i < drops.length; i++ ) {
                        //a random emojidrops character to print
                        var text = emojidrops[ Math.floor( Math.random() * emojidrops.length ) ];
                        //x = i*font_size, y = value of drops[i]*font_size
                        ctx.fillText( text, i * font_size, drops[ i ] * font_size );
                        //sending the drop back to the top randomly after it has crossed the screen
                        //adding a randomness to the reset to make the drops scattered on the Y axis
                        if ( drops[ i ] * font_size > rainbox.height && Math.random() > 0.989 )
                            drops[ i ] = 0;
                        //incrementing Y coordinate
                        drops[ i ]++;
                    }
                }
                setInterval( draw, 66 );

                console.log( 'home body fired' );
            }
        },
        tcs: {
            init: function() {
                // Run on page with body class `tcs`

                console.log( 'tcs fired' );
            }
        },
        bs: {
            init: function() {
                // Run on page with body class `bs`.

                console.log( 'bs body fired' );
            }
        },
        hq: {
            init: function() {
                // Run on page with body class `hq`.

                console.log( 'hq body fired' );
            }
        },
        br4ss: {
            init: function() {
                // Run on page with body class `br4ss`.

                console.log( 'br4ss body fired' );
            }
        },
    };

    var util = {
        fire: function( func, funcname, args ) {
            var namespace = main;
            funcname = ( funcname === undefined ) ? 'init' : funcname;
            if ( func !== '' && namespace[ func ] && typeof namespace[ func ][ funcname ] === 'function' ) {
                namespace[ func ][ funcname ]( args );
            }

        },

        loadEvents: function() {

            util.fire( 'common' );

            $.each( document.body.className.replace( /-/g, '_' ).split( /\s+/ ), function( i, classnm ) {
                util.fire( classnm );
            } );

            util.fire( 'common', 'finalize' );
        }
    };

    $( document ).ready( util.loadEvents );

} )( jQuery );