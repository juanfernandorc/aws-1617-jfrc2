"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var DataStore = require('nedb');
var dbFileName = path.join(__dirname, 'contacts.json');

var db = new DataStore({
    filename : dbFileName,
    autoload : true
});

var port = (process.env.PORT || 16778);
var baseAPI = "/api/v1";

var app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.get(baseAPI + "/contacts", (request, response) => {
    console.log("GET /contacts"); 
    db.find({},(err,contacts)=>{
        response.send(contacts);    
    });
});

app.post(baseAPI + "/contacts", (request, response) => {
    console.log("POST /contacts");
    var contact = request.body;
    db.insert(contact);
    response.sendStatus(201);
});

app.delete(baseAPI + "/contacts", (request, response) => {
    console.log("DELETE /contacts");

    db.remove({},{ multi: true},(err,numRemoved)=>{
        console.log("contacts removed:"+numRemoved);
        response.sendStatus(200);    
    });

});

app.get(baseAPI + "/contacts/:name", (request, response) => {
    console.log("GET /contacts/"+name);
    var name = request.params.name;

    db.find({name:name},(err,contacts)=>{
        if (contacts.length === 0)
        {
            response.sendStatus(404);
        }
        else
        {
            response.send(contacts[0]);  
        }
    });
});


app.delete(baseAPI + "/contacts/:name", (request, response) => {
    var name = request.params.name;

    db.remove({name:name},{ multi: true},(err,numRemoved)=>{
        console.log("contacts removed:"+numRemoved);
        response.sendStatus(200);    
    });

    console.log("DELETE /contacts/" + name);
});


app.put(baseAPI + "/contacts/:name", (request, response) => {
    var name = request.params.name;
    var updatedContact = request.body;

    db.update({name:name},updatedContact,{},(err,numUpdates)=>{
        console.log("contacts updated:"+numUpdates);
        if (numUpdates === 0)
        {
            response.sendStatus(404);    
        }
        else
        {
            response.sendStatus(200);    
        }
        
    });

    console.log("UPDATE /contacts/"+name);
});


app.listen(port, () => {
    console.log("Server up and running!!");
});