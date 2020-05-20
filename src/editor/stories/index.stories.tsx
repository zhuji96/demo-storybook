/* tslint:disable:no-console */
import * as React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import Editor from '../Editor';
import StateFulEditor from './StateFulEditor';
import UploadEditor from './UploadEditor';

import { menu } from './CustomMenus';
import { toolbarButton } from './CustomToolbarButton';
import { content } from './_fake/fakeContent';
import * as IframeContent from './_api/IframeContent';
import { html2code } from './_utils/Convert';

const domain = 'https://lcdns-pic.learnta.com/';

const defaultInit = {
    plugins:
        'print preview importcss searchreplace directionality code visualblocks fullscreen image link media codesample table charmap hr pagebreak anchor insertdatetime advlist lists textpattern emoticons',
    menubar: 'file edit view insert format table',
    toolbar:
        'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen  preview print | image media link anchor codesample | ltr rtl',
    image_advtab: true,
    height: 300,
};

addDecorator(withKnobs);
addDecorator(withInfo);

storiesOf('Editor', module)
    .add('数学公式', () => <Editor defaultValue="$$\frac12$$" init={{
        mathTypeParameters: {
            serviceProviderProperties: {
                URI: 'http://localhost:8082/pluginwiris_engine/app/configurationjs',
                server: 'java',
            },
        },
        plugins:
            'print preview tiny_mce_wiris',
        menubar: 'file view insert',
        toolbar:
            'fullscreen  preview print | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
    }} />, { info: '数学公式编辑器' })
    .add('默认编辑器', () => <Editor />, { info: '默认的 Editor 编辑器' })
    .add('受控编辑器', () => <StateFulEditor />, { info: '通过state控制 Editor的内容' })
    .add(
        '只读编辑器',
        () => {
            const readonly = boolean('readonly', true);
            return <Editor readonly={readonly} value={content} />;
        },
        {
            info: '通过 Editor 的 readonly 属性控制编辑器的是否为只读模式，默认为false',
        },
    )
    .add(
        '图片/视频上传',
        () => (
            <UploadEditor
                domain={domain}
                imageAccept="image/jpg,image/jpeg"
                mediaAccept="video/mp4"
            />
        ),
        {
            info: '图片/视频上传',
        },
    )
    .add(
        '自定义 menu item',
        () => {
            return (
                <Editor
                    init={{
                        toolbar: false,
                        height: 600,
                        menubar: 'custom file edit',
                        menu: {
                            custom: {
                                title: '我的自定义菜单',
                                items: 'undo redo basicitem nesteditem toggleitem',
                            },
                        },
                        setup: function (editor: any) {
                            menu(editor);
                        },
                    }}
                    value={content}
                />
            );
        },
        {
            info: '自定义 menu item',
        },
    )
    .add(
        '自定义工具栏按钮',
        () => {
            return (
                <Editor
                    init={{
                        height: 600,
                        toolbar: 'myCustomToolbarButton',
                        setup: function (editor: any) {
                            toolbarButton(editor);
                        },
                    }}
                    value={content}
                />
            );
        },
        {
            info: '自定义 menu item',
        },
    )
    .add(
        '自定义 sidebar',
        () => {
            return (
                <Editor
                    init={{
                        ...defaultInit,
                        toolbar: `mysidebar | ${defaultInit.toolbar}`,
                        height: 600,
                        setup: function (editor: any) {
                            editor.ui.registry.addSidebar('mysidebar', {
                                tooltip: 'My sidebar',
                                icon: 'comment',
                                onSetup: function (api: any) {
                                    console.log('onSetup');
                                },
                                onShow: function (api: any) {
                                    const previewContent = IframeContent.getPreviewHtml(editor);
                                    // str_replace([ '"', '&' ], [ '&quot;', '&amp;amp;' ], $srcdoc)
                                    api.element().innerHTML = `<iframe style="width:50vw" sandbox="allow-scripts allow-same-origin" data-alloy-tabstop="true" tabindex="-1" srcdoc="${html2code(
                                        previewContent,
                                    )}"></iframe>`;
                                },
                                onHide: function (api: any) {
                                    console.log('Hide panel', api.element());
                                },
                            });
                        },
                    }}
                    value={content}
                />
            );
        },
        {
            info: '自定义 sidebar',
        },
    );
