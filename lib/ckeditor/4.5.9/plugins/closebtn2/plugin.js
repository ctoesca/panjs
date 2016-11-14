

CKEDITOR.plugins.add( 'closebtn2', {
    icons: 'closebtn',
    init: function( editor ) {
        editor.addCommand( 'close', {

        	exec : function(editor){

                //get the text from ckeditor you want to save
        		var data = editor.getData();
                
                //get the current url
	            var page = document.URL;

                //path to the ajaxloader gif
                loading_icon=CKEDITOR.basePath+'plugins/closebtn2/icons/loader.gif';

                //css style for setting the standard save icon. We need this when the request is completed.
                normal_icon=$('.cke_button__closebtn2_icon').css('background-image');

                //replace the standard save icon with the ajaxloader icon. We do this with css.
                //$('.cke_button__closebtn_icon').css("background-image", "url("+loading_icon+")");
                    
               $('.cke_button__closebtn2_icon').css("background-image", "url("+normal_icon+")" );
              
              
                if (editor.config.onClose != null)
                editor.config.onClose(data);
        	} 
    });


//add the save button to the toolbar

        editor.ui.addButton( 'closebtn', {
            label: 'Fermer',
            command: 'close'
           // toolbar: 'insert'
        });


    }
});