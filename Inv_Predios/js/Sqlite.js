//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;
app.Longitud=0;
app.Latitud=0;
app.Altitud=0;
app.Foto="";

var clsDatos = {};
clsDatos.Comuna="";
clsDatos.Barrio="";
clsDatos.Direccion="";
clsDatos.Distancia="";
clsDatos.Coordinador="";
      
app.openDb = function() {
    if(window.sqlitePlugin !== undefined) {
        app.db = window.sqlitePlugin.openDatabase("Todo");
    } else {
        // For debugin in simulator fallback to native SQL Lite
        console.log("Use built in SQL Lite");
        app.db = window.openDatabase("Todo", "1.0", "Cordova Demo", 200000);
    }
}
      
app.createTable = function() {
	var db = app.db;
	db.transaction(function(tx) {
        //tx.executeSql("DROP TABLE IF EXISTS puntos", []);        
		tx.executeSql("CREATE TABLE IF NOT EXISTS puntos(ID INTEGER PRIMARY KEY ASC,coordinador TEXT, barrio TEXT, comuna TEXT, direccion TEXT, distancia TEXT, longitud NUMERIC, latitud NUMERIC, altitud NUMERIC, foto TEXT, added_on DATETIME)", []);
	});
}
      
app.addTodo = function() {
	var db = app.db;    
    
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'none';
	db.transaction(function(tx) {
		var addedOn = new Date();        
        var options = {
				frequency: 1000,
				enableHighAccuracy: true
			};
        navigator.geolocation.getCurrentPosition(app.obtenerPosicion,app.errorHandler,options);
		tx.executeSql("INSERT INTO puntos(coordinador, barrio, comuna, direccion, distancia, longitud, latitud, altitud, foto, added_on) VALUES (?,?,?,?,?,?,?,?,?,?)",
					  [clsDatos.Coordinador,clsDatos.Barrio,clsDatos.Comuna, clsDatos.Direccion, clsDatos.Distancia, app.Longitud,app.Latitud, app.Altitud, app.Foto, addedOn],
					  app.onSuccess,
					  app.onError);
	});
} 
    
app.onError = function(tx, e) {
	console.log("Error: " + e.message);
} 
      
app.onSuccess = function(tx, r) {
	app.refresh();
}
      
app.deleteTodo = function(id) {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM puntos WHERE ID=?", [id],
					  app.onSuccess,
					  app.onError);
	});
}

app.refresh = function() {
	var renderTodo = function (row) {
		return "<div class='product_overview'>" +
        "<img style='width:60px; height:60px;' src='" + row.foto + "' />" +
        "<div class='title'>" + 
        "Barrio: " + row.barrio  + 
        "<br/>Dir: " + row.direccion  + 
        "<br/>Coor: " + row.coordinador  + 
        "<br/>Lon: " + row.longitud +          
        "<br/>Lat: " + row.latitud + "" +
        "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'>"+
        "<p class='todo-delete'></p></a>" + "<div class='clear'></div></div>" +
        "</div>";
	}
    
	var render = function (tx,rs) {
		var rowOutput = "";
		var todoItems = document.getElementById("todoItems");
		for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += renderTodo(rs.rows.item(i));
		}
      
		todoItems.innerHTML = rowOutput;
	}
    
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM puntos", [], 
					  render, 
					  app.onError);
	});
}
      
function init() {
    navigator.splashscreen.hide();
	app.openDb();
	app.createTable();
	app.refresh();
    
    var options = {enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(app.obtenerPosicion,app.errorHandler,options);
    
    cameraApp = new cameraApp();
    cameraApp.run();
}
      
function addTodo() {
	var dir = document.getElementById("direccion");
	var dis = document.getElementById("distancia");
    var cor = document.getElementById("coordinador");
    var com = document.getElementById("comuna");
    var bar = document.getElementById("barrio");
    
    clsDatos.Direccion = dir.value;
    clsDatos.Distancia = dis.value;
    clsDatos.Coordinador = cor.value;
    clsDatos.Comuna = com.options[com.selectedIndex].value;
    clsDatos.Barrio = bar.options[bar.selectedIndex].value;
	app.addTodo();
	dir.value = "";
	dis.value = "";
}