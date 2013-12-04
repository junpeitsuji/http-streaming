<?php
// push.php

function output_chunk($chunk)
{
    echo sprintf("%x\r\n", strlen($chunk));
    echo $chunk . "\r\n";
}

header("Content-type: application/octet-stream");
header("Transfer-encoding: chunked");
flush();

$i = 0;
while (true) {
    
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
    flush();

    // 一秒停止
    sleep(1); // 一秒ごとに生成

    $i++;
}
//echo "0\r\n\r\n";