var _yadng = {};
var _url_regex_0 = /[a-zA-Z]+:\/\/[^\s]*/;
var _url_regex_1 = /[^\s]*\.(com|net|org|gov|edu|biz|name|info|asia|uk|hk|cn|hk|au|ca|de|fr|jp|kr|tw|ru|us)/;
var _url_regex_2 = /^javascript:/;

var _dragstart = function(e) {
	_yadng.isSearch = false;
	_yadng.startX = e.x;
	_yadng.startY = e.y;
	var el = e.srcElement;
	if (el.nodeName == 'A') {
		var h = el.href;
		if (!h.match(_url_regex_2)) {// NOT href="javascript:
			_yadng.selection = h;
		}
	} else if (el.nodeName == 'IMG') {
		_yadng.selection = el.src;
	} else {
		var t = window.getSelection().toString();
		var m = t.match(_url_regex_0);
		if (m) {// text with url link
			_yadng.selection = m[0];
		} else {
			m = t.match(_url_regex_1);
			if (m) {// text with url link
				_yadng.selection = m[0];
			} else {// text for search
				_yadng.isSearch = true;
				_yadng.selection = t;
			}
		}
	}
	return false;
};

var _dragover = function(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	return false;
};

var _drop = function(e) {
	if (e.stopPropagation) {
		e.stopPropagation();
	}
	if (_yadng.selection) {
		_yadng.endX = e.x;
		_yadng.endY = e.y;
		chrome.runtime.connect().postMessage(_yadng);
	}
	return false;
};

var _doYadng = function(_yadng) {
	chrome.tabs.getSelected(null, function(tab) {
				if (_yadng.isSearch) {
					_doSearch(_yadng, tab);
				} else {
					_doLink(_yadng, tab);
				}
			});
};

var _doSearch = function(_yadng, tab) {
	chrome.storage.sync.get(['searchEngines'], function(r) {
				var se = 0;
				if (_yadng.endX > _yadng.startX) {
					se = _yadng.endY > _yadng.startY ? 3 : 1;
				} else {
					se = _yadng.endY > _yadng.startY ? 2 : 0;
				}
				var url;
				if (-1 == r.searchEngines[se].id) { // user search engines
					url = r.searchEngines[se].url.replace('%s',
							_yadng.selection);
				} else { // build-in
					url = _build_in_seach_engines[r.searchEngines[se].id].url
							.replace('%s', _yadng.selection);
				}
				chrome.tabs.create({
							'url' : url,
							'active' : false,
							'index' : tab.index + 1
						});
			});
};

var _doLink = function(_yadng, tab) {
	chrome.storage.sync.get(['indexMode', 'selectedMode'], function(r) {
				var ti = tab.index;
				var index = ti + 1;
				if (r.indexMode == '2') {
					index = _yadng.endX > _yadng.startX ? ti + 1 : ti;
				} else {
					index = r.indexMode == '0' ? ti + 1 : ti;
				}
				var selected = false;
				if (r.selectedMode == '2') {
					selected = _yadng.endY > _yadng.startY ? false : true;
				} else {
					selected = r.selectedMode == '0' ? true : false;
				}
				chrome.tabs.create({
							'url' : _yadng.selection,
							'active' : selected,
							'index' : index
						});
			});
};

chrome.runtime.onConnect.addListener(function(port) {
			port.onMessage.addListener(_doYadng);
		});
document.addEventListener('dragstart', _dragstart, false);
document.addEventListener('dragover', _dragover, false);
document.addEventListener('drop', _drop, false);