import * as React from 'react';

import Editor from '../Editor';

const textareaStyle = { width: '100%', height: '200px', fontSize: '1em' };
const wrapStyle = { padding: '20px' };
const titleStyle = { padding: '20px 20px 20px 0' };
const previewStyle = {
    border: '1px dashed #ccc',
};

export default class StateFulEditor extends React.Component<any, { data: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: '<p>hello</p>',
        };
    }

    public handleChange = (data: string) => {
        console.log('data', data)
        this.setState({ data });
    };

    public render(): React.ReactNode {
        return (
            <div style={wrapStyle}>
                <Editor value={this.state.data} onEditorChange={this.handleChange} />
                <h2 style={titleStyle}>请复制HTML</h2>
                <div style={previewStyle}>
                    <div dangerouslySetInnerHTML={{ __html: this.state.data }} />
                </div>
                <h2 style={titleStyle}>请复制HTML</h2>
                <textarea
                    style={textareaStyle}
                    value={this.state.data}
                    onChange={e => this.handleChange(e.target.value)}
                />
            </div>
        );
    }
}
