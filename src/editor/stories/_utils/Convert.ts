import Tools from './Tools';

const html2code = function(s) {
    s = Tools.trim(s);

    const rep = function(re, str) {
        s = s.replace(re, str);
    };

    // example: <strong> to [b]
    rep(/&/gi, '&amp;');
    rep(/"/gi, '&quot;');

    return s;
};

export { html2code };
