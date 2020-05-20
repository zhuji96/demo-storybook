export const isFunction = (x) => typeof x === 'function';

const findEventHandlers = (props) => {
	return Object.keys(props)
		.filter((name) => isFunction(props[name]))
		.map((name) => ({
			handler: props[name],
			eventName: name.substring(2),
		}));
};

export const bindHandlers = (editor, props, boundHandlers) => {
	findEventHandlers(props).forEach((found) => {
		// Unbind old handler
		const oldHandler = boundHandlers[found.eventName];
		if (isFunction(oldHandler)) {
			editor.off(found.eventName, oldHandler);
		}

		// Bind new handler
		const newHandler = (e) => found.handler(e, editor);
		boundHandlers[found.eventName] = newHandler;
		editor.on(found.eventName, newHandler);
	});
};

let unique = 0;

export const uuid = (prefix) => {
	const date = new Date();
	const time = date.getTime();
	const random = Math.floor(Math.random() * 1000000000);

	unique++;

	return prefix + '_' + random + unique + String(time);
};

export const isTextarea = (element) => {
	return element !== null && element.tagName.toLowerCase() === 'textarea';
};
