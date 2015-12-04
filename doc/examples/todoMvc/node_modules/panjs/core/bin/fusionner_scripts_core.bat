echo off
call vars.bat

php transform.php starter.prod.js starter.dev.js

call _fusionner_scripts_core.bat dev
call _fusionner_scripts_core.bat prod

robocopy %repPanjs%\core ..\..\doc\examples\todoMvc\node_modules\panjs\core /MIR
robocopy %repPanjs%\ui ..\..\doc\examples\todoMvc\node_modules\panjs\ui /MIR
robocopy %repPanjs% ..\..\..\..\..\nexilearn\front\canopee\lib\panjs\%version% /MIR
robocopy %repPanjs% ..\..\..\..\..\nexilearn\front\canopee-cid\lib\panjs\%version% /MIR

