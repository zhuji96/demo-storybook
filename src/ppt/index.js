import PPTToolbar from './PPTToolbar/index';
import PPTWorkspace from './PPTWorkspace/index';

export default function PPT(props) {
	const pptKey = React.useRef('' + Date.now());

	return (
		<div>
			<PPTToolbar pptKey={pptKey} />
			<PPTWorkspace pptKey={pptKey} />
		</div>
	);
}
