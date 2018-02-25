<?php
# @Author: Edward
# @Date:   2017-08-21T12:43:49+08:00
# @Email:  809537981@qq.com
# @Last modified by:   Edward
# @Last modified time: 2017-08-31T13:28:35+08:00



header('Content-type: application/json');
if ($_FILES["file"]["error"] > 0) {
	// var_dump($_FILES)
    // echo "Error: " . $_FILES["file"]["error"] . "<br />";
    $json = [
        "status" => '0',
        "message"=>"上传失败"
    ];
    echo json_encode($json);
} else {
    // echo "Upload: " . $_FILES["file"]["name"] . "<br />";
    // echo "Type: " . $_FILES["file"]["type"] . "<br />";
    // echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
    // echo "Stored in: " . $_FILES["file"]["tmp_name"].'<br />';
    if (file_exists("F:\\www\\upload\\" . $_FILES["file"]["name"])) {

        // echo $_FILES["file"]["name"] . " 文件已经存在。 ";
        $json = [
	        "status"  => "0",
	        "message" => $_FILES["file"]["name"] . " 文件已经存在。 "
	    ];
	    echo json_encode($json);

    } else {

        // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
        move_uploaded_file($_FILES["file"]["tmp_name"], "F:\\www\\upload\\".$_FILES["file"]["name"]);

        $src="/dupload/" . $_FILES["file"]["name"];

        $json = [
        	"src"     => $src,
        	"type"    => $_FILES["file"]["type"],
  		    "size"    => round(($_FILES["file"]["size"] / 1024),2)."kb",
          "status"  => "1",
          "message" => "成功",
          "info" => $_REQUEST
        ];

        // echo "文件存储在: " . "dupload/" . $_FILES["file"]["name"];
        // echo "<img src='$src'; />";
        echo json_encode($json);
    }
}
