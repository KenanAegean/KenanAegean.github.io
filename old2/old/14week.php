<!doctype html>
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta name="author" content="Kenan EGE">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.css">
    <style type="text/css">
      
    </style>
  </head>
  <body>

    <!-- Custom styles for this template -->
    <link href="css/singin.css" rel="stylesheet">
  </head>

  <body class="text-center">
 
    <form action="" method="POST" class="form-signin">
      <img class="mb-4" src="images/logo.png" alt="" width="200" height="200">
      <h1 class="h1 mb-3 font-weight-normal" >14 WEEKERS</h1>
      <input type="number" id="inputEmail" class="form-control" placeholder="Oxford Grade"   name="ox" step="0.01" autocomplete="off"  > 
      <input type="number" id="inputEmail" class="form-control" placeholder="Speaking Grade"   name="sp" step="0.01" autocomplete="off">
      <input type="number" id="inputEmail" class="form-control" placeholder="Writing Grade"   name="wr" step="0.01" autocomplete="off">
      <input type="number" id="inputEmail" class="form-control" placeholder="Writing 2 Grade"   name="wr2" step="0.01" autocomplete="off">
      <input type="number" id="inputEmail" class="form-control" placeholder="Writing 3 Grade"   name="wr3" step="0.01" autocomplete="off">
      <input type="number" id="inputEmail" class="form-control" placeholder="Writing 4 Grade"   name="wr4" step="0.01" autocomplete="off">
      <input type="number" id="inputEmail" class="form-control" placeholder="Quiz Grade"   name="qui" step="0.01" autocomplete="off">
      <input type="number" id="inputEmail" class="form-control" placeholder="Midterm Grade"   name="mt" step="0.01" autocomplete="off">
      <input type="number" id="inputEmail" class="form-control" placeholder="Pop Grade"   name="pop" step="0.01" autocomplete="off"> <br>
      

     
      <button name="notislemi" class="btn btn-lg btn-outline-info btn-block" type="submit">
<?php  

if (isset($_POST['notislemi'])) {
    
  
  $ox  =  is_numeric($_POST['ox']) ? $_POST['ox'] : 0;
  $sp = is_numeric($_POST['sp']) ? $_POST['sp'] : 0;
  $wr =  is_numeric($_POST['wr']) ? $_POST['wr'] : 0;
  $mt  =   is_numeric($_POST['mt']) ? $_POST['mt'] : 0;
  $pop =   is_numeric($_POST['pop']) ? $_POST['pop'] : 0;
  $qui =   is_numeric($_POST['qui']) ? $_POST['qui'] : 0;
  $wr2 =   is_numeric($_POST['wr2']) ? $_POST['wr2'] : 0;
  $wr3 =   is_numeric($_POST['wr3']) ? $_POST['wr3'] : 0;
  $wr4 =   is_numeric($_POST['wr4']) ? $_POST['wr4'] : 0;


  $a1 = $ox/25 ;
  $a2 = $sp/10 ;
  $a3 = $wr*15/1000 ;
  $a4 = $mt*15/100 ;
  $a5 = $pop*3/5 ; 
  $a7 = $qui/20 ;
  $a8 = $wr2*15/1000 ;
  $a9 = $wr3*15/1000 ;
  $a10 = $wr4*15/1000 ;

  $a6 =  $a1 + $a2 + $a3 + $a4 + $a5 + $a7 + $a8 + $a9 + $a10 ;

  echo $a6 ;

  if ($a6 >= 60 ) {
    echo " - Passed";
  } else {
    echo " - Failed ";

  }


} else {
  echo "Calculate ";
}

?> </button><br>
      <a href="index.php"><button class="btn btn-lg btn-outline-info btn-block" type="button">Back</button></a>
      <p class="mt-5 mb-3 text-muted">&copy; Kenan EGE</p>
    </form>






  
  </body>
</html>
