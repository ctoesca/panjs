

CKEDITOR.plugins.add( 'savebtn', {
    icons: 'savebtn',
    init: function( editor ) {
        editor.addCommand( 'savecontent', {

        	exec : function(editor){

                //get the text from ckeditor you want to save
        		var data = editor.getData();
                
                //get the current url
	            var page = document.URL;

                //path to the ajaxloader gif
                loading_icon=CKEDITOR.basePath+'plugins/savebtn/icons/loader.gif';

                //css style for setting the standard save icon. We need this when the request is completed.
                normal_icon=$('.cke_button__savebtn_icon').css('background-image');

                //replace the standard save icon with the ajaxloader icon. We do this with css.
                $('.cke_button__savebtn_icon').css("background-image", "url("+loading_icon+")");

                //Now we are ready to post to the server...
                /*$.ajax({
                    url: editor.config.saveSubmitURL,//the url to post at... configured in config.js
                    type: 'POST', 
                    data: {text: data, id: editor.name, page: page},//editor.name contains the id of the current editable html tag
                })
                .done(function(data, textStatus, req) {
                   //console.log("success");
                    //alert('id: '+editor.name+' \nurl: '+page+' \ntext: '+data);
                    if (editor.config.onSaveSuccess != null)
                        editor.config.onSaveSuccess(data);
                })
                .fail(function(req, settings, exception) {
                    console.log("error save CKEDITOR.plugins.savebtn");
                    if (editor.config.onSaveError != null)
                        editor.config.onSaveError(req, settings, exception);
                })*/
                if (editor.config.onSave != null)
                editor.config.onSave(data);
                    
                $('.cke_button__savebtn_icon').css("background-image", normal_icon);
            

        	} 
    });


//add the save button to the toolbar

        editor.ui.addButton( 'savebtn', {
            label: 'Enregistrer',
            command: 'savecontent'
           // toolbar: 'insert'
        });


    }
});