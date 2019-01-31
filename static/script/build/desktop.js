var win = $(this)

const async = {

  each: function (list, step, callback) {
    var position = 0
    var closed = false
    var checkEnd = function (error) {
      if (closed) {
        return
      }

      position++

      if (position === list.length || error) {
        closed = true

        callback(error)

        // Nullify
        list = step = callback = position = checkEnd = null
      }
    }

    if (!list.length) {
      return callback()
    }

    list.forEach(function (item) {
      step(item, checkEnd)
    })
  },

  map: function (list, step, callback) {
    var position = 0
    var closed = false
    var result = []
    var checkEnd = function (index, error, data) {
      if (closed) {
        return
      }

      position++

      result[ index ] = data

      if (position === list.length || error) {
        closed = true

        callback(error, result)

        // Nullify
        result = list = step = callback = position = checkEnd = null
      }
    }

    if (!list.length) {
      return callback()
    }

    list.forEach(function (item, index) {
      step(item, checkEnd.bind(null, index))
    })
  },

  parallel: function (fns, callback) {
    var list = Object.keys(fns)
    var position = 0
    var closed = false
    var res = {}
    var checkEnd = function (i, error, value) {
      if (closed) {
        return
      }

      res[ i ] = value
      position++

      if (position === list.length || error) {
        closed = true

        callback(error, res)

        // Nullify
        list = callback = position = checkEnd = null
      }
    }

    if (!list.length) {
      return callback()
    }

    list.forEach(function (fn) {
      fns[ fn ](checkEnd.bind(null, fn))
    })
  }

}

var view = (function () {
  
  class View {
    constructor () {

      this.dom = win

      this.isMobile = this.dom.hasClass('wz-mobile-view')

      this.month = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

      this.myContactID = api.system.workspace().idWorkspace

      this._translateInterface()
    }

    _translateInterface () {

      /*
      // Start
      $('.no-worlds .title').text(lang.welcome)
      $('.no-worlds .subtitle').text(lang.intro)
      $('.no-worlds .subtitle2').text(lang.intro2)
      $('.no-worlds .chat-feature .description').html(lang.feature1)

      // Posts
      $('.new-post-button .my-avatar').css('background-image', 'url( ' + api.system.workspace().avatar.tiny + ' )')
      $('.new-post-button .something-to-say').text(lang.cardsList.somethingToSay)
      $('.no-posts .no-post-to-show').text(lang.cardsList.noPostToShow)
      $('.no-posts .left-side span').text(lang.noPosts)
      */

    }

    // Esta función coloca una nota arriba del todo de la lista
    moveNote ( noteEntry ){

      $( '.notes-container' ).prepend( noteEntry )

    }

    updateNoteInfo ( noteEntry, time, content ){

      noteEntry.children( '.note-entry-title' ).text( content.slice( 0, 30 ) )

      var noteDate = new Date( time )

      var hour = noteDate.getHours()
      if( hour < 10 ){ hour = '0' + hour }
      var min = noteDate.getMinutes()
      if( min < 10 ){ min = '0' + min }

      noteEntry.children( '.note-entry-update' ).text( hour + ':' + min )

      this.moveNote( noteEntry )

    }

    // Esta función abre una nota en pantalla
    openNote ( noteEntry, note ){

      $( '.note-entry.selected' ).removeClass( 'selected' )
      noteEntry.addClass( 'selected' )

      $( '.ui-content-data textarea' ).val( note.content )
      $( '.ui-content-data textarea' ).focus()

    }

    // Esta función añade una nueva nota al sidebar
    addNoteSidebar ( note, prepend ){

      var notePrototype = $( '.note-entry.wz-prototype' ).clone()

      notePrototype
      .removeClass( 'wz-prototype' )
      .data( 'idNote', note.id )

      if( note.content ){
        notePrototype.children( '.note-entry-title' ).text( note.content.slice( 0, 30 ) )
      }else{
        notePrototype.children( '.note-entry-title' ).text( 'New note' )
      }

      var noteDate = new Date( note.updated )
      var today = new Date()
      var yesterday = new Date()
      yesterday.setDate( today.getDate() - 1 )

      var hour = noteDate.getHours()
      if( hour < 10 ){ hour = '0' + hour }
      var min = noteDate.getMinutes()
      if( min < 10 ){ min = '0' + min }

      var longDate = ''

      if( ( noteDate.getDate() % 10 ) === 1 ){
        longDate =  noteDate.getDate() + 'st' + ' ' + this.month[ noteDate.getMonth() ] + ' ' + noteDate.getFullYear()
      }else if( ( noteDate.getDate() % 10 ) === 2 ){
        longDate =  noteDate.getDate() + 'nd' + ' ' + this.month[ noteDate.getMonth() ] + ' ' + noteDate.getFullYear()
      }else if( ( noteDate.getDate() % 10 ) === 3 ){
        longDate =  noteDate.getDate() + 'rd' + ' ' + this.month[ noteDate.getMonth() ] + ' ' + noteDate.getFullYear()
      }else{
        longDate =  noteDate.getDate() + 'th' + ' ' + this.month[ noteDate.getMonth() ] + ' ' + noteDate.getFullYear()
      }

      if( noteDate.getDate() === today.getDate() ){
        notePrototype.children( '.note-entry-update' ).text( hour + ':' + min )
      }else if( noteDate.getDate() === yesterday.getDate() ){
        notePrototype.children( '.note-entry-update' ).text( 'Yesterday' )
      }else{
        notePrototype.children( '.note-entry-update' ).text( longDate )
      }

        console.log( 'Voy a añadir esta nota' )
        console.log( notePrototype )

      if( prepend ){
        $( '.notes-container' ).prepend( notePrototype )
      }else{
        $( '.notes-container' ).append( notePrototype )
      }

    }

    // Esta función carga todas las notas en el sidebar
    listNotes ( notesList ){

      console.log( 'View: ' + 'Listando las notas en el sidebar' )
      console.log( notesList )

      var self = this
      notesList.forEach( function ( note ) {
        
        self.addNoteSidebar( note )

      })

      $( '.notes-container' ).append( $( '.note-entry' )[0] )
      $( '.note-entry' )[0].click()

    }

    newNote ( note ) {
      this.addNoteSidebar( note, true )
      $( '.note-entry' )[0].click()
    }

    removeNote ( note ){
      $( note ).remove()
    }

  }

  return new View()
})()

var model = (function (view) {
  class Model {

    // Creamos el constructor del modelo pasando como parámetro la vista
    constructor (view) {
      this.view = view
      
      this.openedNote

      this.myContactID = api.system.workspace().idWorkspace

      this.notes = []
      this.orderedNotes = []

      this.isMobile = this.view.dom.hasClass('wz-mobile-view')

      // this.changeMainAreaMode( MAINAREA_NULL )
      this.fullLoad()
    }

    // loadFullNotesList carga todas las notas del usuario y las almacena en el objeto notes
    _loadFullNotesList ( callback ) {
      callback = api.tool.secureCallback(callback)

      var self = this
      wql.retrieveNotes( function( error, notes ){

        if( error ){
          console.log( 'Ha habido un error cargando las notas' )
          console.log( error )
        }else{
          console.log( 'Este es el resultado de la llamada retrieveNotes' )
          console.log( notes )

          notes.forEach( function ( note ) {
            self.addNote( note )
          })

          if( notes.length ){

          	notes.forEach( function ( note ) {
            	self.addNote( note )
          	})

          	self.orderNotes()

          	self.view.listNotes( self.orderedNotes )
          	
          }else{
          	self.createNote()
          }

        }

      })

    }

    // Esta función simplemente añade una nota en el objeto notes
    addNote ( note ) {

      if ( this.notes[ note.id ] ) {
        return this
      }

      this.notes[ note.id ] = note
      return this

    }

    // Esta función hace una carga total inicial de toda la información de la app
    fullLoad () {

      console.log( 'Model: ' + 'Carga total de la app' )
      var self = this

      async.parallel({

        notes: this._loadFullNotesList.bind(this)

      }, function (err, res) {
        if (err) {
          return this.view.launchAlert(err)
        }

      }.bind(this))

      return this
    }

    // Esta función actualiza la variable openedNote con la nueva nota que hemos abierto y llama a la vista para que haga los cambios oportunos
    openNote ( noteEntry, idNote ) {

      // Comprobamos que no es la nota que ya está abierta
      if( idNote !== this.openedNote ){

        if ( !this.notes[ idNote ] ) {
          return console.error( 'Error al abrir la nota, no existe - ' + idNote )
        }

        this.openedNote = idNote

        console.log( this.notes[ idNote ] )

        this.view.openNote( noteEntry, this.notes[ idNote ] )

        /*
        console.log( 'Este es el valor de orderedNotes antes de reordenar' )
        console.log( this.orderedNotes )

        // Comprobar que esto funciona
        if ( this.orderedNotes.indexOf( 'role' ) > 0 ) {
          this.orderedNotes.splice( this.orderedNotes.indexOf( 'role' ), 1 );
          this.orderedNotes.unshift( 'role' )
        }

        console.log( 'Este es el valor de orderedNotes después de reordenar' )
        console.log( this.orderedNotes )
        */

      }

    }

    orderNotes () {

      this.orderedNotes = Array.from( this.notes )

      function compare( a, b ) {
        if ( a.updated > b.updated )
          return -1;
        if ( a.updated < b.updated )
          return 1;
        return 0;
      }

      this.orderedNotes.sort( compare );
      this.orderedNotes = this.orderedNotes.filter( function(n){ return n != undefined } ) 

    }

    createNote () {

      var currentTime = Date.now()
      var self = this

      wql.createNote( currentTime, function( error, result ){

        if( error ){
          console.log( 'Ha habido un error al crear la nota' )
          console.log( error )
        }else{
          console.log( 'La nota se ha creado correctamente' )
          var note = { id: result.insertId, workspace: self.myContactID, updated: currentTime, content: '' }
          self.addNote( note )
          self.view.newNote( note )
        }

      })

    }

    updateNoteInfo ( idNote, updatedTime, newContent ) {

      this.notes[ idNote ] = { id: idNote, workspace: this.myContactID, updated: updatedTime, content: newContent }

    }

    saveNote ( noteEntry, content ) {

      var currentTime = Date.now()
      var self = this
      var entryID = noteEntry.data( 'idNote' )

      console.log( 'Guardando en WQL' )
      console.log( content )
      console.log( currentTime )
      console.log( entryID )

      wql.updateNote( [ content, currentTime, entryID ], function( error, result ){

        if( error ){
          console.log( 'Ha habido un error al guardar la nota' )
          console.log( error )
        }else{
          console.log( 'La nota se ha actualizado correctamente' )
          self.notes[ entryID ] = { id: entryID, workspace: self.myContactID, updated: currentTime, content: content }
          self.view.updateNoteInfo( noteEntry, currentTime, content )
        }

      })

    }

    removeNote ( noteEntry, idNote ) {

      var self = this

      wql.removeNote( idNote, function( error, result ){

        if( error ){
          console.log( 'Ha habido un error al eliminar la nota' )
          console.log( error )
        }else{
          console.log( 'La nota se ha eliminado correctamente' )
          self.notes[ idNote ] = null
          self.view.removeNote( noteEntry )
        }

      })

    }

  }

  return new Model(view)
})(view)

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
