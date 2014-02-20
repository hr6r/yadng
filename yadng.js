var _start_x = 0;
var _start_y = 0;
var _seId = 0;
var _dnd_data;

var _url_regex_0 = /[a-zA-Z]+:\/\/[^\s]*/;
var _url_regex_1 = /[^\s]*\.(com|net|org|gov|edu|biz|name|info|asia|uk|hk|cn|hk|au|ca|de|fr|jp|kr|tw|ru|us)/;
var _url_regex_2 = /^javascript:/;

var dragStart = function(e) {
	_start_x = window.event.x;
	_start_y = window.event.y;
	_dnd_data = getDragSelection(e).data;
	return false;
};

var dragOver = function(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	e.dataTransfer.effectAllowed = 'copy';
	e.dataTransfer.dropEffect = 'copy';
	return false;
};

var doDrag = function(e) {
	var _new_seId = _getSeId();
	if (_seId != _new_seId && (window.event.x !== 0 && window.event.y !== 0)) {
		_seId = _new_seId;
	}
};

var doDrop = function(e) {
	if (e.dataTransfer.dropEffect == 'none') {
		// temp set to 'none' for win bug
		// win set the 'copy'(@line 18) to 'move'
		if (e.preventDefault) {
			e.preventDefault();
		}
		if (_dnd_data) {
			var _tab = _getTab(_dnd_data);
			chrome.runtime.connect().postMessage(_tab);
			return false;
		}
	}
};

// thanks to wenzhang.zhu@http://code.google.com/u/wenzhang.zhu/
var getDragSelection = function(e) {
	var data;
	var data_type = 'text';
	var selection = window.getSelection();
	var parent_node = e.srcElement;
	while (parent_node && parent_node.nodeName != 'A') {
		parent_node = parent_node.parentNode;
	}
	if (parent_node) {
		if (!parent_node.href.match(_url_regex_2)) {
			data_type = 'link';
			data = parent_node.href;
		}
	} else if (e.srcElement.nodeName == 'IMG') {
		data_type = 'img';
		data = e.srcElement.src;
	} else {
		data = e.dataTransfer.getData('Text');
		if (!data) {
			data = selection.toString();
		}
	}
	return {
		'type' : data_type,
		'data' : data
	};
};

var doYadng = function(_tab) {
	if (_tab.message == 'tab') {
		chrome.tabs.getSelected(null, function(tab) {
					chrome.storage.sync.get(['indexMode', 'selectedMode',
									'searchEngines'], function(r) {
								_set_index(_tab, tab.index, r.indexMode);
								_set_selected(_tab, r.selectedMode);
								if (!_tab.isUrl) {
									_set_search_url(_tab, r.searchEngines);
								}
								chrome.tabs.create({
											'url' : _tab.url,
											'selected' : _tab.selected,
											'index' : _tab.index
										});
							});
				});
	}
};

var _set_index = function(_tab, _i, _im) {
	if (_im == 2) {
		_tab.index = (_tab.seId === 0 || _tab.seId == 2) ? _i : _i + 1;
		if (!_tab.isUrl) {
			_tab.index = _i + 1;
		}
	} else {
		_tab.index = _im === 0 ? _i + 1 : _i;
	}
};

var _getTab = function(_dnd_data) {
	var _tab = {
		message : 'tab',
		seId : _seId
	};
	_set_url(_tab, _dnd_data);
	return _tab;
};

var _set_url = function(_tab, _dnd_data) {
	var matches = _dnd_data.match(_url_regex_0);
	if (matches) {
		_tab.url = matches[0];
		_tab.isUrl = true;
	} else {
		matches = _dnd_data.match(_url_regex_1);
		if (matches) {
			_tab.url = 'http://' + matches[0];
			_tab.isUrl = true;
		} else {
			_tab.url = _dnd_data;
			_tab.isUrl = false;
		}
	}
};

var _set_search_url = function(_tab, engines) {
	if (-1 == engines[_tab.seId].id) { // user search engines
		_tab.url = engines[_tab.seId].url.replace('%s', _tab.url);
	} else { // build-in
		_tab.url = _build_in_seach_engines[engines[_tab.seId].id].url.replace(
				'%s', _tab.url);
	}
};

var _set_selected = function(_tab, _sm) {
	if (_sm == 2) {
		_tab.selected = (_tab.seId === 0 || _tab.seId == 1) ? true : false;
		if (!_tab.isUrl) {
			_tab.selected = false;
		}
	} else {
		_tab.selected = _sm === 0 ? true : false;
	}
};

var _getSeId = function() {
	var now_x = window.event.x;
	var now_y = window.event.y;
	if (now_x < _start_x) {
		if (now_y > _start_y) {
			return 2;
		}
		return 0;
	} else {
		if (now_y < _start_y) {
			return 1;
		}
		return 3;
	}
};

chrome.runtime.onConnect.addListener(function(port) {
			port.onMessage.addListener(doYadng);
		});
document.addEventListener('dragstart', dragStart, false);
document.addEventListener('drag', doDrag, false);
document.addEventListener('dragover', dragOver, false);
document.addEventListener('dragend', doDrop, false);
document.addEventListener('drop', doDrop, false);