var _getDef = function() {
	return {
		'selectedMode' : 1,
		'indexMode' : 0,
		'searchEngines' : [{
					id : 0
				}, {
					id : 1
				}, {
					id : 11
				}, {
					id : 3
				}]
	};
};

var _show_search_yadng_zone = function(_i, _img) {
	var _zone = $('#search_engine_zone_' + _i);
	if (_zone) {
		_zone.css('background-image', 'url("' + _img + '")');
	}

	var _input = $('#search_engine_url_' + _i);
	if (_input) {
		_input.css('background-image', 'url("' + _img + '")');
	}
};

var _build_in_seach_engines = [{
			'id' : 0,
			'name' : 'wikipedia',
			'favicon' : './favicon/wikipedia.ico',
			'url' : 'http://en.wikipedia.org/wiki/How%s'
		}, {
			'id' : 1,
			'name' : 'google',
			'favicon' : './favicon/google.ico',
			'url' : 'http://www.google.com/search?hl=en&q=%s'
		}, {
			'id' : 2,
			'name' : 'douban',
			'favicon' : './favicon/douban.ico',
			'url' : 'http://www.douban.com/search?search_text=%s'
		}, {
			'id' : 3,
			'name' : 'twitter',
			'favicon' : './favicon/twitter.ico',
			'url' : 'http://twitter.com/search?q=%s'
		}, {
			'id' : 4,
			'name' : 'bing',
			'favicon' : './favicon/bing.ico',
			'url' : 'http://www.bing.com/search?setmkt=en-US&q=%s'
		}, {
			'id' : 5,
			'name' : 'taobao',
			'favicon' : './favicon/taobao.ico',
			'url' : 'http://s.taobao.com/search?q=%s'
		}, {
			'id' : 6,
			'name' : 'shooter',
			'favicon' : './favicon/shooter.ico',
			'url' : 'http://shooter.cn/search/%s'
		}, {
			'id' : 7,
			'name' : 'amazon',
			'favicon' : './favicon/amazon.ico',
			'url' : 'http://www.amazon.com/s/field-keywords=%s'
		}, {
			'id' : 8,
			'name' : 'delicious',
			'favicon' : './favicon/delicious.ico',
			'url' : 'http://delicious.com/search?p=%s'
		}, {
			'id' : 9,
			'name' : 'flickr',
			'favicon' : './favicon/flickr.ico',
			'url' : 'http://www.flickr.com/search/?q=%s'
		}, {
			'id' : 10,
			'name' : 'technorati',
			'favicon' : './favicon/technorati.ico',
			'url' : 'http://technorati.com/search?return=posts&authority=high&q=%s'
		}, {
			'id' : 11,
			'name' : 'youtube',
			'favicon' : './favicon/youtube.ico',
			'url' : 'http://www.youtube.com/results?search_query=%s'
		}, {
			'id' : 12,
			'name' : 'ebay',
			'favicon' : './favicon/ebay.ico',
			'url' : 'http://shop.ebay.com/?_nkw=%s&_sacat=See-All-Categories'
		}, {
			'id' : 13,
			'name' : 'imdb',
			'favicon' : './favicon/imdb.ico',
			'url' : 'http://www.imdb.com/find?s=all&q=%s'
		}, {
			'id' : 14,
			'name' : 'google encrypted',
			'favicon' : './favicon/google.ico',
			'url' : 'https://encrypted.google.com/search?hl=en&q=%s'
		}, {
			'id' : 15,
			'name' : 'wolfram alpha',
			'favicon' : './favicon/wolfram.ico',
			'url' : 'http://www.wolframalpha.com/input/?i=%s'
		}, {
			'id' : 16,
			'name' : 'yahoo',
			'favicon' : './favicon/yahoo.ico',
			'url' : 'http://search.yahoo.com/search?fr=crmas&p=%s'
		}, {
			'id' : 17,
			'name' : 'pinterest',
			'favicon' : './favicon/pinterest.ico',
			'url' : 'http://pinterest.com/search/?q=%s'
		}];

var _i18n_msgs = ['reset_btn', 'vote_legend', 'feedback_a', 'url_legend',
		'fb_legend', 'ab_legend', 'search_legend', 'se_legend', 'url_helper_p',
		'search_helper_p', 'selected_mode_0_label', 'selected_mode_1_label',
		'selected_mode_2_label', 'index_mode_0_label', 'index_mode_1_label',
		'index_mode_2_label', 'lu_strong', 'ru_strong', 'ld_strong',
		'rd_strong', 'search_engine_a_0', 'search_engine_a_1',
		'search_engine_a_2', 'search_engine_a_3', 'feedback_h4'];

/**
 * @deprecated for old users
 */
function _getLocal() {
	var yadng = localStorage.getItem('yadng');
	if (!yadng) {
		return _getDefault();
	}
	return JSON.parse(yadng);
}

/**
 * @deprecated for old users
 */
function _getDefault() {
	return {
		'selectedMode' : 1,
		'indexMode' : 0,
		'searchEngines' : [0, 1, 11, 3]
	};
}