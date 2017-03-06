function changeColorTheme(btn,color) {
    removeClassByPrefix(document.body,'theme');
    $('body').addClass('theme-'+color);
}

function changeLayoutTheme(btn,color) {
    removeClassByPrefix(document.body,'layout');
    $('body').addClass('layout-'+color);
}

function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}