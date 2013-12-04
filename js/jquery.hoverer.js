(function($){

    /**
     *  プラグイン名の指定
     */
    $.fn.hoverer=function(config){
        var defaults = {
          left: 0,
          top: 800,
          speed: 3
        }
        var options = $.extend(defaults, config);

        // 一致した要素上で繰り返す
        return this.each(function(i){

          var pthis = $(this);

            // 初期化処理
            pthis.css('position', 'absolute')
            .css('left', options.left)
            .css('top', options.top);

            var top = parseInt(options.top);

            function loop() {
              top = top - options.speed;

              // 上に持ち上げる
              pthis.css('top', top);

              if(top >= -100){

                setTimeout(function(){
                  loop();
                }, 1000/60);

              }
              else{
                pthis.remove();
              }
            }

            loop();
        });
    };
})(jQuery);
