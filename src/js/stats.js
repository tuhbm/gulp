function useDatepicker(obj){
    obj.datepicker({
        showOn: "both",
        dateFormat:'yy-mm-dd',
        buttonText: '<span class="ico_admin icon-ico-calender">달력</span>'
    });
}
$(document).ready(function(){
    useDatepicker($('#scheduleStartDate'));
    useDatepicker($('#scheduleEndDate'));
});