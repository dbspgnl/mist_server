// let videoList = [1,null,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
let server_info = [];
var videoLayout = document.getElementById('videoLayout');
var flvPlayer = null;
var videoElement = null;

const start_player = (server_name) => {		
	if (!videoElement && flvjs.isSupported()) {
		document.querySelector('#videoLayout').innerHTML = `<video autoplay muted style="width: 100%;"></video>`;
		videoElement = document.querySelectorAll('video')[0];
		// console.log(videoElement);
		flvPlayer = flvjs.createPlayer({
			type: 'flv',
			// isLive: true,
			url: `http://localhost:8080/${server_name}.flv`
		},{
			// lazyLoad: true
		});
		flvPlayer.attachMediaElement(videoElement);
		flvPlayer.load();
		flvPlayer.play();
	}
}

flvPlayer?.on(flvjs.Events.ERROR, (err, errdet) => {
	console.log("에러 발생");
	flvPlayer.destroy();
})

// mist + index로 조합된 주소가 있을 것으로 생각하고 처리
const check_connection = () => {
	for (let index = 0; index < 2; index++) {
		getServerInfo();
		if(server_info?.hasOwnProperty("mist"+index)){
			if(server_info["mist"+index].online == 1){
				start_player("mist"+index);
			}
			else{
				videoElement?.remove();
				videoElement = null;
			}
		}
	}
}

const getServerInfo = () => {
	const Http = new XMLHttpRequest();
	const url = 'http://localhost:4242/api';
	Http.open('GET', url);
	Http.setRequestHeader('content-type', 'application/json');
	Http.send();
	Http.onreadystatechange = (e) => {
		try {
			const data = Http.responseText;
			if(data) server_info = JSON.parse(data).streams;
		} catch (error) {}
	};
}

// setInterval(() => {
// 	check_connection();