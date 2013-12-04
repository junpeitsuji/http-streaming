/**
 * HTTP streaming によって push 通信を実現するオブジェクト
 */
var Push = (function($){

    // Constructor
    function Push(url) {
        this.url = url;
    }

    /**
     * 引数のテキストが JSON かどうか 判別する内部関数
     */
    var isJSON = function(arg) {
        arg = (typeof arg === "function") ? arg() : arg;
        if (typeof arg  !== "string") {
            return false;
        }
        try {
            arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * データ更新時に呼ばれるイベントハンドラ
     */
    Push.prototype.onUpdate = function(json){
        console.log('update');
    }

    /**
     * 通信正常終了時に呼ばれるイベントハンドラ
     */
    Push.prototype.onSuccess = function(){
        console.log('success');
    }

    /**
     * 通信を開始するメソッド
     */
    Push.prototype.start = function(){
        var mytimer = null;

        var push = this;

        $.ajax({
            type: 'get',
            url: this.url,
            xhrFields: {
                onloadstart: function() {
                    var xhr = this;
                    //console.log('start');

                    prevId = -1;

                    // データが来るまで待つ
                    mytimer = setInterval(function() {
                    
                        var text  = xhr.responseText;
                        var lines = text.split("\n");

                        // 新しいデータがあれば更新
                        lines.forEach(function(line){

                            if( isJSON(line) ){
                                // 正常な JSON データの時
                                var json = JSON.parse(line);

                                if(json && json.id && json.id > prevId){
                                    prevId = json.id;

                                    if(push.onUpdate){
                                        push.onUpdate(json);
                                    }
                                }                            
                            }

                        });

                    }, 100);                
                }
            },
            success: function() {
                //console.log('finished!');

                if(push.onSuccess){
                    push.onSuccess();
                }         
                
                // 一秒後にタイマー停止
                setTimeout(function(){
                    clearInterval(mytimer);
                }, 1000);
            }
        });

    }

    return Push;

})(jQuery);

