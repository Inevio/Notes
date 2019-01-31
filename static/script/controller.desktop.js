var controller = (function (model, view) {
  class Controller {
    constructor (model, view) {
      this.dom = win

      this.model = model
      this.view = view
      this._bindEvents()
    }

    _bindEvents () {

		// Click events

		this.dom.on( 'click', '.note-entry', function () {
			console.log( 'Controller: ' + 'Has hecho click en note-entry, mando señal al modelo' )
        if( !$( this ).hasClass( 'selected' ) ){
          model.openNote( $( this ), $( this ).data( 'idNote' ) )
        }
      })

      this.dom.on( 'click', '.create-note', function () {
        console.log( 'Controller: ' + 'Has hecho click en create-note, mando señal al modelo' )
        model.createNote()
      })

      this.dom.on( 'keyup', '.ui-content-data textarea', function () {
        console.log( 'Controller: ' + 'Has pulsado una tecla en el textarea, mando señal al modelo' )
        model.saveNote( $( '.note-entry.selected' ), $( '.ui-content-data textarea' ).val() )
      })

      this.dom.on( 'contextmenu', '.note-entry', function () {

        var self = this
        var noteID = $(this).data( 'idNote' );
        var menu = api.menu();

        menu.addOption( 'Open note', function () {

          model.openNote( $( self ), noteID )

        })

        menu.addOption( 'Remove note', function () {

          model.removeNote( $( self ), noteID )

        }, 'warning')

        menu.render();

    	})

    }
  }

  return new Controller(model, view)
})(model, view)
