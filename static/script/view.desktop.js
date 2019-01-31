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
