var WinLoseListern = false;
function GoPlay(skip = false){
  let toGame = function(){
    $('.overlay').hide(300);
    WinLoseListern = true;
    if(gui == null){
      gui = buildGUI();
      $('body').append(gui);
    }

    fix(function(){
      gui.show(200);
      unityInstance.SendMessage('Level', 'PlayClick');
      if(isMobile) unityInstance.SendMessage('Level', 'EnableMobileContoller');
    });

    if(misstimer != null){
      misstimer.remove();
      misstimer = null;
    }
  };
  mfplay = true;
  console.log("SKIP ADV: " + skip)
  if(skip) toGame();
  else yabanner(toGame);
}

var LevelLoadCompliteHendler = null;
function LevelLoadComplite(){
  if(LevelLoadCompliteHendler != null){
    LevelLoadCompliteHendler();
    LevelLoadCompliteHendler = null;
  }
}

var misstimer = null;
function UpdateTimer(str){
  if(misstimer == null){
    misstimer = $('<div id="misstimer">').css({
      'position':'absolute',
      'z-index': '4',
      'color': '#da4baf',
      'font-size':'4vh',
      'top':'45vh',
      'right': '0.5vw'
    });
    $('body').append(misstimer);
  }

  misstimer.html(str);
}

function guiHide(){
  if(gui!=null){
    gui.hide(200);
    WinLoseListern = false;
  }
}

var gui = null;
function buildGUI(){
  return $('<span id="gui">').append([buildGUILeft(),buildGUIRight()]).hide();
}

function buildGUILeft(){
  return $('<div id="guileft" class="buttonsContainer">').append(window.isMobile ? getToMenuButton(true) : getMusicButton());
}

function buildGUIRight(){
  return $('<div id="guiright" class="buttonsContainer">').append(window.isMobile ? getResetButton(false) : [
    getToMenuButton(true),
    getResetButton(false)
  ]);
}
function hideGUI(){
  gui.hide();
}

var musicOnState = null;
var musicOffState = null;
function getMusicButton(){
  if(musicOnState == null) musicOnState = $('<img>').attr('src','img/music_on.png');
  if(musicOffState == null) musicOffState = $('<img>').attr('src','img/music_off.png');

  const elem = $('<div class="button">').append(musicOnState).click(function(){
    if(btnDTC.check()){
        UserMusEnable = !UserMusEnable;

        if(UserMusEnable){
          elem.empty().append(musicOnState.clone());
          playMusic();
        }
        else{
          elem.empty().append(musicOffState.clone());
          pauseMusic();
        }
    }
  });
  return elem;
}
