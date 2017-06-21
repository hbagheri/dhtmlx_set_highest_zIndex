/**
     * @description Set .dhtmlx_window_active of dhtmlx to the maximum z-index of current window +1
     *              in this case the window will shown top of all other sections.
     * @returns {undefined}
     * @author Hans Burgman <info@hbvsoft.com>
     */
    function setIndex(){
         index_highest=0;
         $("div").each(function() {
                    var index_current = parseInt($(this).css("z-index"), 10);
                    if(index_current >= index_highest) {
                        index_highest = index_current+1;
                    }
                });
                style = $(".dhtmlx_window_active").attr("style");
                style = style.replace(/z-index: \d+\;/i,"z-index: "+index_highest+";");
                $(".dhtmlx_window_active").attr("style",style);
        };