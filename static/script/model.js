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
