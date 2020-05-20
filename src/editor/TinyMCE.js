// 保证获取顶层对象 window(浏览器) || global(Node)
const getGlobal = () => (typeof window !== 'undefined' ? window : global);

/**
 *  Non-Premium Plugins
 */
// 获取全局 tinymce，必须通过 <script> 引入 tinymce
const getTinymce = () => {
    const global = getGlobal();

    return global && global.tinymce ? global.tinymce : null;
};

export { getTinymce };
