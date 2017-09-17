module.exports = function(RED) {
	"use strict";
	var http = require( 'http' );

	function wordpressDataSet( config ) {
		RED.nodes.createNode( this, config );
		var node = this;
		node.config = config;

		this.on( 'input', function( msg ) {
			msg.payload = '';

			msg.requestUrl = config.siteurl + '/wp-json/nrwp/v1/set/' + config.key + '/' + config.val;

			http.get( msg.requestUrl, function( response ) {
				response.on( 'data', function( d ) {
					msg.payload += d;
				} );

				response.on( 'end', function() {
					msg.payload = JSON.parse( msg.payload );
					
					if ( msg.payload.status ) {
						msg.payload = msg.payload.data;
						node.send( msg );
					}
				} );
			} );
		} );
	};

	RED.nodes.registerType( 'wordpress-data-set', wordpressDataSet );
}
