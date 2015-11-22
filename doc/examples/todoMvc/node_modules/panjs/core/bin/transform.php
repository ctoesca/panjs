<?php

$GLOBALS["input"] = __DIR__."/../".$argv[1];
$GLOBALS["output"] = __DIR__."/../".$argv[2];
echo "input = ".$GLOBALS["input"].PHP_EOL;
echo "output = ".$GLOBALS["output"].PHP_EOL;

function droite($souschaine, $chaine)
{
    $indx = strpos ($chaine, $souschaine);
    $r = "";
    if ($indx !== FALSE )
    {
       $r = substr($chaine, $indx+strlen($souschaine));
       if ($r === FALSE)
        $r = "";
    }
    return $r;
}

function contains($souschaine, $chaine, $caseSensitive = true)
{
    if ( $caseSensitive )
        $r = strpos($chaine, $souschaine) !== FALSE;
    else
        $r = stripos($chaine, $souschaine) !== FALSE;
    return $r;
}


$s = file_get_contents($GLOBALS["input"]);

$lines = explode("\n", $s);
echo count($lines);
$CONFIG_START_ELEMENT = '/*CONFIG_START:manageErrors*/';
$CONFIG_END_ELEMENT = '/*CONFIG_END:manageErrors*/';

if (file_exists($GLOBALS["output"]))
    unlink($GLOBALS["output"]);

$inConfig = false;
for ($i=0; $i<count($lines); $i++){
    $line = $lines[$i];
    $tmp = trim($line);
    $isConfig = false;
    if ( $tmp == $CONFIG_START_ELEMENT)
    {
        $inConfig = true;
        $isConfig = true;
    }
    if ( $tmp == $CONFIG_END_ELEMENT)
    {
        $inConfig = false;
        $isConfig = true;
    }

    if ((!$inConfig)&&(!$isConfig))
    {
        file_put_contents($GLOBALS["output"], $line.PHP_EOL, FILE_APPEND);
    }
}
?>


