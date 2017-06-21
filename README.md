Javascript dhtmlx class sometime uses to show a modal window. if there is a z-index section in your page such as a bootstrap navbar div it may pose over dhtmls modal window. In this case you should change z-index of  div with class .dhtmlx_window_active to the higest z-index of the page;
there is 2 chalage to solve the problem
1-finding the maximum of current z-index
2-set .dhtmlx_window_active z-index to max+1
the first chalenge is easy and ok. You can use a $(div).each() to find it.
but z-index of .dhtmlx_window_active div class is not a part of css file so you can not change it directly using $(".dhtmlx_window_active").css("z-index",max+1); it is set as a style attribute of the division. in this js function i have solve this problem.