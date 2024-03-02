var ysdk = null;

function InitYaSDK(){
	console.log('VK SDK begin initialized');
	const queryString = window.location.search.slice(1);
	const paramsArray = queryString.split('&');
	window.paramsObject = {};
	paramsArray.forEach(param => {
			const [key, value] = param.split('=');
			paramsObject[key.toLowerCase()] = value.toLowerCase();
	});

	if(localStorage['savelang'] != null) {
			window.lang = localStorage['savelang'];
	}
	else window.lang = paramsObject.lang == 'ru_ru' ? 'ru' : 'en';

		iframeApi({
				appid: 33280,
				getLoginStatusCallback: function(status) {},
				userInfoCallback: function(info) {console.log(info);},
				adsCallback: adsCallback
		}).then(function(api){
			window.ysdk = api;
			console.log('VK SDK initialized');
			window.isMobile = false;
		}, function(code){
			console.log("VK SDK Init Error: " + code);
		});
}

InitYaSDK();

function updscore(){

}

document.addEventListener("visibilitychange", function() {
	  if (document.visibilityState === "hidden") {
			unityInstance.SendMessage('Level', 'PreBanner');
			window['MusEnable'] = false;
			pauseMusic();
	  }
	  else if(!advInScr){
			unityInstance.SendMessage('Level', 'PostBanner');
			window['MusEnable'] = true;
			playMusic();
	  }
	});

function setSize() {
    var unityContainer = document.getElementById("unityContainer");
    unityContainer.style.width = window.innerWidth + "px";
    unityContainer.style.height = window.innerHeight + "px";
  }


function adsCallback(data){
  console.log(data);
  if(adsCallback.onClose != null) adsCallback.onClose();
  if(adsCallback.onRewarded != null) adsCallback.onRewarded();
}

var adv = {
  showFullscreenAdv: function(info){
    let cb = info.callbacks;
    adsCallback.onClose = cb.onClose;
    adsCallback.onRewarded = cb.onRewarded;
    ysdk.showAds({interstitial: true});
  },
  showRewardedVideo: function(info){
    let cb = info.callbacks;
    adsCallback.onClose = cb.onClose;
    adsCallback.onRewarded = cb.onRewarded;
    ysdk.showAds({interstitial: false});
  }
}

function yabanner(end){

	window['MusEnable'] = false;
	pauseMusic();
  advInScr = true;
  unityInstance.SendMessage('Level', 'PreBanner');
  adv.showFullscreenAdv({callbacks: {onClose: function(){
		window['MusEnable'] = true;
	  unityInstance.SendMessage('Level', 'PostBanner');
	  end();
	  advInScr = false;
		playMusic();
	}}});
}

var advInScr = false;

function yarbanner(reward,end){
	window['MusEnable'] = false;
	pauseMusic();
  advInScr = true;
  unityInstance.SendMessage('Level', 'PreBanner');

  adv.showRewardedVideo({callbacks: {
	  onRewarded:reward,
	  onClose: function(){
		unityInstance.SendMessage('Level', 'PostBanner');
		window['MusEnable'] = true;
		end();
		advInScr = false;
		playMusic();
	}}});
}
