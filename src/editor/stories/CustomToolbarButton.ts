export const toolbarButton = (editor: any) => {
    editor.ui.registry.addButton('myCustomToolbarButton', {
        text: 'My Custom Button',
        onAction: () => alert('Button clicked!'),
    });
};
