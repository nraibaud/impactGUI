/**
* @author: Simon Ernst
* @github: https://github.com/netmute/impact-ajax
* */
ig.module(
  'plugins.gui.ajax'
)
.requires(
  'impact.impact'
)
.defines(function() {
  ig.Ajax = ig.Class.extend({

    get: function( url, callback ) {
      this.send( url, callback, 'GET' );
    },

    getJSON: function( url, callback ) {
      this.get(url, function(response) {
        callback( JSON.parse(response) );
      });
    },

    get_sync: function( url ) {
      xhr = new XMLHttpRequest();
      xhr.open( 'GET', url, false );
      xhr.send( null );
      return xhr.responseText;
    },

    getJSON_sync: function( url ) {
      return JSON.parse( this.get_sync(url) );
    },

    post: function( url, params, callback ) {
      this.send( url, callback, 'POST', this.serialize(params) );
    },

    send: function( url, callback, method, params ) {
      xhr = new XMLHttpRequest();
      xhr.open( method, url, true );
      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
          callback( xhr.responseText );
        }
      };
      if( method == 'POST' ) {
        xhr.setRequestHeader( 'Content-type','application/x-www-form-urlencoded' );
      }
      xhr.send( params );
    },

    serialize: function(object) {
      var params = "";
      for (var key in object) {
        if (params != "") {
          params += "&";
        }
        params += key + "=" + object[key];
      }
      return params;
    }

  });
});
