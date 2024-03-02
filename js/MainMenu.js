function showMainMenu(){
  $('.overlay > div').hide();
  $('#mm').empty().append(getMainMenu()).show();
  $('.overlay').show(500);
}

var score = 0;
var curlvl = 0;
const levels = 8;

function getMainMenu(){
  const lvl = [];

  CountScore(false);

  for(let i = 0; i < levels; i++){
     let lvldiv = getLevel(i);
     if(parseInt(i) == curlvl) lvldiv.addClass('lvlselect');
     lvl.push(lvldiv);
  }

  //lvl[20].find('.header').html('&infin;');

  const unlocklvl = !LevelIsLock(curlvl);

  return [
    $('<div id="score">').append([
      getStar(true),
      $('<span>').text(score)
    ]),
    $('<div id="levels">').append(lvl),

    unlocklvl ?
    $('<div id="play">').append($('<img>').attr('src','img/play.png')).click(function(){GoPlay(false);}) : $('<div id="lockbtn">').append([$('<img>').attr('src','img/lock.png'),$('<span>').text(TXT('lvl'))]).click(function(){
      yabanner(function(){
        curlvl = parseInt(getMaxUnlockLevel());
        unityInstance.SendMessage('Level', 'OpenLevel', curlvl);
        $('#mm').html('').append(getMainMenu()).show();
        if(misstimer != null){
          misstimer.remove();
          misstimer = null;
        }
      });
    }),
    getMovementHelp(),
    getLocalizationButtons()
  ];
}

function getMovementHelp(){
  if(window['isMobile'] != null && isMobile) return null;

  const _ru = "W - <i>плыть или лететь вперёд</i>, S - <i>плыть или лететь назад</i>, A - <i>влево</i>, D - <i>вправо</i>, Пробел - <i>Вверх</i>, C - <i>Вниз</i>";
  const _en = "W - <i>swim or fly forward</i>, S - <i>swim or fly back</i>, A - <i>to the left</i>, D - <i>to the right</i>, Space Bar - <i>Up</i>, C - <i>Down</i>";

  return $('<p id="pcmovement">').html(lang == 'ru' ? _ru : _en);
}

function CountScore(_updscore){
  score = 0;
  for(let i = 0; i < levels; i++){
    let stars = localStorage['level_'+i];
    if(stars == null){
      continue;
    }

    score = parseInt(score + parseInt(stars));
  }

  if(_updscore)updscore();
}

const lockIMG = $('<img>').attr('src','img/lock.png');
function getLevel(index){
  return $('<div class="level">').append([
    $('<div class="header">').text(index + 1),
    $('<div class="starContainer">').append(
       LevelIsLock(index) ? $('<div class="star">').append(lockIMG.clone()) : getLevel_stars(index)
    )
  ])
  .click(function(){
    if(parseInt(curlvl) == parseInt(index)) return;
    yabanner(function(){
        curlvl = parseInt(index);
        unityInstance.SendMessage('Level', 'OpenLevel', curlvl);
        $('#mm').html('').append(getMainMenu()).show();
      });
  });
}

function getLevel_stars(index){
  let stars = localStorage['level_'+index];
  if(stars == null){
    stars = 0;
  }
  else stars = parseInt(stars);

  if(stars > 3 || parseInt(index) == parseInt(20)){
    return [
      $('<span>').text(stars),
      getStar(true)
    ];
  }

  const starsc = [];
  for(let i = 1; i < 4; i++){
    starsc.push(getStar(i <= stars));
  }

  return starsc;
}

function getStar(state){ //false - noactive, true - active
  return $('<div class="star">').append(
      $('<img>').attr('src', state ? "img/star1.png" : "img/star2.png")
  );
}

function unlockLevel(index){
  localStorage['ulevel_'+index] = 1;
}

function unlockALL(){
  for(let i = 0; i < levels; i++){
      unlockLevel(i);
  }
}

unlockLevel(0);

function getMaxUnlockLevel(){
  for(let i = curlvl; i >= 0; i--){
    if(!LevelIsLock(i)) return i;
  }
  return 0;
}

function LevelIsLock(index){
  return localStorage['ulevel_'+index] == null;
}
