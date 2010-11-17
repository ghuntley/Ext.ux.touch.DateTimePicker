Ext.ns('Ext.ux.touch');
Ext.ux.touch.DateTimePicker = Ext.extend(Ext.Picker, {
    /**
     * @cfg {Number} yearFrom
     * The start year for the date picker.  Defaults to 1980
     */
    yearFrom: 1980,

    /**
     * @cfg {Number} yearTo
     * The last year for the date picker.  Defaults to the current year.
     */
    yearTo: new Date().getFullYear(),

    /**
     * @cfg {String} monthText
     * The label to show for the month column. Defaults to 'Month'.
     */
    monthText: 'Month',

    /**
     * @cfg {String} dayText
     * The label to show for the day column. Defaults to 'Day'.
     */
    dayText: 'Day',

    /**
     * @cfg {String} yearText
     * The label to show for the year column. Defaults to 'Year'.
     */
    yearText: 'Year',

    /**
     * @cfg {String} hourText
     * The label to show for the hour column. Defaults to 'Hour'.
     */
    hourText: 'Hour',

    /**
     * @cfg {String} minuteText
     * The label to show for the minute column. Defaults to 'Minute'.
     */
    minuteText: 'Minute',

    /**
     * @cfg {String} daynightText
     * The label to show for the daynight column. Defaults to 'AM/PM'.
     */
    daynightText: 'AM/PM',

    /**
     * @cfg {Object/Date} value
     * Default value for the field and the internal {@link Ext.DatePicker} component. Accepts an object of 'year', 
     * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
     * 
     * Examples:
     * {year: 1989, day: 1, month: 5} = 1st May 1989. 
     * new Date() = current date
     */

    /**
     * @cfg {Array} slotOrder
     * An array of strings that specifies the order of the slots. Defaults to <tt>['month', 'day', 'year']</tt>.
     */
    slotOrder: ['month', 'day', 'year', 'hour', 'minute', 'daynight'],

    initComponent: function() {
        var yearsFrom = this.yearFrom,
            yearsTo = this.yearTo,
            years = [],
            days = [],
            months = [],
            hours = [],
            minutes = [],
            daynight = [],
            ln, tmp, i, daysInMonth;

        // swap values if user mixes them up.
        if (yearsFrom > yearsTo) {
            tmp = yearsFrom;
            yearsFrom = yearsTo;
            yearsTo = tmp;
        }

        for (i = yearsFrom; i <= yearsTo; i++) {
            years.push({
                text: i,
                value: i
            });
        }

        daysInMonth = this.getDaysInMonth(1, new Date().getFullYear());
        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }

        for (i = 0, ln = Date.monthNames.length; i < ln; i++) {
            months.push({
                text: Date.monthNames[i],
                value: i + 1
            });
        }

        for (i = 1; i <= 12; i++) {
            hours.push({
                text: i,
                value: i
            });
        }

        for (i = 0; i <= 60; i += 15) {
            minutes.push({
                text: i,
                value: i
            });
        }

        daynight.push({
            text: 'AM',
            value: 'AM'
        }, {
            text: 'PM',
            value: 'PM'
        });

        this.slots = [];
        Ext.each(this.slotOrder, function(item) {
            this.slots.push(this.createSlot(item, days, months, years, hours, minutes, daynight));
        }, this);

        // We need to check if the value is a Date or an object
        // TODO add support for a string?
        if (this.value) {
            var value = this.value;

            if (Ext.isDate(value)) {
                this.value = {
                    day: value.getDay(),
                    year: value.getFullYear(),
                    month: value.getMonth() + 1
                };
            } else if (Ext.isObject(value)) {
                this.value = value;
            };
        }
        Ext.ux.touch.DateTimePicker.superclass.initComponent.call(this);
    },

    createSlot: function(name, days, months, years, hours, minutes, daynight) {
        switch (name) {
        case 'year':
            return {
                name: 'year',
                align: 'center',
                data: years,
                title: this.useTitles ? this.yearText : false,
                flex: 3
            };
        case 'month':
            return {
                name: name,
                align: 'right',
                data: months,
                title: this.useTitles ? this.monthText : false,
                flex: 4
            };
        case 'day':
            return {
                name: 'day',
                align: 'center',
                data: days,
                title: this.useTitles ? this.dayText : false,
                flex: 2
            };
        case 'hour':
            return {
                name: 'hour',
                align: 'center',
                data: hours,
                title: this.useTitles ? this.hourText : false,
                flex: 2
            };
        case 'minute':
            return {
                name: 'minute',
                align: 'center',
                data: minutes,
                title: this.useTitles ? this.minuteText : false,
                flex: 2
            };
        case 'daynight':
            return {
                name: 'daynight',
                align: 'center',
                data: daynight,
                title: this.useTitles ? this.daynightText : false,
                flex: 2
            };
        }
    },

    // @private
    onSlotPick: function(slot, value) {
        var name = slot.name,
            date, daysInMonth, daySlot;

        if (name === "month" || name === "year") {
            daySlot = this.child('[name=day]');
            date = this.getValue();
            daysInMonth = this.getDaysInMonth(date.getMonth() + 1, date.getFullYear());
            daySlot.store.clearFilter();
            daySlot.store.filter({
                fn: function(r) {
                    return r.get('extra') === true || r.get('value') <= daysInMonth;
                }
            });
            daySlot.scroller.updateBoundary(true);
        }

        Ext.DatePicker.superclass.onSlotPick.call(this, slot, value);
    },

    /**
     * Gets the current value as a Date object
     * @return {Date} value
     */
    getValue: function() {
        var value = Ext.DatePicker.superclass.getValue.call(this),
            daysInMonth = this.getDaysInMonth(value.month, value.year),
            day = Math.min(value.day, daysInMonth);
        if (value.daynight === 'PM') {
            value.hour += 12;
        }
        return new Date(value.year, value.month - 1, day, value.hour, value.minute);
    },

    // @private
    getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month - 1];
    },

    // @private
    isLeapYear: function(year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    setValue: function(values, animated) {
        var key, slot, items = this.items.items,
            ln = items.length;

        // Value is an object with keys mapping to slot names
        if (!values) {
            for (var i = 0; i < ln; i++) {
                items[i].setValue(0);
            }
            return this;
        }
        daynightVal = 'AM';
        for (key in values) {
            slot = this.child('[name=' + key + ']');
            if (slot) {
                if (key === 'hour' && values[key] > 12) {
                    daynightVal = 'PM';
                    values[key] -= 12;
                }
                slot.setValue(values[key], animated);
            }
        }
        slot = this.child('[name=daynight]');
        slot.setValue(daynightVal, animated);
        return this;
    }
});

Ext.reg('datetimepicker', Ext.ux.touch.DateTimePicker);
