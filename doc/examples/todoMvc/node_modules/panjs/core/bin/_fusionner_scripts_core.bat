echo off
call vars.bat

set env=%1%

echo FUSION 1 - tmp1.min.js
set scripts=
set scripts=%scripts% %repPanjs%\core\helpers\base.js
set scripts=%scripts% %repPanjs%\core\helpers\jquery.js
set scripts=%scripts% %repPanjs%\core\starter.%env%.js
set scripts=%scripts% %repPanjs%\core\events\Tevent.js
set scripts=%scripts% %repPanjs%\core\events\TeventDispatcher.js
set scripts=%scripts% %repPanjs%\core\managers\Trouter.js
set scripts=%scripts% %repPanjs%\core\collections\TarrayCollection.js
set scripts=%scripts% %repPanjs%\core\display\TdisplayObject.js
set scripts=%scripts% %repPanjs%\core\display\TdisplayObjectContainer.js
set scripts=%scripts% %repPanjs%\core\display\Telement.js


%pathFusionneur% %scripts% %repPanjs%\core\panjs_core.%env%.js
IF %errorlevel% NEQ 0 GOTO ERROR

echo ***** COMPRESSION - panjs_core.%env%.js ***
echo "%JAVA_HOME%\bin\java"
"%JAVA_HOME%\bin\java" -jar compiler.jar --js %repPanjs%\core\panjs_core.%env%.js --js_output_file %repPanjs%\core\panjs_core.%env%.min.js
IF %errorlevel% NEQ 0 GOTO ERROR


echo FUSION 2:  AJOUT LESS AU DEBUT
%pathFusionneur% %repPanjs%\core\panjs_core.%env%.min.js %pathLess%\less.min.js %repPanjs%\core\panjs_core_with_less.%env%.min.js
IF %errorlevel% NEQ 0 GOTO ERROR

del /Q %repPanjs%\bin\tmp*.js
del /Q %repPanjs%\core\panjs_core.%env%.js



exit /b

:ERROR
echo !!!ERREUR
pause


	