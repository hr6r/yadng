window.onload = function() {

	for (var i = 0; i < 3; i++) {
		document.getElementById("selected_mode_" + i).addEventListener("click",
				function() {
					save_selected_mode(this.value);
				}, false);
		document.getElementById("index_mode_" + i).addEventListener("click",
				function() {
					save_index_mode(this.value);
				}, false);
	}
	for (var i = 0; i < 4; i++) {
		document.getElementById("search_engine_select_" + i).addEventListener(
				"change", function() {
					save_search_engine(this);
				}, false);
		document.getElementById("search_engine_a_" + i).addEventListener(
				"click", function() {
					add_search_engine(this.title);
				}, false);
	}
	document.getElementById("reset_btn")
			.addEventListener("click", reset, false);

	var yadng = _getLocal();
	_fill_open_link_options(yadng);
	_fill_search_options(yadng);
	_i18n();
};

function _i18n() {
	for (var i = 0; i < _i18n_msgs.length; i++) {
		document.getElementById(_i18n_msgs[i]).innerHTML = chrome.i18n
				.getMessage(_i18n_msgs[i]);
	}
}

function _fill_open_link_options(yadng) {
	_check_radio("selected_mode_" + yadng.selectedMode);
	_check_radio("index_mode_" + yadng.indexMode);
}

function save_selected_mode(selectedMode) {
	var yadng = _getLocal();
	yadng.selectedMode = selectedMode;
	_save(yadng);
}

function save_index_mode(indexMode) {
	var yadng = _getLocal();
	yadng.indexMode = indexMode;
	_save(yadng);
}

function _fill_search_options(yadng) {
	var engines = yadng.searchEngines;
	for (var i = 0; i < engines.length; i++) {
		var _s = _init_selects(i);
		if (isNaN(engines[i])) {// user search engines
			document.getElementById("search_engine_url_" + i).value = engines[i].url;
			_s.selectedIndex = _build_in_seach_engines.length;
			document.getElementById("search_engine_a_" + i).style.display = "";
			document.getElementById("search_engine_url_" + i).readOnly = false;
			_show_search_yadng_zone(i, "./img/zoom.png", 1);
		} else {// build-in
			document.getElementById("search_engine_url_" + i).value = _build_in_seach_engines[engines[i]].url;
			_s.selectedIndex = engines[i];
			document.getElementById("search_engine_url_" + i).readOnly = true;
			_show_search_yadng_zone(i,
					_build_in_seach_engines[engines[i]].favicon, 1);
		}
	}
}

function add_search_engine(_id) {// add new
	var yadng = _getLocal();
	var url = document.getElementById("search_engine_url_" + _id).value;
	if (!url) {
		alert(chrome.i18n.getMessage("se_empty_alert"));
		return;
	}
	var _s = /%s/;
	if (!url.match(_s)) {
		alert(chrome.i18n.getMessage("se_no_s_alert"));
		return;
	}
	var url_regex_0 = /[a-zA-z]+:\/\/[^\s]*/
	if (!url.match(url_regex_0)) {
		alert(chrome.i18n.getMessage("se_not_url_alert"));
		return;
	}

	yadng.searchEngines[_id] = {
		'url' : url
	};
	_save(yadng);
	_show_search_yadng_zone(_id, "./img/zoom.png", 1);
	alert(chrome.i18n.getMessage("se_save_alert"));
}

function save_search_engine(_select) {// select
	var _id = _select.title;
	var _v = _select.options[_select.selectedIndex].value;
	var yadng = _getLocal();
	if (_v == -1) {// add new
		if (isNaN(yadng.searchEngines[_id]))// still from select
			document.getElementById("search_engine_url_" + _id).value = yadng.searchEngines[_id].url;
		else
			document.getElementById("search_engine_url_" + _id).value = "";
		document.getElementById("search_engine_url_" + _id).readOnly = false;
		document.getElementById("search_engine_a_" + _id).style.display = "";
		_show_search_yadng_zone(_id, "./img/zoom.png", 1);
	} else {// select from build-in
		document.getElementById("search_engine_url_" + _id).value = _build_in_seach_engines[_v].url;
		document.getElementById("search_engine_url_" + _id).readOnly = true;
		document.getElementById("search_engine_a_" + _id).style.display = "none";
		yadng.searchEngines[_id] = _v;
		_save(yadng);
		_show_search_yadng_zone(_id,
				_build_in_seach_engines[yadng.searchEngines[_id]].favicon, 1);
	}
}

function _init_selects(_id) {
	var _select = document.getElementById("search_engine_select_" + _id);
	if (!_select.options.length) {
		for (var i = 0; i < _build_in_seach_engines.length; i++)
			_select.add(new Option(_build_in_seach_engines[i].name, i, false));

		_select.add(new Option(chrome.i18n.getMessage("se_option_yours"), -1,
				false, false));
	}
	return _select;
}

function _save(yadng) {
	localStorage.setItem("yadng", JSON.stringify(yadng));
}

function reset() {
	if (confirm(chrome.i18n.getMessage("reset_alert"))) {
		var yadng = _getLocal();

		yadng = _getDefault();
		_save(yadng);

		_fill_open_link_options(yadng);
		_fill_search_options(yadng);
	}
}