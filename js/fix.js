function fix(callback = null){
  fix.callback = callback;
  $('#fix').show();
}

fix.imready = function(){
    if(fix.callback != null) fix.callback();
    $('#fix').hide();
}
