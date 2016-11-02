
class SidebarNote{

  constructor( options ){

    options        = options || {}
    this._id       = options.id
    this._created  = options.created || Date.now()
    this._modified = options.modified || Date.now()
    this._title    = options.title || 'New note'
    this._dom      = $('<article class="sidebar-note">' + this._title + '</article>')
  }

  /* Getters and setters */
  get id(){
    return this._id
  }

  set id( newValue ){}

  get status(){
    return this._status
  }

  set status( newValue ){}

  get created(){
    return this._created
  }

  set created( newValue ){}

  get modified(){
    return this._modified
  }

  set modified( newValue ){}

  get title(){
    return this._title
  }

  set title( newValue ){}

}
