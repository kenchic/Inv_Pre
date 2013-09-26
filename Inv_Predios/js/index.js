document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
    navigator.app.exitApp();
}

function onDeviceReady() {    
    //kendo UI
    app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout" });    
	//gps
    geolocationApp = new geolocationApp();
	geolocationApp.run();
    //camara
    cameraApp = new cameraApp();
    cameraApp.run();
    //sqlite
    navigator.splashscreen.hide();
	app.openDb();
	app.createTable();
	app.refresh();
}