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
     * 通信異常終了時に呼ばれるイベントハンドラ
     */
    Push.prototype.onError = function(){
        console.log('error');
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
            cache: false,
            xhrFields: {
                onloadstart: function() {
                    var xhr = this;
                    //console.log('start');

                    // 前回取得したデータの文字数
                    var textlength = 0;

                    // データが来るまで待つ
                    mytimer = setInterval(function() {

                        // 受信済みテキストを保存                    
                        var text    = xhr.responseText;

                        // 前回の取得からの差分を取得
                        var newText = text.substring(textlength);
                        
                        // JSONデータを取得
                        var lines   = newText.split("\n");

                        if( text.length > textlength ) {
                            // 長さを更新
                            textlength  = text.length;

                            lines.forEach(function(line){
                                if( isJSON(line) ){
                                    // 正常な JSON データの時
                                    var json = JSON.parse(line);

                                    // 更新
                                    if(push.onUpdate){ push.onUpdate(json); }                            
                                }
                            });
                        } 

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
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //$("#XMLHttpRequest").html("XMLHttpRequest : " + XMLHttpRequest.status);
                //$("#textStatus").html("textStatus : " + textStatus);
                //$("#errorThrown").html("errorThrown : " + errorThrown.message);

                if(push.onError){
                    push.onError();
                }         
                
                // タイマー停止
                clearInterval(mytimer);
            }
        });

    }

    return Push;

})(jQuery);

