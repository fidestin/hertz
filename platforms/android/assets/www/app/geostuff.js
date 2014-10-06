function getUserLocation(){
	try{
		var userPos=JSON.parse(localStorage.getItem('userPosition'));
		var userPosX=userPos[Object.keys(userPos)[0]];
		var userPosY=userPos[Object.keys(userPos)[1]];
		console.log('Parsed user position ' + userPosX + ',' + userPosY);
		var userLocation=new google.maps.LatLng(userPosX,userPosY);
		return userLocation;	
	}
	catch(b){
		console.log('Error ' +b);
	}

}

function timedforceGetCordovaLocation()
{
	myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Refreshing location"});
	myMask.show();
	console.log('TimedforceGetCordovaLocation ');
	forceGetCordovaLocation();
	
}

function forceGetCordovaLocation()
{
				try{
					function onSuccess(position) {
							try{
								var userPos=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
								localStorage.setItem('userPosition',JSON.stringify(userPos));
								console.log('forceGetCordovaLocation ' + localStorage.userPosition + " --- " + displayTime());
								Fidestin.Utils.DisplayMessage('Location','Your location has been refreshed.','AAC');
								myMask.hide();
								}
								catch(b)
								{
									console.log('Error in forceGetCordovaLocation- onSuccess ' + b);
									myMask.hide();
								}
						}
				
					function onError(error) {
							Fidestin.Utils.DisplayMessage('Location','Your location could not be determined. Please check your phone settings to ensure GPS is enabled.','AAC');
							console.log('forceGetCordovaLocation - code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
							myMask.hide();
						}
					
					
					console.log('Calling geo.');
					//myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Refreshing dax location"});
					//myMask.show();
					navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:10000});
					
				}
				catch(b){
					console.log('Error in forceGetCordovaLocation '+b);
				}
			
	}

function getMessage(messageText){
	ToolbarDemo.views.HelpCustomerPassword(messageText);
}
//The new way using Cordova geoLocation services
function getCordovaLocation(){
	try
	{
		if (!navigator.geolocation){
			alert('Please change your phone settings to allow geolocation.');
			return;
		}
		console.log('In getCordovaLocation ');
		//do we have a user location?
		if (localStorage.userPosition==null){
			console.log('uesrPosition is Null. Prompt for geolocation access.');
			if (confirm('Allow app to detect your geolocation?')){
				console.log('User allowing geoLocation');
				timedforceGetCordovaLocation();
			}
			else
			{
				alert('The app may not function properly without knowing your geolocation.');
			}
		}
		else
		{
			console.log(localStorage.userPosition);
		}
    }
	catch(b){
		console.log('Error in getCordovaLocation '+b);
	}
}	


//The old way using IP stuff....
function getLocation()
{
	try{
		
			$.get("http://ipinfo.io", function(response) {
						var userPos=new google.maps.LatLng(response.loc.split(',')[0],response.loc.split(',')[1]);
						localStorage.setItem('userPosition',JSON.stringify(userPos));
						console.log('getLocation ' +localStorage.userPosition);
			}, "jsonp");
		}
	catch(b){
		console.log('Error in getLocation ' + b);
	}
} 

function getStoreIndex(value){
	for (var i=0;i<ToolbarDemo.stores.stuffsStore.data.length;i++){
		if (ToolbarDemo.stores.stuffsStore.data.items[i].data.stuffID==value)
		{
			console.log('storeName.data.items[i].data.description');
			break;
		}
	}
	return i;
}

//Could pass in a categoryID to this function
//Need to add an extra column to the location table : distance/duration/travelMode (i.e. walking or driving)
//Give the user the option of changing the travel mode
//Could have a refresh button on this list also...
//so when this gets run (when the list opens) it saves the distance into the table
//

function topFunc(){
	console.log('topFunc - starting calcs - Item count ' + ToolbarDemo.stores.stuffsStore.data.items.length);
	
	for (var i=0;i<ToolbarDemo.stores.stuffsStore.data.items.length;i++){
		console.log('Calling Planner for ' +i);
		getDistance(i,updatePlanner);
		//Now you can open the list screen...
		//or refresh it...
		
	}
	if (i+1==ToolbarDemo.stores.stuffsStore.data.items.length)
		{
			ToolbarDemo.views.stuffsListView.items.items[0].refresh();
		}
	console.log('calcs called');
}
var mapListDisplayed;
var mapValuesReturned;

function updatePlanner(timeHere,distHere,dataIndex){
	try
	{
	mapValuesReturned++;
		console.log('_updatePLanner_mapValuesReturned: ' + mapValuesReturned +'-mapListDisplayed:' + mapListDisplayed + 'Index:' +dataIndex + '---This will update the location distance etc : '+timeHere+'-'+distHere);
		ToolbarDemo.stores.stuffsStore.data.items[dataIndex].data.journeyDuration=timeHere;
		ToolbarDemo.stores.stuffsStore.data.items[dataIndex].data.journeyDistance=distHere;
		
		if ((mapValuesReturned==ToolbarDemo.stores.stuffsStore.data.items.length) && (mapListDisplayed==false)){
			//Now that all the items are measured (in this callback function)
			//The list UI could be refreshed if required...
			//Ext.getCmp(List).Refresh?
			mapListDisplayed=true;		//callback only gets called once....
			//callback();
			console.log('Could we call the controll Dispatcher here? to setActiveItem: ' + dataIndex);
			//ToolbarDemo.views.stuffsListView.items.items[0].store#
			//At this point it might be worth checking the store for journeyDuration=0 and re-trying
			//before freshing the list with zeros...
			//Could also update spinner to user can see something is happening, the distances are being calculated...
			ToolbarDemo.views.stuffsListView.items.items[0].refresh();
      var pointsc=Ext.getCmp('listStuffs');
      //pointsc.setLoading(false);
	  myMask.hide();
		}
	}
	catch(b){
		console.log('Error in updatePlanner ' + dataIndex + '. Error ' + b);
	}
	
}

function userPositionLatX(){
 var userPos=JSON.parse(localStorage.getItem('userPosition'));
 return userPos[Object.keys(userPos)[0]];
}


function userPositionLongY(){
 var userPos=JSON.parse(localStorage.getItem('userPosition'));
 return  userPos[Object.keys(userPos)[1]];
}

function getDistance(dataIndex,callback){
	try{
		//getLocation();	//loads the userPosition into localStorage
		console.log('Calculating for ' + dataIndex);
		var directionsService = new google.maps.DirectionsService();
		
		var userPos=JSON.parse(localStorage.getItem('userPosition'));
		var userPosX=userPos[Object.keys(userPos)[0]];
		var userPosY=userPos[Object.keys(userPos)[1]];
		console.log('Parsed user position ' + userPosX + ',' + userPosY);
		var originPosition=new google.maps.LatLng(userPosX,userPosY);
		
		var destDataObject=ToolbarDemo.stores.stuffsStore.data.items[dataIndex].data;
		
		
		//var destinationPosition=new google.maps.LatLng(53.287,-6.36647);
		var destinationPosition=new google.maps.LatLng(destDataObject.latX,destDataObject.latY);
		console.log(destinationPosition);
		
		var request={
			origin:originPosition,
			destination:destinationPosition,
			travelMode:google.maps.DirectionsTravelMode.DRIVING
		}
		
		directionsService.route(request, function(response, status) {
			//console.log('route response ' + google.maps.DirectionsStatus);
			if (status == google.maps.DirectionsStatus.OK) {
				//directionsDisplay.setDirections(response);
				var journeyTime=response.routes[0].legs[0].duration.text;
				var journeyDistance=response.routes[0].legs[0].distance.text;
				console.log('=>Distance okay.');
				console.log('=>Distance is ' + response.routes[0].legs[0].distance.text);
				console.log('=>Duration is ' + response.routes[0].legs[0].duration.text);
				callback(journeyTime,journeyDistance,dataIndex);
				//Call some (new) function here that updates the in browser sqlite database with this distance
				//Course if the user moves, the need to hit refresh to get new distances
				//Could have another function that clears out these distances each time the list closes
				//This ensures the distance data is up to date...
			}
			else
			{
				console.log('Something up...did not get distances for this item' + dataIndex);
				callback(0,0,dataIndex);
			}
		});
	}
	catch(b){
		console.log('Error in getDistance' +b);
	}
}