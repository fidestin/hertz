ToolbarDemo = new Ext.Application({
    name: "ToolbarDemo",
    launch: function() {
    	console.log('app.js_launch. ');
		
		if (!ToolbarDemo.views.mainView) {
			console.log('app.js_mainview');
		ToolbarDemo.views.mainView = new ToolbarDemo.views.MainView();
       }
		
		if (!ToolbarDemo.views.stuffView) {
			console.log('app.js_stuffview');
			ToolbarDemo.views.stuffView = new ToolbarDemo.views.StuffView();		
        }
		this.views.viewport = new this.views.Viewport();
    
		//Instead of creating & loading the database each time (2 s) just check does it exist already.
		//If it does not exist - we call startLoad();
		//Do both of these functions.
		if (localStorage.email==undefined){
				this.views.settingscard = this.views.viewport.getComponent('sett');
				ToolbarDemo.views.viewport.setActiveItem(this.views.settingscard);
			}
								
		doesDatabaseExist();		
		//startLoad();
     
        console.log('App.js completed');
    }
});
