//For the moment let the stores data be loaded here from the notes crap...
//....then switch to voucher data....
Ext.regModel('NoteModel', {
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'date', type: 'date', dateFormat: 'c' },
        { name: 'title', type: 'string' },
        { name: 'narrative', type: 'string' }
    ],
    validations: [
        { type: 'presence', field: 'id' },
        { type: 'presence', field: 'title', message: 'Please enter a title for this note.' }
    ]
});


Ext.regStore('NotesStore', {
    model: 'NoteModel',
    sorters: [{
        property: 'date',
        direction: 'DESC'
    }],
    proxy: {
        type: 'localstorage',
        id: 'notes-app-store'
    },
    getGroupString: function (record) {
        if (record && record.data.date) {
            return record.get('date').toDateString();
        } else {
            return '';
       }
    }
});

//Gives the store a name (ID) in the StoreManager....making it easy to retrieve
//rather than using ...ToolbarDemo.stores.notesStore
ToolbarDemo.stores.notesStore = Ext.StoreMgr.get('NotesStore');

ToolbarDemo.models.supplier=Ext.regModel('ToolbarDemo.models.supplier',{
	idProperty:'ID',
	fields :[
		{name:'supplierName'},
		{name: 'latX'},
		{name: 'latY'},
		{name:'categoryID'}
	]
});


ToolbarDemo.stores.suppliersStore=new Ext.data.Store({
	sorters:[{
		property: 'supplierName',
		direction: 'ASC'
	}],
	model:'ToolbarDemo.models.supplier',
	data :[
		{supplierName:'Bad Asses',latX:'53.35',latY:'6.7',categoryID:'1'},
		{supplierName:'Joes Cafe',latX:'53.25',latY:'6.8',categoryID:'1'},
		{supplierName:'Marys Cafe',latX:'53.15',latY:'6.9',categoryID:'1'},
		{supplierName:'The Quays',latX:'53.05',latY:'6.91',categoryID:'2'},
		{supplierName:'The House Hotel',latX:'53.45',latY:'6.92',categoryID:'3'},
		{supplierName:'Cliffs of Moher',latX:'53.55',latY:'6.93',categoryID:'4'},
	]
});

ToolbarDemo.models.stuff=Ext.regModel('ToolbarDemo.models.stuff',{
	 idProperty: 'stuffID',
		fields:[
		        {name:'stuffID',	type:'string'},
		        {name:'description',type:'string'},
				{name:'stuffName',	type:'string'},
				{name:'address', type:'string'},
				{name: 'latX'},
				{name: 'latY'},
				{name: 'categoryID'},
				{name: 'journeyDuration'},
				{name: 'journeyDistance'},
            {name: 'locationImage',type:'string'}
		       ]
});
ToolbarDemo.stores.stuffsStore=new Ext.data.Store({
	sorters	:[{
		property : 'stuffName',
		direction : 'ASC'
	}],
	model	: 'ToolbarDemo.models.stuff',
	storeID : 'myStuffStore'
	//data	: [	{stuffID:'10',description:'McArdles',stuffName:'Hello',address:'53 Cartur Mor, Clybaun Road, Galway',latX:'53.27941',latY:'-9.10314',categoryID:'214'},
	//    	   {stuffID:'11',description:'Spanish Arch Bar',stuffName:'World',address:'13 Quay Street, Galway',latX:'53.27105',latY:'-9.054245',categoryID:'214'}
	//    	   ]
});

ToolbarDemo.models.voucher=Ext.regModel('ToolbarDemo.models.voucher',{
	 idProperty: 'voucherID',
		fields:[
		        {name:'voucherID',	type:'string'},
		        {name:'storeID',	type:'string'},
		        {name:'storename',	type:'string'},
		        {name:'description',type:'string'},
		        {name:'customername',type:'string'},
		        {name:'datecreated',type:'string'},
            {name:'supplierName',type:'string'},
            {name:'supplierID',type:'string'},
				{name:'expires',	type:'string'}
		        
		        ]
});

ToolbarDemo.stores.vouchersStore=new Ext.data.Store({
	sorters	:[{
		property : 'storename',
		direction : 'ASC'
	}],
	model	: 'ToolbarDemo.models.voucher',
	//data	: [			//This is now loaded in the NotesListView_initComponent() 
	//    	   {voucherID:'10',storeID:'2',storename:'McNamaras �10 Voucher'},
	//    	   {voucherID:'11',storeID:'2',storename:'OBriens Christmas �5 Voucher'}
	//    	   ],
   //getGroupString: function (record) {
   //    return record.get('storename');
   //}

});

//BMCA - Added suppliers - these are the activity suppliers - customer may or
//may not have vouchers with these suppliers
//Added a test






//BMCA - Added categories
ToolbarDemo.models.category=Ext.regModel('ToolbarDemo.models.category',{
	idProperty:'categoryID',
		fields:[
				{name:'categoryID',type:'int'},
				{name:'catdescription',type:'string'},
            {name:'catImage',type:'string'}
		]
});


ToolbarDemo.stores.categoryStore=new Ext.data.Store({
	sorters:[{
		property: 'catdescription',
		direction: 'ASC'
	}],
	model:'ToolbarDemo.models.category',
	data :[
         {categoryID:'226',catdescription:'Restaurants',catImage:'travelicons/Resto.jpg'},
         {categoryID:'225',catdescription:'Bars',catImage:'travelicons/Bars.jpg'},
         {categoryID:'214',catdescription:'Hotels',catImage:'travelicons/hotel.jpg'},
         {categoryID:'247',catdescription:'Attractions',catImage:'travelicons/Sights.jpg'},
		 {categoryID:'999',catdescription:'Search...',catImage:'travelicons/Sights.jpg'}
	]
});
//BMCA - Added categories



ToolbarDemo.models.points=Ext.regModel('ToolbarDemo.models.points',{
	 idProperty: 'storeID',
		fields:[
		        {name:'points',			type:'int'},
		        {name:'storeID',		type:'int'},
		        {name:'storename',		type:'string'},
		        {name:'address1',		type:'string'}
		       ]
});

ToolbarDemo.stores.pointsStore=new Ext.data.Store({
	sorters	:[{
		property : 'storeID',
		direction : 'ASC'
	}],
	model	: 'ToolbarDemo.models.points',
	//data:[
	//      	{point:'20',storeID:'10',storename:'bla',address2:'here'},
	//      	{point:'10',storeID:'40',storename:'bla2',address2:'here2'}
	//      ]
});


ToolbarDemo.models.scan=Ext.regModel('ToolbarDemo.models.scan',{
	 idProperty: 'id',
		fields:[
		        {name:'id',			type:'string'},
		        {name:'scandata',	type:'string'},
		       ]
});

ToolbarDemo.stores.scansStore=new Ext.data.Store({
	sorters	:[{
		property : 'id',
		direction : 'ASC'
	}],
	model	: 'ToolbarDemo.models.scan',
	//data	: [			 
	//    	   {id:'SCAN103123123123',scandata:'ZHJKFHKHJHJKEEFRER'},
	//    	   {id:'SCAN111321321231',scandata:'HJKHKJDHKJSDFHKJSDF'}
	//    	   ]
   

});

//This torows an error if its included...
//ToolbarDemo.stores.scansStore = Ext.StoreMgr.get('ScansStore');


//Store = Client-sode cache of Objects
//Stores load data via a Proxy
//Use ScriptTagProxy rather than AjaxProxy for remote data...
//For testing we load the data INLINE - i.e. we specify it here...
//If we needed to process the data returned by the JSON we could use a READER
ToolbarDemo.stores.shop=new Ext.data.Store({
		model		: 'ToolbarDemo.models.shop',
		//proxy		: {  <---- use this eventually to load the remote data
		//		type			: 'scripttag',
		//		reader			: {type:'json'},
		//		url				: 'http://www.handygrub.com/loya/Service1.asmx/CustomerStorePoints',
		//		extraParams		: {CustomerID:'1',storeID:'2'}
		//}
		data		: [
					{shopID:'1',franchiseid:'2',Name:'OBriens Liosban',Address1:'Liosban Industrial Estate',Address2:'Tuam Road',Town:'Galway',LatX:'52.98',LatY:'-9',storecode:'0036000291452',distance:'80'},
					{shopID:'3',franchiseid:'2',Name:'McNamaras',Address1:'Cross Street',Address2:'',Town:'Tuam Road',Town:'Galway',LatX:'52.55',LatY:'-9.1',storecode:'123456789012',distance:'50'}					
			
		]
});

ToolbarDemo.models.customerpoints=Ext.regModel('ToolbarDemo.models.customerpoints',{
		fields:[
			{name:'shopID',			type:'string'},
			{name:'StoreName',		type:'string'},
			{name:'distance',		type:'string'},
			{name:'points',			type:'string'}
		],
});

ToolbarDemo.stores.customerpoints=new Ext.data.Store({
		model		: 'ToolbarDemo.models.customerpoints',
		//proxy		: {  <---- use this eventually to load the remote data
		//		type			: 'scripttag',
		//		reader			: {type:'json'},
		//		url				: 'http://www.handygrub.com/loya/Service1.asmx/CustomerStorePoints',
		//		extraParams		: {CustomerID:'1',storeID:'2'}
		//}
		data		: [
					{shopID:'1',StoreName:'McNamaras',distance:'34',points:'120'},
					{shopID:'2',StoreName:'OBriens',distance:'32',points:'80'}
					]
});


ToolbarDemo.models.customer=Ext.regModel('ToolbarDemo.models.customer',{
		fields:[
			{name:'id',				type:'string'},
			{name:'city',		type:'string'},
			{name:'mobile_url',			type:'string'}
			
		],
});

ToolbarDemo.stores.customer=new Ext.data.Store({
		model		: 'ToolbarDemo.models.customer',
		autoLoad	: true,
		proxy: {
            type: 'scripttag',
            url: 'http://www.handygrub.com/test/service1.asmx/HelloWorld',
           reader: {
                type: 'json'
            }
        }
		//data		: [{id:'1',FirstName:'Brendan',Last:'McArdle',EMail:'b@iol.ie'},
		//			{id:'2',FirstName:'Joe',Last:'Burke',EMail:'c@iol.ie'}
		//		]
		//data		:ToolbarDemo.views.loadCustomers()
});




var  makeJSONPRequest=function(){
		Ext.util.JSONP.request({
				url			:'http://www.handygrub.com/loya/Service1.asmx/GetListCustomers',
				callbackKey	: 'callback',
				params		: {},
				callback	: function(result){
					alert(data.length);
					alert(data);
					ToolbarDemo.stores.customer.data=result.data;
				}
		});

};

ToolbarDemo.models.dealer = Ext.regModel('ToolbarDemo.models.dealer', {
    fields: [    
        {name:'dealerID',type:'string'},
        {name:'dealerName', type:'string'},
        {name:'address', type:'string'},
        {name:'city', type:'string'},
        {name:'state', type:'string'},
        {name:'country', type:'string'},
        {name:'postalCode', type:'string'},
        {name:'url', type:'string'},
        {name:'distance', type:'string'},
        {name:'phone', type:'string'},
        {name:'pphone', type:'string'},
        {name:'mobile', type:'string'},
        {name:'hours', type:'string'},
        {name:'contact', type:'string'},
        {name:'email', type:'string'},
        {name:'type', type:'string'},
        {name:'latitude',type:'string'},
        {name:'longitude', type:'string'},
        {name:'salesnservice',type:'boolean'},
        {name:'serviceonly',type:'boolean'},
        {name:'affiliate',type:'boolean'},
        {name:'marine',type:'boolean'},
        {name:'rail',type:'boolean'},
        {name:'bus',type:'boolean'},
        {name:'ikare',type:'boolean'}
        
        
    ],
});

ToolbarDemo.stores.dealer = new Ext.data.JsonStore({
    model: 'ToolbarDemo.models.dealer',
    autoLoad: false,
    proxy: {
		url	:'http://thermokingdev.corp.irco.com/mobiledealerlocator/Service1.asmx/GetNearDealers',
        type: 'ajax',
        reader: { type: 'xml', root: 'ArrayOfDealer', record: 'Dealer', model: 'ToolbarDemo.models.dealer' },
		extraParams :{
            currentLat: '53',
            currentLong: '-9',
            startRow: '1',
            endRow: '8',
            affiliate: '1',
            bus: '1',
            ikare:'1',
            marine: '1',
            rail: '1',
            salesnservice: '1',
            serviceonly: '1'}
	}
});

