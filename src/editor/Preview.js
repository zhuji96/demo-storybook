import React from 'react';

import { injectScriptMathjax } from './ScriptLoader';

export default function Preview(props) {
	const { value } = props;
	const ref_element = React.useRef();
	React.useEffect(() => {
		if (ref_element.current && ref_element.current.ownerDocument.defaultView == null) {
			injectScriptMathjax(ref_element.current.ownerDocument, () => console.log('load'));
		} else {
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, ref_element.current]);
		}
	});
	return <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(value || '') }} ref={ref_element} />;
}

function sanitizeHTML(str) {
	return str;
	// let temp = document.createElement('div');
	// temp.textContent = str;
	// return temp.innerHTML;
}
