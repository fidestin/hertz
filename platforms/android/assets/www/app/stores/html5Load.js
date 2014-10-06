 function errorHandler(transaction, error){
	console.log('Does some error handling here ' + error);
 }

		var shortName = 'location_DB';
		var version = '';
		var displayName = 'My Important Database';
		var maxSize = 65536; // in bytes
		var DEBUG_ON=0;
		var DATABASE_SOURCE_FILE='location4.sql';			//can load different files...loaded in app.js from /loya root dir
	
function dataHandler(transaction,results){
	console.log('results!');
	 for (var i=0; i<results.rows.length; i++) {
 
    	var row = results.rows.item(i);
	}
}	
	
loadNearby=function(arraylocationID, callback){
	try{
		console.log('html5Load.js - loadNearby');
		/*should build query using the locationIDs */
		var DATABASE_QUERY=' select _id as ID,locationName as description, locationCategoryId as categoryID,locationSummary as stuffName, locationAddress as address, locationImage, locationLatitude as latX, locationLongitude as latY from location where location.locationlatitude >  52.371 and location.locationlatitude <54.169 and location.locationlongitude > -10.6	and location.locationlongitude < -7.596';
		var myDB = openDatabase(shortName, version, displayName, maxSize);
			myDB.transaction(function(transaction){
						transaction.executeSql(DATABASE_QUERY,
									[],
									function(transaction,results){
												ToolbarDemo.stores.stuffsStore.clearData();
												console.log('html5Load.js_Nearby loaded here ' + results.rows.length);
												 for (var i=0; i<results.rows.length; i++) {
													var row = results.rows.item(i);
														ToolbarDemo.stores.stuffsStore.add({
															stuffID:row.ID,
															address:row.address,
															description:row.description,		//Title (short)
															latX:row.latX,
															latY:row.latY,
															stuffName:row.stuffName,			//make this the long text piece.
															categoryID:row.categoryID,
															locationImage: row.locationImage
															});	
														//When all the items are loaded into the store we fire the mapping bit
														
														if (i+1==results.rows.length){
															console.log('_loadNearby_Firing mapping bit-' + i + '-' + results.rows.length);
															callback(); //ok - dont fire it...
														}
												}
									},
												errorHandler);
									}
							);	
		
	}
	catch(b){
		
	}
}
	
thirdload=function(categoryID,callback){
		try
		{
			
			console.log('html5Load.js_thirdLoad() - querying & loading data based on a certain CategoryID, bars etc ' );
		   var SQL_STRING=" select _id as ID,locationName as description, locationCategoryId as categoryID,locationSummary as stuffName, locationAddress as address, locationImage, locationLatitude as latX, locationLongitude as latY from location where locationCategoryId=" + categoryID;
			var myDB = openDatabase(shortName, version, displayName, maxSize);
			myDB.transaction(function(transaction){
						transaction.executeSql(SQL_STRING,
									[],
									function(transaction,results){
												ToolbarDemo.stores.stuffsStore.clearData();
												console.log('html5Load.js_Result here ' + results.rows.length);
												 for (var i=0; i<results.rows.length; i++) {
													var row = results.rows.item(i);
														ToolbarDemo.stores.stuffsStore.add({
															stuffID:row.ID,
															address:row.address,
															description:row.description,		//Title (short)
															latX:row.latX,
															latY:row.latY,
															stuffName:row.stuffName,			//make this the long text piece.
															categoryID:row.categoryID,
                              locationImage: row.locationImage
															});	
														//When all the items are loaded into the store we fire the mapping bit
														
														if (i+1==results.rows.length){
															console.log('_thirdload_Firing mapping bit-' + i + '-' + results.rows.length);
															callback(); //ok - dont fire it...
														}
												}
									},
												errorHandler);
									}
							);	
		}
		catch(b){
			console.log('Error in ' + b);
		}
}		
loadagain=function(){
	console.log('html5Load.js  - Opening Database');
	var myDB = openDatabase(shortName, version, displayName, maxSize);
	myDB.transaction(queryDB,errorHandler);
}		

queryDB=function(tx){
	try{
		tx.executeSql('select * from location',[],console.log('Success' + result.length),errorHandler());
	}
	catch(b){
		console.log('Error in queryDB' + b);
	}
}

loadLocationsIntoStore=function(){
	try{
		
		
	
		var myDB = openDatabase(shortName, version, displayName, maxSize);
		console.log('httml5Load.js_loadLocationsIntoStore - Opened database');
		var SQL_STRING=" select _id as ID,locationName as description, locationSummary as stuffName, locationAddress as address, locationLatitude as latX, locationLongitude as latY from location";
		var buildstring='';		//init the HTML builderstring
		myDB.transaction(
						 function(transaction){
						 transaction.executeSql(SQL_STRING,[],
												function(transaction,results){
													for (var i=0;i<results.rows.length;i++){
														row=results.rows.item(i);
														xc=row['LatX'];yc=row['LatY'];locname=row['Name'];
														//Update store here
														ToolbarDemo.stores.stuffsStore.add({
															stuffID:result[i].ID,
															address:result[i].address,
															description:result[i].description,		//Title (short)
															latX:result[i].latX,
															latY:result[i].latY,
															stuffName:result[i].stuffName			//make this the long text piece.
															});
														localStorage.locationCount=result.length;
													}
													//Update some UI here?
												}
												, errorHandler);
						 });	
	}
	catch(b){
		console.log('Error in loadLocationsIntoStore ' +b);
	}
}

doesDatabaseExist=function(){
		var myDB = openDatabase(shortName, version, displayName, maxSize);
		console.log('httml5Load.js_doesDatabaseExist - Check does database exist already.');
		var SQL_STRING=" select count(*) as countRows from location "; 
		myDB.transaction(
						 function(transaction){
						 transaction.executeSql(SQL_STRING,[],
												function(transaction,results){
													if (results.rows.item(0).countRows>0){
														console.log('Success. Database already populated with  ' + results.rows.item(0).countRows) + ' rows. No need to recreate.';
														sTotalLoad.Stop();
														console.log('html5Load.js_startLoad... Time lapsed : sTotalLoad ' + sTotalLoad.ElapsedMilliseconds + '----' + displayTime());
													}
													else
													{
														console.log('No rows in database or database does not exist');
													}
												}
												, function(){
													console.log('The table does not exist or some other error occurred...recreating database');
													startLoad();
												});
						 });	
}

startLoad=function(){
            var demoRunning = false;
				console.log('html5Load.js_startLoad - Running Data Load from text file to Sqlite');
                    demoRunning = true;
                    try {
                        html5sql.openDatabase("location_DB", "Demo Database", 5*1024*1024);
						console.log('Opening database to import data');
                        $.get(DATABASE_SOURCE_FILE,function(sql){
							console.log('Opened database file, loading into DB');
                            var startTime = new Date();
                            html5sql.process(
                                sql,
                                function(){ //Success
                                    var endTime = new Date();
                                    console.log("Table with x entries created in: " + ((endTime - startTime) / 1000) + "s");
                                    demoRunning = false;
									sTotalLoad.Stop();
									console.log('html5Load.js_startLoad... Time lapsed : sTotalLoad ' + sTotalLoad.ElapsedMilliseconds + '----' + displayTime());
                                },
                                function(error, failingQuery){ //Failure
                                    console.log("Error: " + error.message);
                                    demoRunning = false;
                                }
                            );
                        });  
                    } catch (error) {
						console.log('Error in demo load : '+error.message);
                        demoRunning = false;
                    }
}