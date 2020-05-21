import React from 'react';
// import { action } from '@storybook/addon-actions';
import Editor from '../src/editor';

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
	return <Editor onChange={handleChange} value={count} />;
};
