export default class ObserverManager {
	listener;
	binds;

	constructor() {
		this.listener = {};
		this.binds = {};
	}

	add(func, id, el) {
		this.listener[id] = new IntersectionObserver(func);
		this.binds[id] = el;
		this.listener[id].observe(el);
	}

	get(id) {
		return this.listener[id];
	}

	unobserve(id) {
		this.listener[id].unobserve(this.binds[id]);
	}

	clean(id) {
		delete this.listener[id];
		delete this.binds[id];
	}

	reObserve() {
		Object.keys(this.listener).forEach((id) => {
			this.listener[id].observe(this.binds[id]);
		});
	}
}
