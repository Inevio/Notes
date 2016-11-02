
class Note{

  constructor( options ){

    options        = options || {}
    this._id       = options.id
    this._status   = options.id ? 'saved' : 'notSaved'
    this._created  = options.created || Date.now()
    this._modified = options.modified || Date.now()
    this._dom      = $('<textarea>')

    if( options.text ){
      this._dom.text( options.text )
    }

    //$('body').html( this._dom )

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

  get text(){
    return this._dom.val()
  }

  set text( newValue ){}

  get title(){
    return this.text
  }

  set title( newValue ){}

  /* Methods */
  init(){
    this._dom.focus()
  }

  close(){
    this._dom.remove()
  }

  save( callback ){

  }

  remove( callback ) {

  }

}
