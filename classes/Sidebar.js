
class Sidebar{

  constructor(){

    this._list = []
    this._dom = $('<section class="sidebar"><button>+ New note</button></sidebar>')

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
    return this._text
  }

  set title( newValue ){}

  /* Methods */
  init(){

    this._dom.find('button').on( 'click', function(){

      var note = app.createNote()

      app.openNote( note )

    })

  }

  add( note ){

    if( this._list.indexOf( note ) === -1 ){

      this._list.unshift( note )
      this._dom.find('button').after( note._dom )

    }

  }

}
