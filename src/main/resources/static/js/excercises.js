if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

(function ($) {
    $(function () {
        var $wrapper = $(".list-wrapper");
        var $back = $wrapper.find("a.back-link");
        var $lists = $wrapper.find(".list-body-container ul")
        var $links = $lists.find("a.list-link");

        var $listPath = [$lists.filter(".active-list").eq(0)];

        function onBackClick (e) {
            e.preventDefault();
            e.stopPropagation();

            if ($listPath.length < 2) {
                return false;
            }

            var $cl = $listPath.pop();

            $cl.removeClass("active-list");
            $listPath.last().removeClass("parent-list");
            $cl.siblings(".list-link").removeClass("active-link");

            window.setTimeout(function () {
                $cl.addClass("hidden");
            }, 310);
        };

        function onLinkClick (e) {
            e.preventDefault();
            e.stopPropagation();

            var $link = $(this);
            var $list = $($link.attr("href"));

            if (!$list.length) {
                return false;
            }

            $link.addClass("active-link");
            $list.removeClass("hidden");

            window.setTimeout(function () {
                $list.addClass("active-list");
            }, 10);

            $listPath.last().addClass("parent-list");
            $listPath.push($list);
        };

        // click on back button
        $back.on("click", onBackClick);

        // click on list links
        $links.on("click", onLinkClick);
    });
})(jQuery);
