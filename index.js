Ext.setup({
    glossOnIcon: false,
    onReady: function(options) {
        datetimePicker = new Ext.ux.touch.DateTimePicker({
            useTitles: true,
            id: 'dt',
            value: {
                day: 23,
                month: 2,
                year: 2000,
                hour: 13,
                minute: 45
            },
            listeners: {
                "hide": function(picker) {
                    window.alert((picker.getValue()));
                }
            }
        });

        var panel = new Ext.Panel({
            fullscreen: true,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [{
                xtype: 'button',
                ui: 'normal',
                text: 'Show DateTimePicker',
                handler: function() {
                    datetimePicker.show();
                }
            }]
        });
    }
});
