<?php
$servername = "localhost";
$database = "practice";
$username = "root";
$password = "";
header("Content-type: application/json");

$mysqli = new mysqli($servername, $username, $password, $database);
if ($mysqli->connect_error) {
    die('Connect  Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}

$sql = "SELECT * FROM cards";

$query = $mysqli->query($sql);

while($row = mysqli_fetch_assoc($query))
    $arr[] = $row;

$amount = count($arr);

$map = array (
    'хит' => 'hit',
    'акция' => 'special',
    'новинка' => 'news',
);

$filterByType = function ($type) use ($arr) {
    $mock = array_filter($arr, function($obj) use ($type) {
        $marker = $obj['marker'];
        return $marker == $type;
    });

    return $mock;
};

$limit = $_GET['limit'];
$types = $_GET['types'];
$inStock = $_GET['inStock'];

$arr = array_merge(
    $filterByType('новинка'),
    $filterByType('акция'),
    $filterByType('хит'),
    $filterByType('')
);

if ($types) {
    $arrayTypes = explode(',', $types);

    $arr = array_filter($arr, function($obj) use ($arrayTypes, $map) {
        $marker = $obj['marker'];
        return $marker && in_array($map[$marker], $arrayTypes);
    });
}

if ($inStock) {
    $arr = array_filter($arr, function($obj) {
        return $obj['in_stock'] == '1';
    });
}

if ($types || $inStock) {
    $amount = count($arr);
}

$arr = array_slice($arr, 0, $limit);

echo json_encode(
    array( 'amount' => $amount, 'items' => $arr)
);

$mysqli->close;
 ?>