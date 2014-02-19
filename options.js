Zepto(function() {

			_init_i18n();

			_init_open_link_options();
			_init_search_options();

			$('[name=selected_mode]').on('change', save_selected_mode);
			$('[name=index_mode]').on('change', save_index_mode);

			$('[name=search_engine]').on('change', save_search_engine);
			$('[name=add_search_engine]').on('click', add_search_engine);

			$('#reset_btn').on('click', reset);

		});

var _init_i18n = function() {
	for (var i = 0; i < _i18n_msgs.length; i++) {
		$('#' + _i18n_msgs[i]).html(chrome.i18n.getMessage(_i18n_msgs[i]));
	}
};

var _init_open_link_options = function() {

	chrome.storage.sync.get('selectedMode', function(r) {
				if (!'selectedMode' in r) {// for old user data
					r.selectedMode = _getLocal().selectedMode;
					chrome.storage.sync.set({
								'selectedMode' : r.selectedMode
							});
				}
				$('#selected_mode_' + r.selectedMode).prop('checked', true);
			});

	chrome.storage.sync.get('indexMode', function(r) {
				if (!'indexMode' in r) {// for old user data
					r.indexMode = _getLocal().indexMode;
					chrome.storage.sync.set({
								'indexMode' : r.indexMode
							});
				}
				$('#index_mode_' + r.indexMode).prop('checked', true);
			});
};

function _init_selects(_id) {

	var _select = $('#search_engine_select_' + _id);

	for (var i = 0; i < _build_in_seach_engines.length; i++) {
		_select.append($('<option></option>').attr('value',
				_build_in_seach_engines[i].id)
				.text(_build_in_seach_engines[i].name));
	}
	_select.append($('<option></option>').attr('value', -1).text(chrome.i18n
			.getMessage('se_option_yours')));

	return _select;
};

var _init_search_options = function() {

	chrome.storage.sync.get('searchEngines', function(r) {

				if (!'searchEngines' in r) { // for old user data
					r.searchEngines = [];
					var _old = _getLocal().searchEngines;
					for (var i = 0; i < _old.length; i++) {
						if (isNaN(_old[i])) {// user SE
							r.searchEngines[i] = {
								id : -1,
								url : _old[i].url
							};
						} else { // build-in SE
							r.searchEngines[i] = {
								id : _old[i]
							};
						}
					}
					chrome.storage.sync.set({
								'searchEngines' : r.searchEngines
							});
				}

				var engines = r.searchEngines;
				for (var i = 0; i < engines.length; i++) {
					var _s = _init_selects(i);
					_s.val(engines[i].id);
					if (-1 == engines[i].id) {// user search engines
						$('#search_engine_url_' + i).prop('readonly', false)
								.val(engines[i].url);
						$('#search_engine_a_' + i).show();
						_show_search_yadng_zone(i, 'img/zoom.png');
					} else {// build-in
						$('#search_engine_url_' + i)
								.prop('readonly', true)
								.val(_build_in_seach_engines[engines[i].id].url);
						$('#search_engine_a_' + i).hide();
						_show_search_yadng_zone(i,
								_build_in_seach_engines[engines[i].id].favicon);
					}
				}
			});
};

var save_selected_mode = function(e) {
	chrome.storage.sync.set({
				'selectedMode' : $(e.target).val()
			});
	return false;
};

var save_index_mode = function(e) {
	chrome.storage.sync.set({
				'indexMode' : $(e.target).val()
			});
	return false;
};

var save_search_engine = function(e) {

	chrome.storage.sync.get('searchEngines', function(r) {

				var _select = $(e.target);

				var _sid = _select.data('id');
				var _sv = _select.val();

				var searchEngines = r.searchEngines;

				if (_sv == -1) {// user SE

					$('#search_engine_url_' + _sid).prop('readonly', false)
							.val('').focus();
					$('#search_engine_a_' + _sid).show();
					_show_search_yadng_zone(_sid, 'img/zoom.png');

				} else {// select from build-in

					$('#search_engine_url_' + _sid).prop('readonly', true)
							.val(_build_in_seach_engines[_sv].url);
					$('#search_engine_a_' + _sid).hide();

					searchEngines[_sid].id = _sv;
					_show_search_yadng_zone(
							_sid,
							_build_in_seach_engines[searchEngines[_sid].id].favicon);

					chrome.storage.sync.set({
								'searchEngines' : searchEngines
							});
				}

				return false;
			});
};

var add_search_engine = function(e) {

	var _btn = $(e.target);

	var _bid = _btn.data('id');

	// FIXME alert
	var url = $('#search_engine_url_' + _bid).val();
	if (!url) {
		alert(chrome.i18n.getMessage('se_empty_alert'));
		return false;
	}

	var _s = /%s/;
	if (!url.match(_s)) {
		alert(chrome.i18n.getMessage('se_no_s_alert'));
		return false;
	}

	var url_regex_0 = /[a-zA-z]+:\/\/[^\s]*/
	if (!url.match(url_regex_0)) {
		alert(chrome.i18n.getMessage('se_not_url_alert'));
		return false;
	}

	chrome.storage.sync.get('searchEngines', function(r) {

				var searchEngines = r.searchEngines;
				searchEngines[_bid].id = -1;
				searchEngines[_bid].url = url;

				chrome.storage.sync.set({
							'searchEngines' : searchEngines
						});

				_show_search_yadng_zone(_bid, 'img/zoom.png');

				alert(chrome.i18n.getMessage('se_save_alert'));
			});
};

var reset = function(e) {

	if (confirm(chrome.i18n.getMessage('reset_alert'))) {

		chrome.storage.sync.clear(function() {
					var _def = _getDef();
					chrome.storage.sync.set({
								'selectedMode' : _def.selectedMode,
								'indexMode' : _def.indexMode,
								'searchEngines' : _def.searchEngines
							}, function() {
								_init_open_link_options();
								_init_search_options();
							});
				});
	}
};