import React from 'react';
// import { action } from '@storybook/addon-actions';
import Editor from '../src/editor';

export default {
	title: 'Editor',
	component: Editor,
};

export const Default = () => <Editor onChange={console.log} />;
