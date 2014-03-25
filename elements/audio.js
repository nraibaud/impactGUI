// todo extend ig sound and ig music
// work in progress

ig.module(
        'plugins.gui.elements.audio'
    )
    .requires(
        'plugins.gui.element'
    )
    .defines(function () {
        'use strict';



        ig.gui.elements.Audio = ig.gui.Element.extend({
            type: 'audio'
        });

    });