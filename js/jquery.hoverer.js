(function($){

    /**
     *  jQuery プラグイン: オブジェクトが一定の速度で浮き上がるエフェクト
     */
    $.fn.hoverer=function(config){
        
        // デフォルト値
        var defaults = {
          left: 0,   // 位置の初期値
          top: 800,  // 位置の初期値
          speed: 3,  // 1/60 秒 に移動するピクセル数
          callback: function(pthis){ }  // オブジェクトが画面外に移動したときに呼ばれるコールバック
        }

        // デフォルト値を反映させた引数オブジェクト
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
                if( options.callback ) { options.callback(pthis); }
              }
            }

            loop();
        });
    };
})(jQuery);
