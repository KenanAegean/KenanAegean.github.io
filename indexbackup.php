<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta name="author" content="Kenan EGE">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.css">
  </head>
  <body>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="js/jqery_3.3.1"></script>
    <script src="ujspopper.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.js" ></script>

<form action="" method="POST">

  Oxford Grade : <input class="form-control" type="number" step="0.01" placeholder="0" name="ox"> <br> <br>
	Speaking Grade : <input type="number" step="0.01" placeholder="0" name="sp"> <br> <br>
	Writing Grade : <input type="number" step="0.01" placeholder="0" name="wr"> <br> <br>
	Midterm Grade : <input type="number" step="0.01" placeholder="0" name="mt"> <br> <br>
	Pop Grade : <input type="number" step="0.01" placeholder="0" name="pop"> <br> <br>

	<button name="notislemi" type="submit" class="bu1">Submit</button>


</form>   
      
      
      
      
      
      
<?php  

if (isset($_POST['notislemi'])) {
    
  
  $ox  =  is_numeric($_POST['ox']) ? $_POST['ox'] : 0;
  $sp = is_numeric($_POST['sp']) ? $_POST['sp'] : 0;
  $wr =  is_numeric($_POST['wr']) ? $_POST['wr'] : 0;
  $mt  =   is_numeric($_POST['mt']) ? $_POST['mt'] : 0;
  $pop =   is_numeric($_POST['pop']) ? $_POST['pop'] : 0;

  $a1 = $ox/20 ;
  $a2 = $sp/10 ;
  $a3 = $wr/20 ;
  $a4 = $mt/5 ;
  $a5 = $pop *3/5 ; 

  $a6 =  $a1 + $a2 + $a3 + $a4 + $a5 ;

  echo "End Of Term Grade: ".$a6 ;

  if ($a6 >= 60 ) {
    echo " - You Passed";
  } else {
    echo " - You Failed ";

  }


} else {
  echo " ";
}

?>




  </body>
</html>