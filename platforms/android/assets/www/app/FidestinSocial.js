//The Fidestin Social module //

Fidestin.Social={};

Fidestin.Social.CanDoSocial=function(){
	console.log('CanDoSocial');
	if (	((localStorage.Twitter==false)||(localStorage.Twitter==null))
		&& 	((localStorage.Facebook=false) ||(localStorage.Facebook=null))
		)
	{
		localStorage.lastPurchaseID="";
		return false;
	}
	else
	{
		debugalert('Nothing to be sociable about.');
		return true;
	}
}

Fidestin.Social.ShowTwitterDialog=function(){
	try{
		debugalert('Fidestin.Social.ShowTwitterDialog');
		var TwitterUrl="http://www.fidestin.com/loya/Twitter.html";		//from local file store...will this work...
		
		function TwitterClosed(){
			debugalert('Closed');
		}
		//This function is fired when the tweet is sent and the user Redirects to fidestin page...
		function TwitterLocationChanged(newURL){
			try{
				//debugalert('TwitterLocationChanged' +newURL);
				//parse this as it redirects to Fidestin thank you (or local thank you)
				if (newURL.indexOf("?message=")>0)
				{
				//var socialopen=Ext.getCmp('home');
				//var l=socialopen.setLoading(true,true);
				//l.el.down('div.x-loading-msg').setHTML("Adding Twitter points...");
					var message_posted=decodeURIComponent(newURL.split("?message=")[1]);		//get rid of those ampersands
					debugalert('Message posted was '+message_posted);
					//grab the message details from the URL and update points etc
					//this calls the twitter API
					//then calls our API to update Fidestin database, updating the points for the customer
					fidotweet(message_posted + ' ' + localStorage.storeMessage,localStorage.lastPurchaseID);
					console.log('TwitterLocationChanged_hiding_Twitter image');
					localStorage.Twitter=false;
					Ext.getCmp('imgTwitter').hide();
				}
			}
			catch(b)
			{
				debugalert('Error in TwitterLocationChanged '+b);
			}
		}
		//Can call the Twitter function here....using a ChildBrowser...
		window.plugins.childBrowser.onLocationChange=TwitterLocationChanged;
		window.plugins.childBrowser.onClose=TwitterClosed;
		window.plugins.childBrowser.showWebPage(TwitterUrl,{showLocationBar:true});
		//var socialcard=Ext.getCmp('home');
		//socialcard.setLoading(false);
		
		
	}
	catch(b)
	{
		debugalert('Error in ShowTwitterDialog '+b);
	}
}
Fidestin.Social.CallTwitterHandler=function(){
   try{
		var socialopen;
		debugalert('Fidestin.Social.CallTwitterHandler');
		//Fidestin.Social.FBComment(999);				//This is for the Facebook stuff
		//return false;									//The code below is for the Twitter stuff...
		if ((localStorage.lastPurchaseID=="") || (localStorage.lastPurchaseID==null))
			 {
			 debugalert ('No tweetpoints available.');
			 return false;
			 }
		
		var inputTweet="";
		
		//Do I have the local ID, show the popup
		var startTwitter=function(){
		debugalert('startTwitter');
			fidoInit('stuff',function(ans){
				if (ans==1)
				{
					debugalert('Ans=1');
					//socialopen=Ext.getCmp('home');
					//var l=socialopen.setLoading(true,true);
					//l.el.down('div.x-loading-msg').setHTML("Opening Twitter...");
					Fidestin.Social.ShowTwitterDialog();			//Already authenticated, tweet away...
				}
				if (ans==0)
				{
					debugalert('Ans=0');
					//There are no local details, so we need to start from the beginning (once only...)
					//Open about:blank page here in ChildBrowser...
					//alert('Loading about:blank');
					//window.plugins.childBrowser.showWebPage("about:blank",{showLocationBar:true});
					fidoCheckTwitterAuth('stuff',function(tans){
						//debugalert('returning from function ' +tans);
						if (tans==1)
						{
							debugalert('tAns=1, you can tweet');
							Fidestin.Social.ShowTwitterDialog();
							//--Don't call this now...use ChildBrowser instead...gkpopover.show('pop');
						}
						if (tans==0)
						{
							debugalert('tAns=01, you can do nothing');
						}
					});	
					
				}
			});				
		}
	
	
	var gkpopover = new Ext.Panel({
		id :'gkpopoverpanel',
		floating:true,
		//centered: true,
		draggable: true,
		modal:true,
		width:'300px',
		height:'200px',
		listeners:{
			'afterrender':function(){
					//panel.setPosition(100,300);
					debugalert('After render...');
				}
			},
			
		dockedItems:[
			{
				xtype :'toolbar',
				title: 'Tweet',
				style : "font-size:12px",
				dock:'top',
				items:[
				        {
						xtype : 'button',
						text :'Cancel',
						style : "font-size:14px",
						ui:	'cancel',
						handler:function(){
								this.ownerCt.ownerCt.destroy();	
							}
				       } ,
					   {
						xtype : 'spacer'
					   }, 
					   {
						xtype:  'button',
						text:   'Tweet',
						style : "font-size:14px",
						//height : 50,
						//width:100,
						ui:     'confirmtweet',
						handler	:function(){
								var tmessage=Ext.getCmp('TweetMessage').getValue();
								debugalert('calling fidoTweet '+tmessage + ' ' + localStorage.storeMessage);
								fidotweet(tmessage + ' ' + localStorage.storeMessage,localStorage.lastPurchaseID);							//need to add +Date() in here if testing...										//post to twitter
								this.ownerCt.ownerCt.destroy();										//tear down the panel...?
									}
				       } 
				       ]
			
			}
		],
		items:[
				{
				xtype: 'textareafield',
				name : 'TweetMessage',
				id	 : 'TweetMessage',
				style: 'width: 100%; height: 100%;'
				//label: 'Tweet'
				}
			],
		
		});
	
	//Ext.getCmp('TweetMessage').fieldEl.dom.focus();
	startTwitter();

}
	catch(b)
	{
		debugalert('Error in Fidestin.Social.CallTwitterHandler '+b);
	}
}
		
Fidestin.Social.FBComment=function(transactionID,storeMessage,storeLink){
	try{
	debugalert('Fidestin.Social.FBComment-calling childbrowser');
        
        console.log('Fidestin.Social.FBComment:' + transactionID + '-'+ storeMessage+'-'+ storeLink);
        
        //childBrowser=ChildBrowser.install(); no required for Android
        //debugalert(childBrowser);
        
        //childBrowser.showWebPage('http://www.google.com');
      
        //console.log('Created childbrower....'+childBrowser);
		var APP_ID="124221437650044";	//Fidestin
    console.log('Fidestin.Social.FBComment');
	
	//Comment this out if FB not required...	
	window.fbAsyncInit = initFacebook;
	
	function initFacebook()
	{
		console.log('initFaceBook');
		FB.init({
		  appId  : APP_ID,
		  status : true, // check login status
		  cookie : false, // enable cookies to allow the server to access the session
		  xfbml  : true  // parse XFBML
		});
		console.log('initFacebook->Getting FB login status');
		FB.getLoginStatus(onFacebookLoginStatus);
	};
	
		
	function facebookLogout()
	{
		FB.logout();
		var loginButtonDiv=document.getElementById("fb-login-button-div");
		loginButtonDiv.style.display="block";	
		var logoutButtonDiv=document.getElementById("fb-logout-button-div");
		logoutButtonDiv.style.display="none";	
		var contentDiv=document.getElementById("user-is-authenticated-div");
		contentDiv.style.display="none";			
	}

	function facebookLogin()
	{
		var loginUrl="http://www.facebook.com/dialog/oauth/?"+
			"scope=publish_stream&"+
			"client_id="+APP_ID+"&"+
			"redirect_uri="+document.location.href+"&"+
			"response_type=token";		
			console.log('facebookLogin_button_CLICK->loginUrl :'+loginUrl+' Redirecting to '+document.location.href);
	
		console.log('facebookLogin->loginUrl :'+loginUrl);
		window.location=loginUrl;
		
	}
	
	/*
	* Callback function for FB.login
	*/
	function onFacebookLoginStatus(response)
	{
		console.log('onFacebookLoginStatus ' + response);
		if (response.status=="connected" && response.authResponse)
		{
			var loginButtonDiv=document.getElementById("fb-login-button-div");
			loginButtonDiv.style.display="none";
			var logoutButtonDiv=document.getElementById("fb-logout-button-div");
			logoutButtonDiv.style.display="block";
			var contentDiv=document.getElementById("user-is-authenticated-div");
			contentDiv.style.display="block";

		}
		else
		{
			var loginButtonDiv=document.getElementById("fb-login-button-div");
			loginButtonDiv.style.display="block";	
			var contentDiv=document.getElementById("user-is-authenticated-div");
			contentDiv.style.display="none";			
		}

	}  
	

	
	
	
		var FBurl='http://m.facebook.com/dialog/feed?app_id=124221437650044&redirect_uri=http://www.handygrub.com/confirm.html&display=touch';
		
        FBurl=FBurl+'&link=http://bit.ly/'+storeLink;
		
			
		function locationChanged(newURL){
		try{
				debugalert('homecard.js_locationChanged_The new url is '+newURL+'. The lastPurchaseID is '+localStorage.lastPurchaseID);
				if (newURL.indexOf("post_id")>0)
				{
					debugalert('Calling query and webservice.');
					Ext.getCmp('imgFacebook').hide();
					Fidestin.Social.UpdateFBPoints(localStorage.lastPurchaseID,'No Message');
					
					
				}
			}
			
			catch(b)
			{
				debugalert('Error in locationChanged'+b);
			}
		}
		
		
		function closed(){
			debugalert('The browser was closed.');
		}
		
		//wrapt this in an if FB
		//Only do the onLocationChange for the FB stuff....otherwise it messes up the Twitter authentication (once off) process.
		debugalert('Calling FB ChildBrowser...');
		window.plugins.childBrowser.onLocationChange=locationChanged;
		window.plugins.childBrowser.onClose=closed;
		window.plugins.childBrowser.showWebPage(FBurl,{showLocationBar:true});
		
		
	}
	catch(b){
		debugalert('Error in Fidestin.Social.FBComment function...'+b);
	}
	
}

Fidestin.Social.UpdateFBPoints=function(lastPuchaseID, customerComment)
{
	try{
		var params="{lastPurchaseID:'" + lastPuchaseID + "',customercomment:'"+customerComment+"'}";
		console.log('Fidestin.Social.UpdateFBPoints_'+params);
		debugalert(params);
		  console.log('Fidestin.Social.UpdateFBPoints');
		  $.ajax({
				type:"POST",
				data:params,
				dataType:"json",    
				contentType: "application/json; charset=utf-8",
				url:Fidestin.WebServices.Location + "/Service1.asmx/FBTransaction",
				
				success:function(result) {
								var i=0;
										console.log('FBTransaction completed succesfully...Need to refresh the points at this stage');
								
				},
				error:function(){
					debugalert('Error in UpdateFBPoints');
					$(document).ajaxError(function(e, xhr, settings, exception) { 
						debugalert('error in: ' + settings.url + ' \n'+'error:\n' + xhr.responseText ); 
						}); 
				}

			})      
	}
	
	catch(b)
	{
		debugalert('Error in Fidestin.Social.UpdateFBPoints '+b);
	}


}		


 Fidestin.Social.UpdateTwitter=function(transID,sourceID,comment){
	try{
		//get the store message from localStorage and append it to the comment
		debugalert('Tweet now ' + comment);
		  var params="{transID:" + transID + ",sourceID:"+sourceID+",comment:'"+comment+"'}";
		  debugalert('In UpdateTwitter....'+params);
		      
	            $.ajax({
	                type:"POST",
	                data:params,
	                dataType:"json",    
	                contentType: "application/json; charset=utf-8",
	                url:Fidestin.WebServices.Location+"/Service1.asmx/UpdateTwitter",
	                success:function(result) {
	                		debugalert('Result is ' +result+' Then_zero ' +result[0]);
	                        
	                		if (result==1){
	                	 		Ext.Msg.debugalert('Twitter points updated') ;
								localStorage.storeMessage="";
								localStorage.lastPurchaseID="";
									
								var pointsc=Ext.getCmp('home');
								pointsc.setLoading(false);
	                	 	};
	                	 	
	                	 	if (result==0){
	                	 		Ext.Msg.debugalert('Twitter points NOT updated') ;
	                	 	};
	                		
	                },
	                error:function(){
	                    debugalert('Error in UpdateTwitter');
	                    $(document).ajaxError(function(e, xhr, settings, exception) { 
	                    	debugalert('error in: ' + settings.url + ' \n'+'error:\n' + xhr.responseText ); 
	                    	}); 
	                }

	            })      
			}
			
	catch (b){
		debugalert('Error in UpdateTwitter ' + b);	
	}
}