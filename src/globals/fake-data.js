/* eslint-disable brace-style */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable space-before-function-paren */
/* eslint-disable spaced-comment */
/* eslint-disable indent */
const date = (new Date()).toISOString();

export const pages = {
	page: {
		id: 1,
		content: {
			raw: '',
			rendered: '',
		},
		date,
		date_gmt: date,
		title: {
			raw: 'Preview page',
			rendered: 'Preview page',
		},
		excerpt: {
			raw: '',
			rendered: '',
		},
		status: 'draft',
		revisions: { count: 0, last_id: 0 },
		parent: 0,
		theme_style: true,
		type: 'page',
		link: `${window.location.origin}/preview`,
		categories: [],
		featured_media: 0,
		permalink_template: `${window.location.origin}/preview`,
		preview_link: `${window.location.origin}/preview`,
		_links: {
			'wp:action-assign-categories': [],
			'wp:action-create-categories': [],
		},
	},
	post: {
		id: 1,
		content: {
			raw: '',
			rendered: '',
		},
		date,
		date_gmt: date,
		title: {
			raw: 'Preview post',
			rendered: 'Preview post',
		},
		excerpt: {
			raw: '',
			rendered: '',
		},
		status: 'draft',
		revisions: { count: 0, last_id: 0 },
		parent: 0,
		theme_style: true,
		type: 'post',
		link: `${window.location.origin}/preview`,
		categories: [],
		featured_media: 0,
		permalink_template: `${window.location.origin}/preview`,
		preview_link: `${window.location.origin}/preview`,
		_links: {
			'wp:action-assign-categories': [],
			'wp:action-create-categories': [],
		},
	},
};

window.addEventListener("message", function (e) {

	//only care about these messages
	if (e.data.type === 'setInitialValueForCustomField') {
		const json = e.data.message;
console.log("data from Agility", json);
		localStorage.setItem('g-editor-page', json);
	}
}, false);

export function getPage(type = 'page') {

	const obj = JSON.parse(localStorage.getItem('g-editor-page')) || pages[type];
console.log("GET PAGE", obj);
	localStorage.removeItem('g-editor-page');
	return obj;

}

export function savePage(data, type = 'page') {
	const item = {
		...getPage(type),
		id: data.id || 1, // to prevent when id isn't passed as data (ex: autosaves)
	};

	if (data.title) {
		item.title = {
			raw: data.title,
			rendered: data.title,
		};
	}
	if (data.content) {
		item.content = {
			raw: data.content,
			// rendered: data.content.replace(/(<!--.*?-->)/g, ''),
		};
	}
	if (data.excerpt) {
		item.excerpt = {
			raw: data.excerpt,
			rendered: data.excerpt,
		};
	}

	const json = JSON.stringify(item);
	if (window.parent) {
		window.parent.postMessage({
			message: json,
			type: 'setNewValueFromCustomField'
		}, "*");
	} else {

		localStorage.setItem('g-editor-page', JSON.stringify(item));
	}
}

export function changeType(type) {
	const item = getPage(type);
	item.type = type;

	localStorage.setItem('g-editor-page', JSON.stringify(item));
}

export function deletePage() {
	// Workaround to wait until the POST request (that is called after DELETE)
	// is finished.
	setTimeout(function () {
		localStorage.removeItem('g-editor-page');
		sessionStorage.removeItem('wp-autosave-block-editor-post-1');
		window.location.reload();
	}, 500);
}
