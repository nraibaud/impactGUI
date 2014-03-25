ig.module(
        'plugins.gui.elements.form.form'
    )
    .requires(
        'plugins.gui.element'
    )
    .defines(function () {
        'use strict';

        var gui = {
            radios: []
        };

        ig.gui.elements.form = {
            Form: ig.gui.Element.extend({
                type: 'form'
            }),
            keyboard: {
                open: function (label, value, callBack) {
                    if (typeof Ejecta !== 'undefined') {

                    } else if (typeof cocoonJS != 'undefined') {

                    } else {
                        var result = prompt(label, value);
                        return result;

                    }
                }
            }
        };
    });

/*
 http://www.alsacreations.com/tuto/lire/1372-formulaires-html5-nouveaux-types-champs-input.html
 */