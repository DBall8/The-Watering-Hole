
setInterval(function(){getFrame(), 1000/30});

function getFrame(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handle_res;
	xhr.open("GET", "/frame");
	xhr.send();

}

function handle_res(){
	if(this.readyState != 4){
		return;
	}
	if(this.status != 200){
		console.log("Error in retrieving response.")
	}

	handleFrame(this.responseText);
}

function handleFrame(response){
	var player = JSON.parse(response);
	var el = document.getElementById("player");
	el.style.left = player.x;
	el.style.top = player.y;
}