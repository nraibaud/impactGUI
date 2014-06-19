// todo HTML5 FORM
// todo html5 API
// todo promise
// todo le draw des bg et draw des styles doit etre fait manuellement lors de la methode draw de la class
// todo lobject Background recoi la prop style et non pas lobj style directement.
// todo style hover,focus,checked,selected
// todo bg tile, bg animate
// pos fixed absolute, dans un scroll le fixed ne bouge pas.
// todo mediaquery/layout/grid
// todo css value type function
// todo behavior
// todo css3 transform, animationkeyframe...
// todo history
// todo resize image property for scale , bg too
// todo transofmer les top avec translate
// todo mettre en place scale ds stylessheet
// todo drag area
// todo drag une area unikement
// todo events selectors
// todo options avec 3 shapes puis text et textarea et range
// todo virer size et position pr les bg
// todo refacto styleDraw les styles des bg sinit dans core.js
// todo widget buyins, pub
// todo text should be as json, transformTags in JSON
// todo stage should be new game (like packt book)
// todo can set multiple classes (array)
// todo STYLE can be an element ! and so its inherited useful for TOP
// todo check inherit class or value style
// todo float, inline/block
// todo si hasParent pour affichage (???) Button
// todo Layer, si rien specifier prednre 100%
// todo add layer pour relative
// todo rename prefix text ou namespace
// todo Router, match a part, math all
// todo chanver padding margin par styleParsed
// todo background From
// todo refactor things for optimize code
// todo parentElement should point to GUID and not class instance
//todo tab vert hor
//todo carousel vert hor,et hor
// todo widget autocomplete
// todo widget editnplace,placeholer

ig.module(
        'plugins.gui.gui'
    )
    .requires(
        'plugins.gui.core',
        'plugins.gui.ajax',
        'plugins.gui.storage',
        'plugins.gui.pause',
        'plugins.gui.loader',
        'plugins.gui.router',
        'plugins.gui.controller',
        'plugins.gui.model',
        'plugins.gui.view',
        'plugins.gui.background',
        'plugins.gui.stylesheets',
        'plugins.gui.animation',
        'plugins.gui.canvas',
        'plugins.gui.stage',
        'plugins.gui.layer',
        'plugins.gui.element',
        'plugins.gui.shape',
        'plugins.gui.elements.image',
        'plugins.gui.elements.video',
        'plugins.gui.elements.audio',
        'plugins.gui.elements.text',
        'plugins.gui.widgets.draganddrop',
        'plugins.gui.widgets.scrollbar',
        'plugins.gui.widgets.share',
        'plugins.gui.tools'
    )
    .defines(function () {
        'use strict';

        ig.gui = ig.gui || {};

        ig.gui.debug = false;

    });