class Cache
{
	constructor(expire_duration, flush_duration, onflush, key_limit)
	{
		if (typeof expire_duration == undefined)
			expire_duration = 1000 * 60 * 60; // 1 hour

		if (typeof flush_duration == undefined)
			flush_duration = 1000 * 60 * 5; // 5 minute

		if (typeof key_limit == undefined)
			key_limit = 1024 * 16;

		this.data = {};
		this.expire_map = {};
		this.dirty_keys = {};
		this.key_count = 0;
		this.key_limit = key_limit;
		this.expire_duration = expire_duration;
		var _this = this;
		setInterval(function()
		{
			var now = Date.now();
			onflush(Object.keys(_this.dirty_keys));
			_this.dirty_keys = {};
			for (var key in _this.expire_map)
			{
				var v = _this.expire_map[key];
				if (now < v)
					continue;

				_this.del(key);
			}
		}, flush_duration);
	}
	
	set(k, v, expire_duration)
	{
		if (this.key_count > this.key_limit)
		{
			console.error("======");
			console.error("too many items in the memcache");
			return;
		}

		if (typeof expire_duration == "undefined")
			expire_duration = this.expire_duration;

		if (typeof this.data[k] == "undefined")
			this.key_count++;

		this.dirty_keys[k] = true;
		this.data[k] = v;
		this.expire_map[k] = Date.now() + expire_duration;
	}

	get(k)
	{
		return this.data[k];	
	}

	del(k)
	{
		if (typeof this.data[k] == "undefined")
			return;

		delete this.data[k];
		delete this.expire_map[k];
		this.key_count--;
	}

	has(k)
	{
		return typeof this.data[k] != "undefined";
	}

	debug()
	{
		return this.key_count;
	}
}

module.exports = Cache;