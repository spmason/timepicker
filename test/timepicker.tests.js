/* global define, sinon, $, expect, Event */

define([
    'lib/timepicker/timepicker'
], function(timepicker) {
    'use strict';

    var sandbox,
        startTimeHtml = '<input name="start_time" />',
        endTimeHtml = '<input name="end_time" />',
        normalInput = '<input />',
        $testArea = $('#testArea'),
        $elems,
        $startTime,
        $endTime;

    describe('TimePicker', function() {
        beforeEach(function() {
            $testArea.append(startTimeHtml, endTimeHtml, normalInput);

            sandbox = sinon.sandbox.create();

            $elems = $testArea.find('[name*="time"]');
            $startTime = $testArea.find('[name="start_time"]');
            $endTime = $testArea.find('[name="end_time"]');
        });

        afterEach(function() {
            sandbox.restore();
            $testArea.empty();
            $('[class*="-picker"]').remove();
        });

        describe('when setup', function() {
            var startTime;

            it('can be called with no options', function() {
                startTime = $startTime.timepicker();

                expect(startTime.data('timepicker')).toBeDefined();
            });

            it('can be called with an empty object', function() {
                startTime = $startTime.timepicker({});

                expect(startTime.data('timepicker')).toBeDefined();
            });

            it('throws an error if called with a number', function() {
                var errorMessage = '';
                try {
                    startTime = $startTime.timepicker(2);
                } catch (e) {
                    errorMessage = e.message;
                }
                expect(errorMessage).toEqual('Invalid timepicker call');
            });

            it('destroys the current timepicker attached to the element if it exists', function() {
                $startTime.timepicker();
                $startTime.timepicker();

                $startTime.click();

                expect($('.time-picker').length).toEqual(1);
            });

            it('sets the default class name of the picker to "time-picker"', function() {
                $startTime.timepicker().click();

                expect($('.time-picker').length).toEqual(1);
            });

            it('allows the default class name of the picker to be changed', function() {
                $startTime.timepicker({
                    pickerClassName: 'my-time-picker'
                }).click();

                expect($('.my-time-picker').length).toEqual(1);
            });

            it('appends the timepicker to the body element by default', function() {
                $startTime.timepicker().click();

                expect($('.time-picker').parent().get(0).nodeName).toEqual('BODY');
            });

            it('allows the picker to be appended to another element', function() {
                $testArea.append('<div class="picker-container" />');

                $startTime.timepicker({
                    pickerContainer: '.picker-container'
                }).click();

                expect($('.time-picker').parent().get(0).nodeName).toEqual('DIV');
                expect($('.time-picker').parent().hasClass('picker-container')).toEqual(true);
            });
        });

        describe('when building the picker list', function() {
            var defaultHtml = [
                '<li data-time="--:--">--:--</li>',
                '<li data-time="00:00">00:00</li>',
                '<li data-time="01:00">01:00</li>',
                '<li data-time="02:00">02:00</li>',
                '<li data-time="03:00">03:00</li>',
                '<li data-time="04:00">04:00</li>',
                '<li data-time="05:00">05:00</li>',
                '<li data-time="06:00">06:00</li>',
                '<li data-time="07:00">07:00</li>',
                '<li data-time="08:00">08:00</li>',
                '<li data-time="09:00">09:00</li>',
                '<li data-time="10:00">10:00</li>',
                '<li data-time="11:00">11:00</li>',
                '<li data-time="12:00">12:00</li>',
                '<li data-time="13:00">13:00</li>',
                '<li data-time="14:00">14:00</li>',
                '<li data-time="15:00">15:00</li>',
                '<li data-time="16:00">16:00</li>',
                '<li data-time="17:00">17:00</li>',
                '<li data-time="18:00">18:00</li>',
                '<li data-time="19:00">19:00</li>',
                '<li data-time="20:00">20:00</li>',
                '<li data-time="21:00">21:00</li>',
                '<li data-time="22:00">22:00</li>',
                '<li data-time="23:00">23:00</li>'
            ].join('');

            it('builds the default list of preset times based on 1 hour intervals', function() {
                $startTime.timepicker().click();

                expect($('.time-picker').html()).toEqual(defaultHtml);
            });

            it('builds the preset times based on a custom interval', function() {
                var customPresetHtml = [
                    '<li data-time="--:--">--:--</li>',
                    '<li data-time="00:00">00:00</li>',
                    '<li data-time="06:00">06:00</li>',
                    '<li data-time="12:00">12:00</li>',
                    '<li data-time="18:00">18:00</li>'
                ].join('');
                $startTime.timepicker({
                    interval: '06:00'
                }).click();

                expect($('.time-picker').html()).toEqual(customPresetHtml);
            });

            it('throws an error if the custom interval not a valid time', function() {
                var errorMessage = '';
                try {
                    $startTime.timepicker({
                        interval: '24:00'
                    });
                } catch (e) {
                    errorMessage = e.message;
                }
                expect(errorMessage).toEqual('Invalid interval, must be a valid time');
            });

        });

        describe('when the input field is clicked', function() {
            beforeEach(function() {
                $startTime.timepicker().click();
            });

            it('shows the time picker', function() {
                expect($('.time-picker').is(':visible')).toEqual(true);
            });
        });

        describe('when the input field looses focus', function() {
            beforeEach(function() {
                $startTime.timepicker().click();
            });

            it('should hide the time picker', function() {
                $startTime.blur();

                expect($('.time-picker').is(':visible')).toEqual(false);
            });
        });

        describe('when the input field gains focus', function() {
            beforeEach(function() {
                $startTime.timepicker().focus();
            });

            it('should show the time picker', function() {
                expect($('.time-picker').is(':visible')).toEqual(true);
            });
        });

        describe('when a time is clicked', function() {
            beforeEach(function() {
                $startTime.timepicker().click();

                $('.time-picker').find('[data-time="01:00"]').click();
            });

            it('sets the input field value to the selected time', function() {
                expect($startTime.val()).toEqual('01:00');
            });

            it('hides the time picker', function() {
                expect($('.time-picker').is(':visible')).toEqual(false);
            });

            it('retains focus on the input field', function() {
                expect($startTime.is(':focus')).toEqual(true);
            });
        });

        describe('events', function() {
            beforeEach(function() {
                $startTime.timepicker().click();
            });

            describe('when open.timepicker is triggered', function() {
                beforeEach(function() {
                    $('.time-picker').hide();
                });
                it('shows the time picker', function() {
                    $startTime.data('timepicker').trigger('open.timepicker');

                    expect($('.time-picker').is(':visible')).toEqual(true);
                });
            });

            describe('when close.timepicker is triggered', function() {
                beforeEach(function() {
                    $('.time-picker').show();
                });
                it('hides the time picker', function() {
                    $startTime.data('timepicker').trigger('close.timepicker');

                    expect($('.time-picker').is(':visible')).toEqual(false);
                });
            });

            describe('when select.timepicker is triggered with a preset time', function() {
                it('selects the time and updates the input field', function() {
                    $startTime.data('timepicker').trigger('select.timepicker', '04:00');

                    expect($startTime.val()).toEqual('04:00');
                    expect($('.time-picker').find('.time-picker--selected').length).toEqual(1);
                    expect($('.time-picker').find('.time-picker--selected').data('time')).toEqual('04:00');
                });

                it('unselects the currently selected time', function() {
                    $startTime.data('timepicker').trigger('select.timepicker', '04:00');
                    $startTime.data('timepicker').trigger('select.timepicker', '08:00');

                    expect($('.time-picker').find('.time-picker--selected').length).toEqual(1);
                    expect($('.time-picker').find('.time-picker--selected').data('time')).toEqual('08:00');
                });
            });
        });

        describe('mouse events', function() {
            describe('when a time is already selected', function() {
                beforeEach(function() {
                    $startTime
                        .timepicker()
                        .timepicker('select', '03:00')
                        .timepicker('open');
                });

                describe('on mouseenter', function() {
                    beforeEach(function() {
                        $('.time-picker').trigger('mouseenter');
                    });

                    it('adds the class "isSelecting" to the picker', function() {
                        expect($('.time-picker').hasClass('time-picker--isSelecting')).toEqual(true);
                    });
                });

                describe('on mouseleave', function() {
                    beforeEach(function() {
                        $('.time-picker').trigger('mouseenter');
                        $('.time-picker').trigger('mouseleave');
                    });

                    it('removes the class "isSelecting" from the picker', function() {
                        expect($('.time-picker').hasClass('time-picker--isSelecting')).toEqual(false);
                    });
                });
            });
        });

        describe('keyboard events', function() {
            describe('when onKeyDown is triggered on the input field', function() {
                beforeEach(function() {
                    $startTime
                        .timepicker()
                        .timepicker('select', '09:00')
                        .timepicker('open');
                    $startTime.trigger('keydown');
                });

                it('hides the time picker', function() {
                    expect($('.time-picker').is(':visible')).toEqual(false);
                });

                it('deselects the currently selected time', function() {
                    expect($('.time-picker').find('.time-picker--selected').length).toEqual(0);
                });

                it('opens the time picker if the down arrow is pressed', function() {
                    $startTime.timepicker('close');

                    $startTime.trigger({
                        type: 'keydown',
                        keyCode: 40
                    });

                    expect($('.time-picker').is(':visible')).toEqual(true);
                });
            });
        });

        describe('methods', function() {
            var startTime;

            beforeEach(function() {
                startTime = $startTime.timepicker().click();
            });

            it('only allows valid methods to be called', function() {
                var errorMessage = '';
                try {
                    startTime.timepicker('invalidMethod');
                } catch (e) {
                    errorMessage = e.message;
                }
                expect(errorMessage).toEqual('Invalid timepicker method');
            });

            it('are called for all matching timepickers', function() {
                $endTime.timepicker();

                // open all time pickers
                $(':timepicker').timepicker('open');

                expect($('.time-picker').filter(':visible').length).toEqual(2);

                $(':timepicker').timepicker('select', '03:00');

                expect($('input').filter(function(index) {
                    return $(this).val() === '03:00';
                }).length).toEqual(2);
            });


            describe('$elem.timepicker("destroy")', function() {
                beforeEach(function() {
                    startTime.timepicker('destroy');
                });

                it('removes the picker element', function() {
                    expect($('.time-picker').length).toEqual(0);
                });

                it('does not show the picker element when the input field is clicked', function() {
                    $startTime.click();

                    expect($('.time-picker').length).toEqual(0);
                });

                it('removes the timepicker instance', function() {
                    expect($startTime.data('timepicker')).not.toBeDefined();
                });
            });

            describe('$elem.timepicker("open")', function() {
                beforeEach(function() {
                    startTime.val('09:00');
                    startTime.timepicker('open');
                });

                it('opens the time picker', function() {
                    expect($('.time-picker').is(':visible')).toEqual(true);
                });

                it('checks the associated input field value and selects the time if it is a preset', function() {
                    expect($('.time-picker').find('.time-picker--selected').data('time')).toEqual('09:00');
                });
            });

            describe('$elem.timepicker("close")', function() {
                beforeEach(function() {
                    startTime.timepicker('close');
                });

                it('closes the time picker', function() {
                    expect($('.time-picker').is(':visible')).toEqual(false);
                });
            });

            describe('$elem.timepicker("select", [time])', function() {
                beforeEach(function() {
                    startTime.timepicker('select', '03:00');
                });

                it('selects the time and updates the input field', function() {
                    expect($startTime.val()).toEqual('03:00');
                    expect($('.time-picker').find('.time-picker--selected').length).toEqual(1);
                    expect($('.time-picker').find('.time-picker--selected').data('time')).toEqual('03:00');
                });

                it('unselects the currently selected time', function() {
                    startTime.timepicker('select', '08:00');

                    expect($('.time-picker').find('.time-picker--selected').length).toEqual(1);
                    expect($('.time-picker').find('.time-picker--selected').data('time')).toEqual('08:00');
                });
            });
        });

        describe('when the time picker field looses focus while user is selecting a time', function() {
            var startTime;

            beforeEach(function() {
                startTime = $startTime.timepicker().click();

                $('.time-picker').find('li').first().trigger('mousedown');
            });

            describe('when the user has triggered mousedown on the time picker (e.g. after clicking a list item)', function() {
                it('should keep the time picker open', function() {
                    $startTime.blur();

                    expect($('.time-picker').is(':visible')).toEqual(true);
                });
            });
        });

        describe('when scrolling the time picker to show the current time', function() {
            var params = [{
                timePickerHeight: 90,
                selectedTimeHeight: 30,
                currentTime: '06:00', // index 13
                expectedScrollAdjustment: 360, // difference between current and ideal positions
                interval: '00:30'
            }, {
                timePickerHeight: 90,
                selectedTimeHeight: 30,
                currentTime: '02:00', // index 3
                expectedScrollAdjustment: 60,
                interval: '01:00'
            }, {
                timePickerHeight: 90,
                selectedTimeHeight: 30,
                currentTime: '01:10', // index 8
                expectedScrollAdjustment: 210,
                interval: '00:10'
            }, {
                timePickerHeight: 90,
                selectedTimeHeight: 30,
                currentTime: '06:50', // index 42
                expectedScrollAdjustment: 1230,
                interval: '00:10'
            }];



            params.forEach(function(param) {
                var testDesc = '';

                testDesc += 'time picker height is ' + param.timePickerHeight + ', ';
                testDesc += 'list item height is ' + param.selectedTimeHeight + ', ';
                testDesc += 'and current time is ' + param.currentTime;

                describe('when ' + testDesc, function() {
                    var startTime,
                        timePicker,
                        $picker;

                    beforeEach(function() {
                        startTime = $startTime.timepicker({
                            interval: param.interval
                        });

                        timePicker = startTime.data('timepicker');

                        $picker = timePicker.$picker;

                        $picker.css('position', 'relative'); // for $.position() to work

                        sandbox.spy($picker, 'scrollTop');
                    });

                    it('should scroll the time picker by ' + param.expectedScrollAdjustment + 'px', function() {
                        var $selectedItem;

                        $startTime.timepicker('select', param.currentTime);

                        $selectedItem = $picker.find('.time-picker--selected');
                        sandbox.stub(timePicker, 'findOptionByTime').returns($selectedItem);

                        sandbox.stub($picker, 'outerHeight').returns(param.timePickerHeight);
                        sandbox.stub($selectedItem, 'outerHeight').returns(param.selectedTimeHeight);

                        $startTime.click();

                        expect($picker.scrollTop.args[0][0]).toEqual(param.expectedScrollAdjustment);
                    });
                });
            });
        });

        describe('when a custom time has been selected', function() {
            var params = [{
                customTime: '05:40',
                presetTime: '05:30',
                interval: '00:30'
            }, {
                customTime: '01:35',
                presetTime: '02:00',
                interval: '01:00'
            }, {
                customTime: '01:05',
                presetTime: '01:10',
                interval: '00:10'
            }, {
                customTime: '01:45',
                presetTime: '01:45',
                interval: '00:05'
            }];


            params.forEach(function(param) {
                describe('when the custom time is ' + param.customTime + ' with the interval ' + param.interval, function() {
                    var presetTimeScrollAdjustment,
                        customTimeScrollAdjustment,
                        startTime,
                        timePicker,
                        $picker;

                    beforeEach(function() {
                        startTime = $startTime.timepicker({
                            interval: param.interval
                        }).click();

                        timePicker = startTime.data('timepicker');

                        $picker = timePicker.$picker;

                        $picker.css({
                            'position': 'relative',
                            'height': 90
                        });

                        sandbox.spy($picker, 'scrollTop');
                    });


                    it('should scroll the time picker as if the selected time was ' + param.presetTime, function() {
                        $startTime.val(param.presetTime);
                        $startTime.click();

                        presetTimeScrollAdjustment = $picker.scrollTop.args[0][0];

                        $startTime.blur();
                        $picker.scrollTop.reset();

                        sandbox.spy(timePicker, 'findOptionByTime');

                        $startTime.val(param.customTime);
                        $startTime.click();

                        customTimeScrollAdjustment = $picker.scrollTop.args[0][0];

                        expect(presetTimeScrollAdjustment).toEqual(customTimeScrollAdjustment);
                        expect(timePicker.findOptionByTime.calledWith(param.presetTime)).toEqual(true);
                    });
                });
            });
        });

        describe('as a jquery plugin', function() {
            it('is chainable', function() {
                expect($elems.timepicker()).toEqual($elems);
                expect($elems.timepicker('open')).toEqual($elems);
                expect($elems.timepicker('close')).toEqual($elems);
                expect($elems.timepicker('select')).toEqual($elems);
                expect($elems.timepicker('destroy')).toEqual($elems);
            });

            it('exists as a static method on $', function() {
                expect($.timepicker).toBeDefined();
            });

            it('has default options', function() {
                expect($.timepicker.defaults).toBeDefined();
            });

            it('returns time picker fields using the custom selector :timepicker', function() {
                $elems.timepicker();

                expect($testArea.find(':timepicker').length).toEqual($elems.length);
            });
        });
    });
});
