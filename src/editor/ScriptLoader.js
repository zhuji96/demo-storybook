import { uuid } from './Utils';

const injectScriptTag = (scriptId, doc, url, callback) => {
	const scriptTag = doc.createElement('script');
	scriptTag.referrerPolicy = 'origin';
	scriptTag.type = 'application/javascript';
	scriptTag.id = scriptId;
	scriptTag.addEventListener('load', callback);
	scriptTag.src = url;
	if (doc.head) {
		doc.head.appendChild(scriptTag);
	}
};

export const injectScriptMathjax = (doc, callback) => {
	const scriptMathjax = doc.createElement('script');
	// scriptMathjax.referrerPolicy = 'origin';
	// scriptMathjax.type = 'text/javascript';
	scriptMathjax.id = 'MathJax-script';
	// scriptMathjax.defer = true;
	scriptMathjax.addEventListener('load', callback);
	scriptMathjax.src =
		'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/latest.js?config=TeX-MML-AM_CHTML';
	if (doc.head) {
		doc.head.appendChild(scriptMathjax);
	}
};

export const create = () => {
	return {
		listeners: [],
		scriptId: uuid('tiny-script'),
		scriptLoaded: false,
	};
};

export const load = (state, doc, url, callback) => {
	if (state.scriptLoaded) {
		callback();
	} else {
		state.listeners.push(callback);
		if (!doc.getElementById(state.scriptId)) {
			injectScriptTag(state.scriptId, doc, url, () => {
				state.listeners.forEach((fn) => fn());
				state.scriptLoaded = true;
			});
		}
	}
};
