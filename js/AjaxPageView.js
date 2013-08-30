jQuery.AjaxPageView = function (options) {

    jQuery.AjaxPageView.defaults = {
        Link_Class: "callajax",
        View_Area_Id: "view",
        Page_Area_Class: "page",
        Slide_speed: 600
    };

    var opts = $.extend({}, jQuery.AjaxPageView.defaults, options);

    return $(window).load(Execute);

    function Execute() {
        var $view_area = $('#' + opts.View_Area_Id);
        var $base_width = $view_area.width();
        var $base_height = $view_area.height();
        var ajax_indicator_padding;

        var $area_width, $area_height, $this, $page_area, $link_url

        var ajax_indicator = "";
        ajax_indicator = ajax_indicator + "<div id='ajax_indicator' style='position: relative; top: 0; height: 100%; z-index:9998;text-align:center; '>"
        ajax_indicator = ajax_indicator + " <div id='ajax_indicator_back' style='height: 100%; background-color: #000; opacity : 0.3; -ms-filter: alpha(opacity=30); filter: alpha(opacity=30);'></div>";
        ajax_indicator = ajax_indicator + " <div id='ajax_indicator_circle' style='position:absolute; top: 0; text-align:center; width: 100%; z-index:9999;'><img src='/images/etc/loading.gif' alt='LOADING... WAIT PLEASE' title='LOADING... WAIT PLEASE' /></div>";
        ajax_indicator = ajax_indicator + "</div>";

        var loadDivObj = jQuery(ajax_indicator);

        $('.' + opts.Link_Class).click(function (e) {
            e.preventDefault();

            $this = $(this);

            $link_url = $this.attr('href');

            $area_width = $view_area.width();
            $area_height = $view_area.height();

            $page_area = $('.' + opts.Page_Area_Class);

            $view_area.append(loadDivObj);

			ajax_indicator_padding = parseInt( ($(window).height() - $('#header').outerHeight()) / 2 );
            loadDivObj.find('#ajax_indicator_circle').css({ top: ajax_indicator_padding + 'px' });

            loadDivObj.fadeIn(function () {
                setTimeout(function () {
                    $.ajax({
                        type: "GET",
                        url: $link_url,
                        dataType: "html",
                        cache: false,
                        success: function (data) {
                            loadDivObj.fadeOut(function () {
                                $(this).remove();

								var $listNotHasUl = $('#left').find('li').filter(':not(:has(ul))');
								$listNotHasUl.children('a').removeClass('active');

								$this.addClass('active');

                                SlidePage(data);
                            });
                        },
                        error: function (request, status, error) {
                            alert("This content failed to load.");

                            loadDivObj.remove();
                        }
                    });
                }, 200);
            });

            function SlidePage(data) {

                var $clone = $page_area.clone().css({ left: $area_width }).html(data);

                $view_area.append($clone);

                $page_area.find('div').removeAttr('id');

				$view_area.height($(window).height() - $('#header').outerHeight());

                if ($clone.height() > $base_height) {
                    $view_area.height(10+$clone.height());
                    $('#left_back').height($('#contents').height());
                }

                if ($page_area.width() > $base_width) {
                    $page_area.width($base_width);
                }

                $page_area.animate({ left: $base_width * -1 }, opts.Slide_speed, function () {

                });

                $clone.animate({ left: 0 }, opts.Slide_speed, function () {
                    $(this).prev().remove();

					PageMoveRL($view_area, $clone);
                });
            }
        });

        $(window).resize(function () {
			var view_width = $(window).width() - $('#left').outerWidth() - $('.page_move_left').outerWidth();
			$('#view').width(view_width);

            $('.page').css({ left: 0 });

			PageMoveRL($view_area, $('.page'));
        });
    }
};