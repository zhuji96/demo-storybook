import * as React from 'react';
import * as ScriptLoader from './ScriptLoader';
import { getTinymce } from './TinyMCE';
import { ZH_CN } from './LocaleProvider';
import { bindHandlers, isFunction, isTextarea, uuid } from './Utils';

const scriptState = ScriptLoader.create();

const defaultInit = {
	// mathTypeParameters: {
	//     serviceProviderProperties: {
	//         URI: 'http://localhost:8082/pluginwiris_engine/app/configurationjs',
	//         server: 'java',
	//     },
	// },
	plugins:
		'print preview importcss searchreplace directionality code visualblocks fullscreen image link media codesample table charmap hr pagebreak anchor insertdatetime advlist lists textpattern emoticons',
	menubar: 'file edit view insert format table',
	toolbar:
		'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen  preview print | image media link anchor codesample | ltr rtl',
	image_advtab: true,
	height: 300,
};

export default function Editor(props) {
	const { init = defaultInit, value = '', readonly = false, onChange } = props;
	const ref_element = React.useRef();
	const ref_editor = React.useRef();
	const ref_value = React.useRef(value || '');
	const ref_id = React.useRef(uuid('tiny'));

	const initEditorValue = () => {
		const editor = ref_editor.current;
		const defaultValue = typeof value === 'string' ? value : '';
		console.log('init value', defaultValue);
		editor.setContent(defaultValue);
		ref_value.current = defaultValue;
	};

	const initEditorEvent = () => {
		const editor = ref_editor.current;
		if (isFunction(onChange)) {
			editor.off('change keyup setcontent');
			editor.on('change keyup setcontent', (e) => {
				const newContent = editor.getContent();
				if (newContent !== ref_value.current) {
					onChange(newContent);
					ref_value.current = newContent;
				}
			});
		}
	};

	const initTinymce = () => {
		const finalInit = {
			...init,
			language: 'zh_CN',
			target: ref_element.current,
			readonly,
			inline: false,
			plugins: init ? init.plugins : '',
			toolbar: init ? init.toolbar : '',
			setup: (editor) => {
				ref_editor.current = editor;
				editor.setMode(readonly ? 'readonly' : 'design');
				editor.on('init', () => {
					initEditorValue();
					initEditorEvent();
				});

				if (init && typeof init.setup === 'function') {
					init.setup(editor);
				}
			},
		};

		// if (isTextarea(ref_element.current)) {
		// 	ref_element.current.style.visibility = '';
		// }

		getTinymce().init(finalInit);
		ZH_CN();
	};

	React.useEffect(() => {
		const element = ref_element.current;
		const editor = ref_editor.current;
		const callback = () => {
			if (getTinymce() !== null) {
				console.log('unmount');
				getTinymce().remove(ref_editor.current);
			}
		};
		if (element == null) {
			console.log('element do not exists');
			return callback;
		}

		if (getTinymce() !== null) {
			console.log('init tiny');
			initTinymce();
			return callback;
		}
		if (element && element.ownerDocument) {
			console.log('import script');
			const doc = element.ownerDocument;

			ScriptLoader.load(
				scriptState,
				doc,
				'https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js',
				initTinymce,
			);
		}

		return callback;
	}, [init, readonly]);

	React.useEffect(() => {
		const editor = ref_editor.current;
		if (editor != null) {
			console.log('init editor value');
			initEditorValue();
		}
	}, [value]);

	React.useEffect(() => {
		const editor = ref_editor.current;
		if (editor != null) {
			console.log('init editor event');
			initEditorEvent();
		}
	}, [onChange]);

	return React.createElement('textarea', {
		ref: ref_element,
		style: { visibility: 'hidden' },
		id: ref_id,
	});
}

export class EditorC extends React.Component {
	static defaultProps = {
		init: {
			// mathTypeParameters: {
			//     serviceProviderProperties: {
			//         URI: 'http://localhost:8082/pluginwiris_engine/app/configurationjs',
			//         server: 'java',
			//     },
			// },
			plugins:
				'print preview importcss searchreplace directionality code visualblocks fullscreen image link media codesample table charmap hr pagebreak anchor insertdatetime advlist lists textpattern emoticons',
			menubar: 'file edit view insert format table',
			toolbar:
				'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen  preview print | image media link anchor codesample | ltr rtl',
			image_advtab: true,
			height: 300,
		},
	};

	constructor(props) {
		super(props);
		this.id = this.props.id || uuid('tiny-react');
		this.elementRef = React.createRef();
		this.boundHandlers = {};
	}

	componentDidUpdate(prevProps) {
		if (this.editor && this.editor.initialized) {
			bindHandlers(this.editor, this.props, this.boundHandlers);

			this.currentContent = this.currentContent || this.editor.getContent();

			if (
				typeof this.props.value === 'string' &&
				this.props.value !== prevProps.value &&
				this.props.value !== this.currentContent
			) {
				this.editor.setContent(this.props.value);
			}
			if (typeof this.props.readonly === 'boolean' && this.props.readonly !== prevProps.readonly) {
				this.editor.setMode(this.props.readonly ? 'readonly' : 'design');
			}
		}
	}

	componentDidMount() {
		if (getTinymce() !== null) {
			this.initialise();
		} else if (this.elementRef.current && this.elementRef.current.ownerDocument) {
			const doc = this.elementRef.current.ownerDocument;

			ScriptLoader.load(
				scriptState,
				doc,
				'https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js',
				this.initialise,
			);
		}
	}

	componentWillUnmount() {
		if (getTinymce() !== null) {
			getTinymce().remove(this.editor);
		}
	}

	render() {
		return React.createElement('textarea', {
			ref: this.elementRef,
			style: { visibility: 'hidden' },
			id: this.id,
		});
	}

	initialise = () => {
		const finalInit = {
			...this.props.init,
			language: 'zh_CN',
			target: this.elementRef.current,
			readonly: this.props.readonly,
			inline: false,
			plugins: this.props.init ? this.props.init.plugins : '',
			toolbar: this.props.init ? this.props.init.toolbar : '',
			setup: (editor) => {
				this.editor = editor;
				editor.on('init', (e) => {
					this.initEditor(e, editor);
				});

				if (this.props.init && typeof this.props.init.setup === 'function') {
					this.props.init.setup(editor);
				}
			},
		};

		if (isTextarea(this.elementRef.current)) {
			this.elementRef.current.style.visibility = '';
		}

		getTinymce().init(finalInit);
		ZH_CN();
	};

	initEditor(initEvent, editor) {
		const value = typeof this.props.value === 'string' ? this.props.value : '';
		editor.setContent(value || this.props.defaultValue || '');

		if (isFunction(this.props.onEditorChange)) {
			editor.on('change keyup setcontent', (e) => {
				const newContent = editor.getContent();

				if (newContent !== this.currentContent) {
					this.currentContent = newContent;
					if (isFunction(this.props.onEditorChange)) {
						this.props.onEditorChange(this.currentContent, editor);
					}
				}
			});
		}

		if (isFunction(this.props.onInit)) {
			this.props.onInit(initEvent, editor);
		}

		bindHandlers(editor, this.props, this.boundHandlers);
	}
}
