
class App{

  constructor(){

    this._currentNote   = null
    this._currentEditor = null
    this._sidebar       = null

  }

  /* Methods */
  init(){

    this._sidebar = new Sidebar()
    $('body').append( this._sidebar._dom )
    this._sidebar.init()

  }

  createNote(){

    var note = new SidebarNote()
    this._sidebar.add( note )

    return note

  }

  openNote( note ){

    // Close previous opened note if exists
    if( this._currentEditor ){
      this._currentEditor.close()
    }

    this._currentNote = note
    this._currentEditor = new Note()

    $('body').append( this._currentEditor._dom )
    this._currentEditor.init()

  }

}
