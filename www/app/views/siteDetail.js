
			
ToolbarDemo.views.Sitecard = Ext.extend(Ext.Panel, {
	id: 'sitecard',
	fullscreen:true,
	thisSupplierRecord: Ext.emptyFn,
	//layout:'fit',
	//layout :{
	//	type:'vbox',
	//	align:'stretch'
	//},
	listeners:{
		activate:function(){
			console.log('Site detail Activated function'+this.thisSupplierRecord.data.description);//might be wrong listener
			//set the text and pictures for the supplier...
			var ttx=Ext.getCmp('sitecard');
			//ttx.items.items[1].update(this.thisSupplierRecord.stuffName);
			//this.items.items[1].update(this.thisSupplierRecord.data.stuffName);
			Ext.getCmp('texty').update(this.thisSupplierRecord.data.stuffName)
		},
		
	},
	initComponent: function() {
    	
			 var textyUI = new Ext.Panel({
				 defaults: {
						styleHtmlContent: true
					}, // defaults
					ui: 'texty',
					id: 'texty',
					width: '100%',
					height: 100,
					cls: 'textUIcls',
				items:[
				  {
						html:'stuff'
				  }
				  ]
			  });
			
			var carousel=new Ext.Carousel({
				defaults: {
						styleHtmlContent: true
					}, 
				width:'100%',
				height:200,
				items:[
					{
						html:'<img src="http://www.fidestin.com/images/bridge.jpg" width="300" height="200"/>'
					},
					{
						html:'<img src="http://www.fidestin.com/images/church.jpg" width="300" height="200"/>'
					}
				]
			});
			
		    /*var lightUI = new Ext.Carousel({
				defaults: {
					styleHtmlContent: true
				}, // defaults
				ui: 'light',
				width: '100%',
				height: 100,
				items: [
					{
						html: 'red (ui:light)',
						style: 'background-color:#f00;'
					}, {
						html: 'orange (ui:light)',
						style: 'background-color:#ffb600;'
					}
				] // items
			)}; // create() 
			*/
			
			var siteImage = new Ext.Panel({
				//html: '<img src="http://src.sencha.io/http://www.fidestin.com/images/bridge.jpg"/>',
				cls:'painting halp',
				flex:3,
				height:200
			});
			
			
			var backButton=new Ext.Button({
				text:'Back',
				ui:'back',
				id:'backButtonSite',
				handler:this.backButtonTap,
				scope:this
			});
			
			var showMapButton=new Ext.Button({
				text:"Map",
				id:"showMapButton",
				handler:function(){
					//alert('This opens the carousel panel');
					console.log('Open map');
					Ext.dispatch({
						controller: ToolbarDemo.controllers.stuffsController,
						action: 'openMap',
						geoLoc:'53.9,-9.04',		//could this be an array (swap from listView)...?
						suppData:this.ownerCt.ownerCt.thisSupplierRecord,			//button->toolbar->panel.thisSupplierRecord
						
					});
				}
			});
			
			var showPicsButton=new Ext.Button({
				text:"Map",
				handler:function(){
					alert('This opens the map');
				}
			});
		
			var theText=new Ext.Panel({
				flex:4,
				html:this.thisSupplierRecord.stuffName,
				cls:'textInfo',
				 scroll: 'vertical'
				//layout:'fit'			//make sure it fills the entire space
			});
			
			
			
    		this.topToolbar = new Ext.Toolbar({
	            title: 'Site',
	            items: [
					backButton,
	                { xtype: 'spacer'},
					showMapButton
	             ]
	        });
	        
	        this.dockedItems = [this.topToolbar];

    		this.items=[
					carousel,
					textyUI
				];
    		
	        ToolbarDemo.views.Sitecard.superclass.initComponent.apply(this, arguments);       
    	},		//initcomponent
		
		backButtonTap: function () {
			Ext.dispatch({
				controller: ToolbarDemo.controllers.stuffsController,
				action: 'cancelstuff'
			});
		}
});

Ext.reg('sitecard', ToolbarDemo.views.Sitecard);
