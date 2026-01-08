/*
$(document).ready(function () {



    // Enter your ids or classes

    var backdropToggle = '.slide-alarm-backdrop';
    var scroll_obj = $('#site_alarm_menu_tap_wrap');

    // Click events
    $("#slide-alarm,#slide-alarm_mobile").on("click", function (e) {
        alarmSlideNavToggle();
    });


    $("body").on("click", backdropToggle,function (e) {
        alarmSlideNavToggle();
    });
    $("#site_alarm_close").on("click", function (e) {
        alarmSlideNavToggle();
    });

    function alarmSlideNavToggle(){
        if($('body').hasClass('slide-active')){
            $('.slide-alarm-backdrop').remove();
        } else{
            site_alarm.alarm_list_page_more = true;
            site_alarm.alarm_list_page = 1;
            $("#site_alarm_tab").empty();
            site_alarm.getHeaderAlarmList();
            $('#site_alarm_slidemenu').before('<div class="slide-alarm-backdrop"></div>');
        }

        var selected = $('.navbar-main').hasClass('slide-active');

        $('#site_alarm_slidemenu').css({
            transform:selected?'translate3d(0px,0px,0px)':'translate3d(-320px,0px,0px)'
        });


        $(this).toggleClass('slide-active', !selected);
        $('#site_alarm_slidemenu').toggleClass('slide-active');

        $('#page-content, .navbar, body, html, .navbar-header').toggleClass('slide-active');

    }



    var selected = '#site_alarm_slidemenu, #page-content, body, .navbar, .navbar-header';

    //$(window).on("resize", function () {
    //    if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
    //        $(selected).removeClass('slide-active');
    //    }
    //});
    scroll_obj.TrackpadScrollEmulator();
});
*/

/*$(document).ready(function () {



 // Enter your ids or classes

 var backdropToggle = '.slide-alarm-backdrop';
 var menuneg = '-100%';
 var scroll_obj = $('#site_alarm_menu_tap_wrap');
 // Click events
 $("#slide-alarm,#slide-alarm_mobile").on("click", function (e) {
 alarmSlideNavToggle();
 });


 $("body").on("click", backdropToggle,function (e) {
 alarmSlideNavToggle();
 });
 $("#site_alarm_close").on("click", function (e) {
 alarmSlideNavToggle();
 });

 function alarmSlideNavToggle(){
 if($('body').hasClass('slide-active')){
 $('.slide-alarm-backdrop').remove();
 } else{
 site_alarm.alarm_list_page_more = true;
 site_alarm.alarm_list_page = 1;
 $("#site_alarm_tab").empty();
 site_alarm.getHeaderAlarmList();
 $('#site_alarm_slidemenu').before('<div class="slide-alarm-backdrop"></div>');
 }

 var selected = $('.navbar-main').hasClass('slide-active');


 $('#site_alarm_slidemenu').stop().animate({
 right: selected ? menuneg : '0px'
 });



 $(this).toggleClass('slide-active', !selected);
 $('#site_alarm_slidemenu').toggleClass('slide-active');

 $('#page-content, .navbar, body, html, .navbar-header').toggleClass('slide-active');

 }



 var selected = '#site_alarm_slidemenu, #page-content, body, .navbar, .navbar-header';

 //$(window).on("resize", function () {
 //    if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
 //        $(selected).removeClass('slide-active');
 //    }
 //});
 scroll_obj.TrackpadScrollEmulator();
 });*/
