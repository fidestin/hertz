//This can only be called as a result of a callback once the store is full.
//It then calculates the distances and (when all are resuls) - fires its own callback (inside updatePlanner)
//that refreshes the List with the newly calculated distances
//version 1.1;
var markerPositions=[];			//Use this array to hold the markers for the map...
var markers=[];
var userLocation;
var userMarker;
var userLocationX;
var userLocationY;
var bounds;
var randWind;
var randMarker;
var mimarkers=[];
var googleMapMarkers=[];
var myMask;		//used for loading...
google.maps.InfoWindow.prototype.opened=false;
var centralDublin=new google.maps.LatLng(53.3497,-6.257);
			

function isArray(obj) {
    // http://stackoverflow.com/a/1058753/1252748
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function removeEmptyArrayElements(arr) { 
   if (!isArray(arr)) {
      return arr;
   } else {
       return arr.filter( function(elem) { return elem !== null } ).map(
         removeEmptyArrayElements)
   }
}

//required to return neatly from siteCard
function backToViewList(){
	if (ToolbarDemo.views.stuffView){
    		ToolbarDemo.views.stuffView.setActiveItem(
    	            ToolbarDemo.views.stuffsListView,			//stuffView is a panel, has an ActiveItem
    	            { type: 'slide', direction: 'right' }
    	        );
    	}
}

function backToViewMap(){
	if (ToolbarDemo.views.stuffView){
    		ToolbarDemo.views.stuffView.setActiveItem(
    	            ToolbarDemo.views.mapView,			//stuffView is a panel, has an ActiveItem
    	            { type: 'slide', direction: 'right' }
    	        );
    	}
}



function setMarkers(map, markers,infoWindowPopMode) {
 console.log('Adding special map markers');
 for (var i = 0; i < markers.length; i++) {
  
  var sites = markers[i];
  var imageLoc="";
  var category=sites[3];
  switch(parseInt(category)){
   case 0:
    imageLoc='images/marker.png';
    break;
   case 1:
    imageLoc='images/carrental.png';
    break;
   case 225:
    imageLoc='images/bar.png';
    break;
   case 214:
    imageLoc='images/hotel_1.png';
    break;
   case 4:
    imageLoc='images/restaurant_3.png';
    break;
   case 247:
    imageLoc='images/tower.png';
	break;
   default:
    imageLoc='images/restaurant_3.png';
  }
  
  var siteLatLng = new google.maps.LatLng(sites[1], sites[2]);
  var marker = new google.maps.Marker({
                                      position: siteLatLng,
                                      map: map,
                                      icon: (imageLoc),
                                      title: sites[0],
                                      html: sites[0],
                                      category:sites[3],
									  stuffID:sites[4],
									  locationImage:sites[5],
									  address:sites[6],
									  freeText:sites[7]
                                      });
	addInfoWindow(marker,infoWindowPopMode);
	googleMapMarkers.push(marker);
 }
}

//Also going to have to tell the controller to turn off the additional map button when it loads this form
function loadMapDetail(detailStuffID){
	 Ext.dispatch({
            controller: ToolbarDemo.controllers.stuffsController,
            action: 'editstuff',
            stuffID: detailStuffID,      //anything added at this line (or after) just gets dropped into [options] object
            					//the controller has access to it then, as options.stuff, options.stuff etc etc
			bmca:'989',			//Just adding this to test the controller...
			calledFrom:ToolbarDemo.views.mapView
        });
}

function addInfoWindow(marker,infoWindowPopMode){
 try{
	 var infowindow;
	 //var destailString=marker.description;
	 if (infoWindowPopMode==true){
			infowindow=new google.maps.InfoWindow({
						//		  content:'<div id="content"><a href="#" onclick="loadMapDetail('+marker.stuffID+');">'+marker.title+'</a></div>'
						 content:'<div><div style="float:left;">' +
                    '<span style="font-size:18px;font-weight:bold;"><a href="#" onclick="loadMapDetail('+marker.stuffID+');">'+marker.title+'</a></span><hr>' +
                    '<span>' + marker.freeText + '<span>' + 
                    '</div><div style="float:right; padding:5px;"><img src="GeoData/thumbnails/' + marker.locationImage + '">' +
                    '</img></div></div>',
					maxWidth:200
			 });
		}
	 else
		 {
		infowindow=new google.maps.InfoWindow({
								  content:'<div><div style="float:left;">' +
                    '<span style="font-size:18px;font-weight:bold;">'+marker.title+'</span><hr>' +
                    '<span>' + marker.freeText + '<span>' + 
                    '</div><div style="float:right; padding:5px;"><img src="GeoData/thumbnails/' + marker.locationImage + '">' +
                    '</img></div></div>',
					maxWidth:200
			 });
		 }
	 google.maps.event.addListener(marker,'mousedown',function(){
	 console.log('MouseDown Worked...mousedown event in marker fired');
								   infowindow.open(mimap,marker);
								   });
	google.maps.event.addListener(marker, "click", function () {
	console.log('MouseDown Worked...mousedown event in marker fired');
								   infowindow.open(mimap,marker);
									});				
 }
 catch(b){
  console.log('Error in addInfoWindow'+b);
 }
}

//Iterate thru the markers collection and set their map property to NULL
//Call it using ClearMap(googleMapMarkers)
function ClearMap(markerList){
	if (markerList){
		for (var i=0;i<markerList.length;i++){
			markerList[i].setMap(null);
			markerList[i] = null;						//removes them from the display but must also remove from googleMapMarkers array
		}
		
		mimarkers.length=0;
		markerList.length=0;
		googleMapMarkers=removeEmptyArrayElements(googleMapMarkers);		//removes any elements that are now null
		
    //Also remove userLocation
	}
}

//Call it using ClearMap(googleMapMarkers,225)
function ClearMapCategory(markerList,category){
	if (markerList){
		for (var i=0;i<markerList.length;i++){
			if (markerList[i].category==category){
				markerList[i].setMap(null);
				markerList[i] = null;
				mimarkers[i]=null;
			}
		}
	}
	googleMapMarkers=removeEmptyArrayElements(googleMapMarkers);		//removes any elements that are now null
}


function CallMapDisplay(){
	console.log('Calling topFunc - now there are ' + ToolbarDemo.stores.stuffsStore.data.items.length);
	topFunc();
}
//These are the CRUDS for the Stuff controller....
Ext.regController('StuffsController', {

	'loadmappedstuffs':function(options){
		ToolbarDemo.views.stuffView.setActiveItem(
					ToolbarDemo.views.stuffsListView,
					{ type: 'slide', direction: 'left' }
				);
	},
	
    'editstuffs': function (options) {						//loads the stuffslist - should filter this

		  var categoryTitle=options.category.data.catdescription;
		  var pointsc=Ext.getCmp('listStuffs');
		  if (localStorage.userPosition!=null){
			myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading " +vrecord.data.catdescription});
			myMask.show();
          }
			console.log('StuffsController.js_editstuffs');
		if (ToolbarDemo.views.stuffView){
				
			mapValuesReturned=0;
			mapListDisplayed=false;
			
			var tb=Ext.getCmp('listStuffs');		//grab the view
			tb.dockedItems.items[0].setTitle(categoryTitle);
			
			//based on categoryID passed in via options.
			thirdload(options.category.data.categoryID,function(){
					topFunc();		//Store now loaded, callback -> gets the map distances and saves it to the store       
					}
			);		
			
			console.log('StuffsController_editStuffs_data store loaded with ' + ToolbarDemo.stores.stuffsStore.data.items.length);
					
			//This fires the activate event (only now), so this should set the loading mask to false...
			ToolbarDemo.views.stuffView.setActiveItem(
					ToolbarDemo.views.stuffsListView,{ type: 'slide', direction: 'left' }
			);
					   
		}
	},
	
	
	'cancelstuffs':function(options){							//reload the category view....
		console.log('StuffsController.js_cancelstuffs=>exit the stuffsList and return to category');
		if (ToolbarDemo.views.stuffView){
			ToolbarDemo.views.stuffView.setActiveItem(			//want to set this item active	
				ToolbarDemo.views.categoryView,					//this view active within the stuffView panel...
				  { type: 'slide', direction: 'right' }
			);
		}
	},
	
	
	
	
   //this will display the Stuff	- replace with the AboutCard to test
    'editstuff': function (options) {
		console.log('StuffsController.js_editstuff');
		//ToolbarDemo.views.Aboutcard.load(options.stuff);			//cant call load on this class...Panel
        //ToolbarDemo.views.stuffEditorView.load(options.stuff);		//Form_Panel has load method		
						//load on Form Panel...seems to 'bind' the single stuff object 											
						//to the details view. Loading a single object into a FieldSet
		var stuffID=options.stuffID		//idenfity the supplier
		var supplierIndex=getStoreIndex(stuffID);
		ToolbarDemo.views.siteView.thisSupplierRecord=ToolbarDemo.stores.stuffsStore.getAt(supplierIndex);
		
		//ToolbarDemo.views.siteView.thisSupplierRecord=options.stuff.data;		//push record detail to view...smaller portion of data
		//Change the Toolbar title based on supplier (could this also be done in the Panel Listener event?)
		var tb=Ext.getCmp('sitecard');
		tb.dockedItems.items[0].setTitle(ToolbarDemo.views.siteView.thisSupplierRecord.data.description);
		
		//Set the return action
		
		if (options.calledFrom==ToolbarDemo.views.stuffsListView)
		{
			Ext.getCmp('backButtonSite').handler=backToViewList;
				Ext.getCmp('showMapButton').setVisible(true);
		}
		else
		{
			Ext.getCmp('backButtonSite').handler=backToViewMap;
			Ext.getCmp('showMapButton').setVisible(false);
		}
		
		
        ToolbarDemo.views.stuffView.setActiveItem(
            ToolbarDemo.views.siteView,			//the object, not the class
            { type: 'slide', direction: 'left' }
        );
    },

	'cancelstuff': function(options){							//cancels the detail, returns to list...
			console.log('Do cancel stuff');
			console.log('StuffsController.js_cancelstuff');
    	if (ToolbarDemo.views.stuffView){
    		ToolbarDemo.views.stuffView.setActiveItem(
    	            ToolbarDemo.views.stuffsListView,			//stuffView is a panel, has an ActiveItem
    	            { type: 'slide', direction: 'right' }
    	        );
    	}
	},
	
	'cancelstuffList': function(options){							//cancels the detail, returns to list...
			console.log('Do cancel stuff');
			console.log('StuffsController.js_cancelstuff_And clear the map.');
			ClearMap();				//Clear map when returning to the list view...
    	if (ToolbarDemo.views.stuffView){
    		ToolbarDemo.views.stuffView.setActiveItem(
    	            ToolbarDemo.views.stuffsListView,{ type: 'slide', direction: 'right' });
    	}
	},
	
    //this will redeem the stuff
    'deletestuff': function (options) {

        var currentstuff = ToolbarDemo.views.stuffEditorView.getRecord();

        if (ToolbarDemo.stores.stuffsStore.findRecord('id', currentstuff.data.id)) {
            ToolbarDemo.stores.stuffsStore.remove(currentstuff);
        }

        ToolbarDemo.stores.stuffsStore.sync();
        //Going to have to call webservice here to update a flag on the stuff to say its redeemed.
        //ToolbarDemo.views.stuffsListView.refreshList();
        console.log('Returning to main page...');
        ToolbarDemo.views.mainView.setActiveItem(
            ToolbarDemo.views.stuffsListView,
            { type: 'slide', direction: 'right' }
        );
        console.log('Returned to main page...');
    },
	
	'openListNearby': function(options){
		ClearMap(googleMapMarkers);
		console.log('StuffsController.js_openListNearby');
		
		if (ToolbarDemo.views.stuffView){
		
				//Required for refreshing map distance calls
				mapValuesReturned=0;
				mapListDisplayed=false;
				
				if (localStorage.userPosition!=null){
					myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Searching nearby..."});
					myMask.show();
				}
		  
				mimap=Ext.getCmp('map1').items.items[0].map;	//grab the map object...
				bounds = new google.maps.LatLngBounds();
				
				//Turn this into a func() userPosX() returns value directly
				var userPos=JSON.parse(localStorage.getItem('userPosition'));
				var userPosX=userPos[Object.keys(userPos)[0]];
				var userPosY=userPos[Object.keys(userPos)[1]];
				console.log('Parsed user position ' + userPosX + ',' + userPosY);
				var userLocation=new google.maps.LatLng(userPosX,userPosY);
				var miUser=['Your current location',userPosX,userPosY,0];
				mimarkers.push(miUser);
				
				bounds.extend(userLocation);
				
				var arrNearLocationIDs=GetDerivedPoints(getUserLocation(),100);
				
				//based on categoryID passed in via options.
				loadNearby(arrNearLocationIDs,function(){
						topFunc();		//Store now loaded, callback -> gets the map distances and saves it to the store       
						}
				);	

				console.log('StuffsController_editStuffs_data store loaded with ' + ToolbarDemo.stores.stuffsStore.data.items.length);
					
				var categoryTitle=options.category.data.catdescription;
				var tb=Ext.getCmp('listStuffs');		//grab the view
				tb.dockedItems.items[0].setTitle(categoryTitle);
				
				
				//This fires the activate event (only now), so this should set the loading mask to false...
				ToolbarDemo.views.stuffView.setActiveItem(
						ToolbarDemo.views.stuffsListView,{ type: 'slide', direction: 'left' }
				);
							
				
		
		}
	},
	
	'openMapList': function(options){
		ClearMap(googleMapMarkers);
		console.log('StuffsController.js_openMapList');
		
		if (ToolbarDemo.views.stuffView){
		
			//get the toolbar component - Allows us update the ToolBar easily...
			var vmap=Ext.getCmp('mapcard');
			var vlist=Ext.getCmp('listStuffs');
			
			//Toggle the buttons...
			if (options.action=="openMap"){
					var mapBackButton=Ext.getCmp('mapBackButton');
					mapBackButton.setVisible(true);
					var mapListButton=Ext.getCmp('mapListButton');
					mapListButton.setVisible(true);
					mapListButton.setText('Detail');
					mapListButton.handler=mapDetailClose;
					var directionsButton=Ext.getCmp('directionsButton');
					directionsButton.setVisible(true);
					vmap.dockedItems.items[0].setTitle(vlist.dockedItems.items[0].title);		//set the CategoryTitle..
				}
			else if (options.action=="openMapList"){
				var mapBackButton=Ext.getCmp('mapBackButton');
				mapBackButton.setVisible(true);
				var mapListButton=Ext.getCmp('mapListButton');
				mapListButton.setVisible(false);
				var directionsButton=Ext.getCmp('directionsButton');
				directionsButton.setVisible(false);
				mapListButton.setText('List');
				mapListButton.handler=mapListClose;
				vmap.dockedItems.items[0].setTitle(vlist.dockedItems.items[0].title);		//set the CategoryTitle..
			}
			
			vmap.listMap=true;
			
			mimap=Ext.getCmp('map1').items.items[0].map;	//grab the map object...
			
			
			//get the suppliers data collection
			//var suppliers=new Ext.util.MixedCollection();
			//suppliers.addAll(ToolbarDemo.stores.stuffsStore.data);				//add all the items in the collection
			var suppliers=ToolbarDemo.stores.stuffsStore.data;
			
			markers.length=0;				//init the marker array
			markerPositions.length=0;		//ensure the position array is empty to begin with..
			
			//Create an array of positions
			for (var i=0;i<suppliers.length;i++){
				if (options.action=="openMap"){
					markerPositions[i]=new google.maps.LatLng(suppliers.items[i].data.latX,suppliers.items[i].data.latY);
				}
				if (options.action=="openMapList"){
					var thisSupplier=suppliers.items[i].data;
					arSupplier=[thisSupplier.description,thisSupplier.latX,thisSupplier.latY,thisSupplier.categoryID,thisSupplier.stuffID,thisSupplier.locationImage,thisSupplier.address, thisSupplier.stuffName];
					//markerPositions[i]=new google.maps.LatLng(suppliers[i].data.latX,suppliers[i].data.latY);
					markerPositions[i]=new google.maps.LatLng(thisSupplier.latX,thisSupplier.latY);
					mimarkers.push(arSupplier);
				}
			}
			
				bounds=new google.maps.LatLngBounds();
		  
				//Create array of markers from arroy of positions
				for (var n=0;n<markerPositions.length;n++){
					bounds.extend(markerPositions[n]);
				}
			
				var userPos=JSON.parse(localStorage.getItem('userPosition'));
				var userPosX=userPos[Object.keys(userPos)[0]];
				var userPosY=userPos[Object.keys(userPos)[1]];
				console.log('Parsed user position ' + userPosX + ',' + userPosY);
				var userLocation=new google.maps.LatLng(userPosX,userPosY);
				  
                  var miUser=['Your current location',userPosX,userPosY,0,0,0,0,'You are here'];
                  mimarkers.push(miUser);
           
				
                  bounds.extend(userLocation);  //for userLocation POSITION
                  console.log('Try and set the bounds here...');
                  //mimap.fitBounds(bounds);
                  
				  //infoWindowPopMode = true => allow popups
                  setMarkers(mimap,mimarkers,true);
                  infowindow=new google.maps.InfoWindow({
                                                        content:"loading..."
                  })
                
			//Can we just add this once at the start of the app - rather than in several places?
			google.maps.event.addDomListener(mimap,'center_changed',function(){
					console.log('Firing resize');
					google.maps.event.trigger(mimap,"resize");	//ensures it displays correctly after pan
			});
				
			ToolbarDemo.views.stuffView.setActiveItem(ToolbarDemo.views.mapView,{ type: 'slide', direction: 'left' });
			
			google.maps.event.trigger(mimap,"resize");		//ensures it displays correctly on opening	
			//mimap.setCenter(centralDublin);             //No need to do this now with the bounds added
			
			//mimap.setCenter(userLocation);
			//mimap.setZoom(9);
			mimap.setCenter(bounds.getCenter());
			mimap.fitBounds(bounds);
			
			google.maps.event.addListener(mimap, 'zoom_changed', function(){
					console.log('Zoome ended');
					//vmap.dockedItems.items[0].setTitle('Loading...');
			});
			google.maps.event.addListener(mimap, 'idle', function(){
					console.log('All quiet now');
					//vmap.dockedItems.items[0].setTitle('Loaded!');
			});
		}
	},
	
	'openMap': function(options){							//cancels the detail, returns to list...
		console.log('StuffsController.js_openMap');
		ClearMap(googleMapMarkers);
		
    	if (ToolbarDemo.views.stuffView){
			bounds = new google.maps.LatLngBounds();
			//get the toolbar component - Allows us update the ToolBar easily...
			var vmap=Ext.getCmp('mapcard');
			var vlist=Ext.getCmp('listStuffs');
			var mapListButton=Ext.getCmp('mapListButton');
			
			if (options.action=="openMap"){
				var mapBackButton=Ext.getCmp('mapBackButton');
				mapBackButton.setVisible(true);
				var mapListButton=Ext.getCmp('mapListButton');
				mapListButton.setVisible(false);
				mapListButton.setText('Detail');
				mapListButton.handler=mapDetailClose;
        var directionsButton=Ext.getCmp('directionsButton');
        directionsButton.setVisible(true);
				vmap.dockedItems.items[0].setTitle(vlist.dockedItems.items[0].title);		//set the CategoryTitle..
			}
			else if (options.action=="openMapList"){
				var mapBackButton=Ext.getCmp('mapBackButton');
				mapBackButton.setVisible(false);
				var mapListButton=Ext.getCmp('mapListButton');
				mapListButton.setVisible(true);
        var directionsButton=Ext.getCmp('directionsButton');
        directionsButton.setVisible(false);
				mapListButton.setText('List');
				mapListButton.handler=mapListClose;
				vmap.dockedItems.items[0].setTitle(vlist.dockedItems.items[0].title);		//set the CategoryTitle..
			}
			
      vmap.listMap=false;
			//Set the Close button
			
			
                  try{
			
			mimap=Ext.getCmp('map1').items.items[0].map;	//grab the map object...
			
			var supplier=ToolbarDemo.views.siteView.thisSupplierRecord;		//one way of getting the supplier
			
			//*******  Use the new Array method  *********
			//Create a new mixed collection and a stuff object and add it to the collection...
			var currentsupplier=options.suppData;	//this array will contain only one supplier (we could add the user position and specify a special icon)
			
			var currentSupplierID=options.suppData.data.stuffID;
			var currentSupplierIndex=getStoreIndex(currentSupplierID);
			
			//var suppliers=[];	
			var suppliers=new Ext.util.MixedCollection();
			suppliers.add(ToolbarDemo.stores.stuffsStore.getAt(currentSupplierIndex));
			
			mimarkers.length=0;
			markers.length=0;				//init the marker array
			markerPositions.length=0;		//ensure the position array is empty to begin with..
			
      
      
			
                  var arSupplier=[];
                  //arSupplier.length=0;
                  for (var i=0;i<suppliers.length;i++){
                    var thisSupplier=suppliers.items[i].data;
                    arSupplier=[thisSupplier.description,thisSupplier.latX,thisSupplier.latY,thisSupplier.categoryID, thisSupplier.stuffID,thisSupplier.locationImage,thisSupplier.address,thisSupplier.stuffName];
                    markerPositions[i]=new google.maps.LatLng(thisSupplier.latX,thisSupplier.latY);
                    mimarkers.push(arSupplier);
                  }
                  
			//Create array of markers from array of positions
			for (var n=0;n<markerPositions.length;n++){
			       bounds.extend(markerPositions[n]);
			}
		
				vmap.dockedItems.items[0].setTitle(arSupplier[0]);		//set the CategoryTitle..
    
                 var userPos=JSON.parse(localStorage.getItem('userPosition'));
				var userPosX=userPos[Object.keys(userPos)[0]];
				var userPosY=userPos[Object.keys(userPos)[1]];
				console.log('Parsed user position ' + userPosX + ',' + userPosY);
				var userLocation=new google.maps.LatLng(userPosX,userPosY);
                  
                  var miUser=['Your current location',userPosX,userPosY,0,0,0,0,'You are here'];
                  mimarkers.push(miUser);
                  setMarkers(mimap,mimarkers,false);
                  infowindow=new google.maps.InfoWindow({
                                                        content:"loading..."
                  })
				  
                  bounds.extend(userLocation);  //for userLocation POSITION
                  //console.log('Try and set the bounds here...');
                  //mimap.fitBounds(bounds);

				 
                  
      
			var supplier2=options.suppData.data;		//another way of getting the supplier
			var supplierLocation=new google.maps.LatLng(supplier2.latX,supplier2.latY);
			
			console.log('Supplier location is :' + supplierLocation);
			google.maps.event.addDomListener(mimap,'center_changed',function(){
				console.log('Firing resize');
				google.maps.event.trigger(mimap,"resize");	//ensures it displays correctly after pan
			});
                  
			console.log('Openg map -> setActiveItem');
    		ToolbarDemo.views.stuffView.setActiveItem(ToolbarDemo.views.mapView, { type: 'slide', direction: 'left' });
			
			google.maps.event.trigger(mimap,"resize");		//ensures it displays correctly on opening	
			
			//mimap.setCenter(supplierLocation);
			//mimap.setZoom(9);
			
			mimap.setCenter(bounds.getCenter());
			//mimap.setZoom(9);
			mimap.fitBounds(bounds);
			
			
			var tb=Ext.getCmp('mapcard');
			tb.supplierLocation=supplierLocation;
			google.maps.event.addListener(mimap, 'zoom_changed', function(){
					console.log('mimap Zoom ended');
							});
			google.maps.event.addListener(mimap, 'idle', function(){
					console.log('All idle now');
		
			});
     			
                  }
                  catch(b){
                   console.log('Error in stuffsController.js-> ' + b);
                  
                  }
					//Will need to close these, and reset the map when closing the map
 		}
	},

	'openMapTest': function(options){							//cancels the detail, returns to list...console.log('StuffsController.js_openMap');
		
    	if (ToolbarDemo.views.stuffView){
			
			//get the toolbar component - Allows us update the ToolBar easily...
			var vmap=Ext.getCmp('mapcard');
			var vlist=Ext.getCmp('listStuffs');
			var mapListButton=Ext.getCmp('mapListButton');
			
			if (options.action=="openMap"){
				var mapBackButton=Ext.getCmp('mapBackButton');
				mapBackButton.setVisible(false);
				var mapListButton=Ext.getCmp('mapListButton');
				mapListButton.setVisible(true);
				mapListButton.setText('Detail');
				mapListButton.handler=mapDetailClose;
        var directionsButton=Ext.getCmp('directionsButton');
        directionsButton.setVisible(true);
				vmap.dockedItems.items[0].setTitle(vlist.dockedItems.items[0].title);		//set the CategoryTitle..
			}
			else if (options.action=="openMapList"){
				var mapBackButton=Ext.getCmp('mapBackButton');
				mapBackButton.setVisible(false);
				var mapListButton=Ext.getCmp('mapListButton');
				mapListButton.setVisible(true);
        var directionsButton=Ext.getCmp('directionsButton');
        directionsButton.setVisible(false);
				mapListButton.setText('List');
				mapListButton.handler=mapListClose;
				vmap.dockedItems.items[0].setTitle(vlist.dockedItems.items[0].title);		//set the CategoryTitle..
			}
			
			//Set the Close button
			
			
			
			mimap=Ext.getCmp('map1').items.items[0].map;	//grab the map object...
			
			var supplier=ToolbarDemo.views.siteView.thisSupplierRecord;		//one way of getting the supplier
			
			//*******  Use the new Array method  *********
			//Create a new mixed collection and a stuff object and add it to the collection...
			var currentsupplier=options.suppData;	//this array will contain only one supplier (we could add the user position and specify a special icon)
			
			var currentSupplierID=options.suppData.data.stuffID;
			var currentSupplierIndex=getStoreIndex(currentSupplierID);
			
			//var suppliers=[];	
			var suppliers=new Ext.util.MixedCollection();
			suppliers.add(ToolbarDemo.stores.stuffsStore.getAt(currentSupplierIndex));
			
			markers.length=0;				//init the marker array
			markerPositions.length=0;		//ensure the position array is empty to begin with..
			
			//Create an array of positions //TODO should match the openMapList
			for (var i=0;i<suppliers.length;i++){
				if (options.action=="openMap"){
					markerPositions[i]=new google.maps.LatLng(suppliers.items[i].data.latX,suppliers.items[i].data.latY);
				}
				if (options.action=="openMapList"){
					markerPositions[i]=new google.maps.LatLng(suppliers[i].data.latX,suppliers[i].data.latY);
				}
			}
			
			//Create array of markers from arroy of positions
			for (var n=0;n<markerPositions.length;n++){
				var marker= new google.maps.Marker({
					position:markerPositions[n],
					map:mimap
				});
				
				//Add this marker to collection
				markers.push(marker);
			}
		
			var supplier2=options.suppData.data;		//another way of getting the supplier
			var supplierLocation=new google.maps.LatLng(supplier2.latX,supplier2.latY);
			
			console.log('Supplier location is :' + supplierLocation);
			google.maps.event.addDomListener(mimap,'center_changed',function(){
				console.log('Firing resize');
				google.maps.event.trigger(mimap,"resize");	//ensures it displays correctly after pan
			});
			
			console.log('Opening map -> setActiveItem');
    		ToolbarDemo.views.stuffView.setActiveItem(ToolbarDemo.views.mapView,'flip');
			
			google.maps.event.trigger(mimap,"resize");		//ensures it displays correctly on opening	
			mimap.setCenter(supplierLocation);
			
			//get the toolbar component - Allows us update the ToolBar easily...
			var tb=Ext.getCmp('mapcard');
			tb.supplierLocation=supplierLocation;
			google.maps.event.addListener(mimap, 'zoom_changed', function(){
					console.log('Zoome ended');
				//	tb.dockedItems.items[0].setTitle('Loading...');
			});
			google.maps.event.addListener(mimap, 'idle', function(){
					console.log('All quiet now');
				//	tb.dockedItems.items[0].setTitle('Loaded!');
			});
			
			//Just go and open the marker straight away...when map is displayed...
			//supplierInfowindow.open(mimap,supplierMarker);
			//infowindow.open(mimap,marker);		
			
			//Will need to close these, and reset the map when closing the map
 		}
	},
	'cancelMap': function(options){							//cancels the detail, returns to list...
		console.log('StuffsController.js_cancelMap');
		ClearMap();				//Clear map when returning to the list view...
    	if (ToolbarDemo.views.stuffView){
    		ToolbarDemo.views.stuffView.setActiveItem(ToolbarDemo.views.siteView,{ type: 'slide', direction: 'right' });
    	}
	},
    
});

ToolbarDemo.controllers.stuffsController = Ext.ControllerManager.get('StuffsController');