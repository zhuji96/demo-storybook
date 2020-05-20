const getPreviewDialogWidth = function(editor: any) {
    return parseInt(editor.getParam('plugin_preview_width', '650'), 10);
};

const getPreviewDialogHeight = function(editor: any) {
    return parseInt(editor.getParam('plugin_preview_height', '500'), 10);
};

const getContentStyle = function(editor: any) {
    return editor.getParam('content_style', '');
};

const shouldUseContentCssCors = (editor: any): boolean => {
    return editor.getParam('content_css_cors', false, 'boolean');
};

export default {
    getPreviewDialogWidth,
    getPreviewDialogHeight,
    getContentStyle,
    shouldUseContentCssCors,
};
