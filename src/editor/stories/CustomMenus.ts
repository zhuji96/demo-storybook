export const menu = (editor: any) => {
    let toggleState = false;
    editor.ui.registry.addMenuItem('basicitem', {
        text: '我的自定义菜单项',
        onAction: function() {
            editor.insertContent("<p>Here's some content inserted from a basic menu!</p>");
        },
    });

    editor.ui.registry.addNestedMenuItem('nesteditem', {
        text: '我的自定义菜单项（内嵌子菜单项）',
        getSubmenuItems: function() {
            return [
                {
                    type: 'menuitem',
                    text: '子菜单项',
                    onAction: function() {
                        editor.insertContent(
                            "<p>Here's some content inserted from a submenu item!</p>",
                        );
                    },
                },
            ];
        },
    });

    editor.ui.registry.addToggleMenuItem('toggleitem', {
        text: '我的自定义的单选菜单项',
        onAction: function() {
            toggleState = !toggleState;
            editor.insertContent(
                '<p class="toggle-item">Here\'s some content inserted from a toggle menu!</p>',
            );
        },
        onSetup: function(api: any) {
            api.setActive(toggleState);
            return function() {};
        },
    });
};
