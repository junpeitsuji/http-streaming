<?php
// push.php

function output_chunk($chunk)
{
    echo sprintf("%x\r\n", strlen($chunk));
    echo $chunk . "\r\n";
}

/** 
 * Ajaxによるリクエストかどうか 
 * 
 * @return boolean True or False 
 */  
function isAjax()  
{  
    if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){  
        return true;  
    }  
    return false;  
}  


if( isAjax() ){
    // Ajax のアクセスのみ受け付ける

    header("Content-type: application/octet-stream");
    header("Transfer-encoding: chunked");
    ob_flush();
    flush();

    $i = 0;
    while ( !connection_aborted() ) {
        // クライアントからの接続が続いている間繰り返す
        
        // JSON に入れるデータ
        $id        = $i;
        $message   = "hoge".$i;
        $createdAt = date("Y-m-d H:i:s");

        // JSON データを作る
        $json = json_encode( 
            array(
                "id" => $id, 
                "message" => $message, 
                "createdAt" => $createdAt
            ) 
        ); 

        // データを掃き出す
        output_chunk(
            $json . str_repeat(' ', 8000) . "\n"
        );
        ob_flush();
        flush();

        // 一秒停止
        sleep(1); // 一秒ごとに生成

        $i++;
    }
    echo "0\r\n\r\n";    
}
else {
    // Ajax アクセス以外はトップページへ誘導
    header("Location: http://".$_SERVER["SERVER_NAME"]."/");

}
