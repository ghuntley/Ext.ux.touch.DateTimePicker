Ext.ux.touch.DateTimePicker
================================
This extension provides a DateTimePicker for the Sencha Touch framework by extending Ext.Picker.


Usage
-----
<pre>
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
}).show();
</pre>

Screenshot
----------
![Ext.ux.touch.DateTimePicker](Ext.ux.touch.DateTimePicker/raw/master/screenshot.png)
