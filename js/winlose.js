function Win(level, stars){
  if(!WinLoseListern) return;
  if(misstimer != null){
    misstimer.remove();
    misstimer = null;
  }
  const index = 'level_'+curlvl;
  const _stars = localStorage[index];
  localStorage[index] = _stars == null ? stars : (parseInt(stars) > parseInt(_stars) ? stars : _stars);
  unlockLevel(parseInt(curlvl) + 1);

  $('.overlay > div').hide();
  $('#wm').html('').append(getWindow(getWin(stars))).show();
  $('.overlay').show(500);
  guiHide();
  CountScore(true);
}

function Lose(level,stars){
  if(!WinLoseListern) return;
  $('.overlay > div').hide();
  const wnd = getWindow(parseInt(curlvl) == parseInt(20) ? getINFINITY(stars) : getLose());
  $('#wm').html('').append(wnd).show();

  if(LevelIsLock(parseInt(curlvl) + 1)){
    wnd.css({'height':'55vh'});
  }

  $('.overlay').show(500);
  guiHide();
}

function getWindow(content){
  return $('<div class="window">').append(content);
}

function getWin(){
  return [
    $('<h1>').text(TXT('win')),
    $('<div class="starContainer">').append(getLevel_stars(curlvl)),
    $('<div class="buttonsContainer">').append(getButtons())
  ];
}

function getINFINITY(stars){
  const buttons = getButtons();
  return [
    $('<h1>').text(TXT('inf')),
    $('<div class="starContainer">').append(getINFINITYResultsContainer(stars)),
    $('<div class="buttonsContainer">').append([buttons[0],buttons[1]])
  ]
}

function getINFINITYResultsContainer(stars){
  const index = 'level_'+curlvl;
  const _stars = localStorage[index];
  localStorage[index] = _stars == null ? stars : (parseInt(stars) > parseInt(_stars) ? stars : _stars);

  return [
    $('<p>').text(TXT('inf0') + stars + TXT('infs')),
    $('<p>').text(TXT('inf1') + localStorage[index] + TXT('infs'))
  ];
}

function getLose(){
  const buttons = getButtons();
  const buttonsSpan = $('<span>');

  if(LevelIsLock(parseInt(curlvl) + 1)){
    buttonsSpan.append([
      $('<div class="buttonsContainer">').append([buttons[0],buttons[1]]),
      $('<div class="buttonsContainer">').append(buttons[2]).css({
        'margin-top':'1vh'
      })
    ]);
  }
  else{
    buttonsSpan.append($('<div class="buttonsContainer">').append(buttons));
  }

  return [
    $('<h1>').text(TXT('lose')),
    $('<div class="starContainer">').append(getLevel_stars(curlvl)),
    buttonsSpan
  ];
}

function getToMenuButton(_guihide){
  return $('<div class="button">').append($('<img>').attr('src','img/menu.png')).click(function(){
    if(btnDTC.check()){
      yabanner(function(){
         showMainMenu();
         if(_guihide){
           guiHide();
         }
         unityInstance.SendMessage('Level', 'OpenLevel', curlvl);
         if(misstimer != null){
           misstimer.remove();
           misstimer = null;
         }
       });
     }
  });
}

const resetIMG = $('<img>').attr('src','img/reset.png');
function getResetButton(goPlay){
  return $('<div class="button">').append(resetIMG.clone()).click(function(){
    if(btnDTC.check()){
      /*window.LevelLoadCompliteHendler = function(){
        unityInstance.SendMessage('Level', 'PlayClick');
        if(isMobile) unityInstance.SendMessage('Level', 'EnableMobileContoller');
      };*/
      unityInstance.SendMessage('Level', 'OpenLevel', curlvl);
      if(goPlay)GoPlay();
      else{
        fix(function(){
          gui.show(200);
          unityInstance.SendMessage('Level', 'PlayClick');
          if(isMobile) unityInstance.SendMessage('Level', 'EnableMobileContoller');
        });
      }
      if(misstimer != null){
        misstimer.remove();
        misstimer = null;
      }
    }
  });
}

const btnDTC = new DateTimeClock(1);
const nextIMG = $('<img>').attr('src', 'img/next.png');
function getButtons(){
  const nextLevelLock = LevelIsLock(parseInt(curlvl) + 1);
  return [
    getToMenuButton(false),
    getResetButton(true),
    $('<div class="button" '+(nextLevelLock ? 'style="width:90%;"' : '')+'>').append(
      nextLevelLock ? $('<span>').text(TXT('adv')).css({'font-size':'2vh'}):
      nextIMG.clone()
    ).click(function(){
      if(btnDTC.check()){
        var nextfunction = function(skip){
          curlvl = parseInt(curlvl)+1;
          /*window.LevelLoadCompliteHendler = function(){
            unityInstance.SendMessage('Level', 'PlayClick');
            if(isMobile) unityInstance.SendMessage('Level', 'EnableMobileContoller');
          };*/
          unityInstance.SendMessage('Level', 'OpenLevel', curlvl);
          GoPlay(skip);
        };

        if(nextLevelLock){
          yarbanner(function(){}, function(){
            unlockLevel(parseInt(curlvl)+1);
            nextfunction(true);
          });
        }
        else{
          nextfunction(false);
        }
      }
    })
  ];
}
