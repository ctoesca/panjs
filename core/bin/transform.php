<?php

$GLOBALS["input"] = __DIR__."/../".$argv[1];
$GLOBALS["output"] = __DIR__."/../".$argv[2];
$GLOBALS["env"] =$argv[3];
echo "input = ".$GLOBALS["input"].PHP_EOL;
echo "output = ".$GLOBALS["output"].PHP_EOL;
echo "ENV=".$GLOBALS["env"].PHP_EOL; 

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
function remove($s, $CONFIG_START_ELEMENT, $CONFIG_END_ELEMENT)
{
    $out = "";
    $lines = explode("\n", $s);
    echo count($lines);
   

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
            $out .= $line.PHP_EOL;
        }
    }

    return $out;
}



$s = file_get_contents($GLOBALS["input"]);


if ($GLOBALS["env"] == "prod"){
    $out = remove($s, '/*<ENV:dev>*/', '/*</ENV:dev>*/');
}
if ($GLOBALS["env"] == "dev"){
    $out = remove($s, '/*<ENV:prod>*/', '/*</ENV:prod>*/');
}

if (file_exists($GLOBALS["output"]))
    unlink($GLOBALS["output"]);

file_put_contents($GLOBALS["output"], $out);

?>


