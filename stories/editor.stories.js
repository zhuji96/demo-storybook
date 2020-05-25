import React from 'react';
// import { action } from '@storybook/addon-actions';
import Editor from '../src/editor';
import Preview from '../src/editor/Preview';

export default {
	title: 'Editor',
	component: Editor,
};

export const Default = () => {
	const [count, setCount] = React.useState('');
	console.log('render', count);
	const handleChange = (v) => {
		console.log(v);
		setCount(v);
	};
	return (
		<div>
			<div style={{ height: '300px' }}>
				<Editor onChange={handleChange} value={count} />
			</div>
			<Preview value={count} />
			{/* <div style={{ height: '300px' }}>
				<Editor />
			</div>
			<div style={{ height: '300px' }}>
				<Editor />
			</div>
			<div style={{ height: '300px' }}>
				<Editor />
			</div>
			<div style={{ height: '300px' }}>
				<Editor />
			</div>
			<div style={{ height: '300px' }}>
				<Editor />
			</div>
			<div style={{ height: '300px' }}>
				<Editor />
			</div>
			<div style={{ height: '300px' }}>
				<Editor />
			</div>
			<div style={{ height: '300px' }}>
				<Editor />
			</div> */}
		</div>
	);
};
