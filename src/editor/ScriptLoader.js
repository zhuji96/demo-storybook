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
	if (doc.getElementById('MathJax-script')) return;
	const scriptMathjax = doc.createElement('script');
	// scriptMathjax.referrerPolicy = 'origin';
	// scriptMathjax.type = 'text/javascript';
	scriptMathjax.id = 'MathJax-script';
	// scriptMathjax.defer = true;
	scriptMathjax.addEventListener('load', () => {
		MathJax.Hub.Config({
			tex2jax: {
				inlineMath: [
					['$', '$'],
					['\\(', '\\)'],
				],
				// When set to true, you may use \$ to represent a literal dollar sign,
				// rather than using it as a math delimiter.
				// When false, \$ will not be altered, and the dollar sign may be considered part of a math delimiter.
				// Typically this is set to true if you enable the $ ... $ in-line delimiters,
				// so you can type \$ and tex2jax will convert it to a regular dollar sign in the rendered document.
				processEscapes: true,
			},
			TeX: { extensions: ['AMSmath.js', 'AMSsymbols.js', 'extpfeil.js'] },
			CommonHTML: {
				// 公式自动换行，可以参考官网
				linebreaks: { automatic: true },
			},
		});
		callback();
	});
	scriptMathjax.src =
		'https://frontend-alioss.learnta.com/lib/MathJax-master/MathJax.js?config=TeX-MML-AM_CHTML';
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
