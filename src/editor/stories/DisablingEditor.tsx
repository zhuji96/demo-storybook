/* tslint:disable:no-console */
import * as React from 'react';

import Editor from '../Editor';

export default class DisablingEditor extends React.Component<any, { disabled: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { disabled: false };
        this.toggleDisabled = this.toggleDisabled.bind(this);
    }

    public toggleDisabled() {
        this.setState({ disabled: !this.state.disabled });
    }

    public render(): React.ReactNode {
        const { disabled } = this.state;
        return (
            <div>
                <Editor readonly={disabled} />
                <button onClick={this.toggleDisabled}>
                    {this.state.disabled ? 'enable' : 'disable'}
                </button>
            </div>
        );
    }
}
