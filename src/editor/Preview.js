import React from 'react';

import { injectScriptMathjax } from './ScriptLoader';

export default function Preview(props) {
	const { value } = props;
	const ref_element = React.useRef();
	React.useEffect(() => {
		console.log(
			'aa',
			ref_element.current.ownerDocument.defaultView,
			ref_element.current.ownerDocument.defaultView.MathJax,
		);
		if (
			ref_element.current != null &&
			ref_element.current.ownerDocument.defaultView != null &&
			ref_element.current.ownerDocument.defaultView.MathJax == null
		) {
			injectScriptMathjax(ref_element.current.ownerDocument, () => {
				console.log('load');
			});
		} else {
			console.log('update');
			ref_element.current.innerHTML = value;
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, ref_element.current]);
		}
	}, [value]);
	return <div ref={ref_element} />;
}

function sanitizeHTML(str) {
	return str;
	// let temp = document.createElement('div');
	// temp.textContent = str;
	// return temp.innerHTML;
}
