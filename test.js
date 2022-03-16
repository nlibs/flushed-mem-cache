const MEM_CACHE = require("./flushed-mem-cache.js");

var cache = new MEM_CACHE(1000*10, 1000*5, onflush)

function onflush(keys)
{
	console.log("should flush");
	console.log(keys);
}

setInterval(function(){
	var key = Math.floor(Math.random() * 10000000);
	console.log("adding", key);
	cache.set(key, "qweqweqwe");
},1000)