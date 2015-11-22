<?php
//$stdout = shell_exec("lessc test.less");
//echo $stdout;

//java -jar %YUI_DIR%\yuicompressor-2.4.2.jar --type js -o %FILENAME%_mini.js %FILENAME%.js
$GLOBALS["source"] = "D:/nexilearn/production/apache/htdocs/dev/front/commun";
$GLOBALS["dest"] = "D:/nexilearn/production/apache/htdocs/dev/front/commun2";
$GLOBALS["simulation"] = false;
$GLOBALS["resume"] = false;

$GLOBALS["JAVA_HOME"] = 'C:\Program Files\Java\jdk1.7.0_55';
$GLOBALS["compressCommand"] = '"'.$GLOBALS["JAVA_HOME"].'\\bin\\java" -jar %YUI_DIR%\yuicompressor-2.4.2.jar --type {type} -o {dest} {source}';
$GLOBALS["compressCommand"] = '"'.$GLOBALS["JAVA_HOME"].'\\bin\\java" -jar compiler.jar --js {source} --js_output_file {dest}';
$GLOBALS["lessCommand"] = 'lessc --compress --clean-css {source}';


function convertLessToCss($sourceString){
    $cmd = $GLOBALS["lessCommand"];
    $sourceFile = uniqid().".less";
    file_put_contents($sourceFile, $sourceString);

    $cmd = str_replace('{source}', $sourceFile, $cmd);
    $result = shell_exec($cmd);
    unlink($sourceFile);

    return $result;
}
function compressCss($sourceString){
    /*$cmd = $GLOBALS["lessCommand"];
    $sourceFile = uniqid().".less";
    file_put_contents($sourceFile, $sourceString);

    $cmd = str_replace('{source}', $sourceFile, $cmd);
    $result = shell_exec($cmd);
    unlink($sourceFile);

    return $result;*/
}


function compressJs($sourceString){

    $sourceFile = uniqid().".js";
    file_put_contents($sourceFile, $sourceString);

    $destFile = $sourceFile.".min";

    $cmd = $GLOBALS["compressCommand"];
    $cmd = str_replace('{type}', 'js', $cmd);
    $cmd = str_replace('{source}', $sourceFile, $cmd);
    $cmd = str_replace('{dest}', $destFile, $cmd);
    $cmd .= " 2>error.txt";

    unlink("error.txt");
   

    shell_exec($cmd);
   
    $error = file_get_contents('error.txt');

    if (trim($error) != "")
        throw new Exception($error, 1);
        
    $result = file_get_contents($destFile);

    unlink( $sourceFile);
    unlink( $destFile);

    return $result;
}
function droitedroite($souschaine, $chaine)
{
    $indx = strrpos ($chaine, $souschaine);
    $r = "";
    if ($indx !== FALSE )
    {
        $r = substr($chaine, $indx+strlen($souschaine));
        if ($r === FALSE)
            $r = "";
    }
    return $r;
}
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

function isCompressedHtml($path){
    if ($GLOBALS["resume"] == false)
        return false;

    if (!file_exists($path))
        return false;

    $s = file_get_contents($path);
    return ( strrpos($s, '<!--COMPRESSED-->') !== FALSE );
}
function contains($souschaine, $chaine, $caseSensitive = true)
{
    if ( $caseSensitive )
        $r = strpos($chaine, $souschaine) !== FALSE;
    else
        $r = stripos($chaine, $souschaine) !== FALSE;
    return $r;
}
function isCompressedJs($path){
    if ($GLOBALS["resume"] == false)
        return false;

    if (!file_exists($path))
        return false;

    $s = file_get_contents($path);
    return ( strrpos($s, '/*COMPRESSED*/') !== FALSE );
}

function appendCdata($appendToNode, $text)
{
    if (strtolower($appendToNode->nodeName) == 'script') {  // Javascript hack
        $cm = $appendToNode->ownerDocument->createTextNode("\n//");
        $ct = $appendToNode->ownerDocument->createCDATASection("\n" . $text . "\n//");
        $appendToNode->appendChild($cm);
        $appendToNode->appendChild($ct);
    } else {  // Normal CDATA node
        $ct = $appendToNode->ownerDocument->createCDATASection($text);
        $appendToNode->appendChild($ct);
    }
}



$selected = 0;
$total = 0;
$oldSize = 0;
$newSize = 0;

set_error_handler(function($number, $error){
    if (preg_match('/^DOMDocument::loadXML\(\): (.+)$/', $error, $m) === 1) {
        throw new Exception($m[1]);
    }
});

$it = new RecursiveDirectoryIterator($GLOBALS["source"]);
$allowed=array("html");
foreach(new RecursiveIteratorIterator($it) as $file) {
    
    $total ++;
    
    $outputFile = $GLOBALS["dest"]."/".droitedroite($GLOBALS["source"]."\\", $file);
    $filename = droitedroite("\\", $file);

    if(in_array(substr($file, strrpos($file, '.') + 1),$allowed)) 
    {
      
            if ( !isCompressedHtml($outputFile) )
      		{
                $html = file_get_contents($file);
                if (contains("<!--#include virtual=", $html))
                {
                    echo "FICHIER HTML NE SERA PAS COMPRESSE car contient SSI : ".$file.PHP_EOL;
                    file_put_contents($outputFile, $html);
                }else
                {
                    $oldSize += filesize($file);
                    $selected ++;
                    echo $file . "\n";

                    $dom = new DOMDocument;
                    try{
                        $dom->loadXML($html);
                        $styles = $dom->getElementsByTagName('style');
                        foreach ($styles as $style) {
                            if ($style->getAttribute("type") == "text/less")
                            {
                                $style->nodeValue = convertLessToCss($style->nodeValue);
                                $style->setAttribute("type", "text/css");
                            }else{
                                //$style->nodeValue = compressCss($style->nodeValue);
                            }               
                        }
                        $scripts = $dom->getElementsByTagName('script');
                        foreach ($scripts as $script) {
                            //if ( !is_null($script->getAttribute("src")))
                            //{
                               
                                $s = compressJs($script->nodeValue);
                                $script->nodeValue = "";
                                $s = trim($s);
                                if ($s != "")
                                    appendCdata($script, $s);
                                
                            //}                
                        }

                        $html_out = $dom->saveXML($dom->documentElement);
                        if ($GLOBALS["simulation"] === false){   
                            file_put_contents($outputFile, "<!--COMPRESSED-->".PHP_EOL);
                            file_put_contents($outputFile, $html_out, FILE_APPEND);
                        }
                       
                        $newSize += filesize($outputFile);
                    }catch(Exception $err)
                    {
                        echo "Erreur dans fichier ".$file." => ".$err->getMessage()."\n";
                        exit;
                    }  
                }                  
                   			
            }               
    }
}


$it = new RecursiveDirectoryIterator($GLOBALS["source"]);
$allowed=array("js");
foreach(new RecursiveIteratorIterator($it) as $file) {
    if(in_array(substr($file, strrpos($file, '.') + 1),$allowed)) 
    {

        $outputFile = $GLOBALS["dest"]."/".droitedroite($GLOBALS["source"]."\\", $file);

      	if ( !isCompressedJs($file) )
      	{
            try{ 

                $oldSize += filesize($file);
                $js = file_get_contents($file);

                if (contains("<!--#include virtual=", $js))
                {
                    echo "fichier JS NE SERA PAS COMPRESSE: car contient SSI dans : ".$file;
                }else
                {
              		$selected ++;
        	        echo $file . "\n";
                    $s = compressJs(file_get_contents($file));
                }
   
                if ($GLOBALS["simulation"] === false){
                    file_put_contents($outputFile, "/*COMPRESSED*/".PHP_EOL);
                    file_put_contents($outputFile, $s,FILE_APPEND);
                }               
                
                $newSize += filesize($outputFile);
            }catch(Exception $err)
            {
                echo "Erreur dans fichier ".$file." => ".$err->getMessage()."\n";
                exit;
            }

           

      	}
        
    }
}


echo "$selected / $total.\n";
echo "Taille: ".$oldSize." => ".$newSize."\n";

restore_error_handler();
?>


