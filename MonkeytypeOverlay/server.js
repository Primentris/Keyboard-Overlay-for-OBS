/*
==================================================
Monkey Overlay
server.js

Global keyboard listener + WebSocket server
==================================================
*/

const { uIOhook } = require("uiohook-napi");
const WebSocket = require("ws");

/*
==================================================
Create WebSocket Server
==================================================
*/

const wss = new WebSocket.Server({
    port: 8080
});

console.log("======================================");
console.log("Monkey Overlay Server Started");
console.log("WebSocket : ws://localhost:8080");
console.log("Waiting for OBS...");
console.log("======================================");

/*
==================================================
Browser Connected
==================================================
*/

wss.on("connection", (client) => {

    console.log("");
    console.log("Browser Connected");
    console.log("Connected Clients:", wss.clients.size);
    console.log("");

    client.on("close", () => {

        console.log("");
        console.log("Browser Disconnected");
        console.log("Connected Clients:", wss.clients.size);
        console.log("");

    });

});

/*
==================================================
Broadcast
==================================================
*/

function broadcast(data){

    console.log("Broadcasting:", data);

    wss.clients.forEach((client)=>{

        console.log("Client State:", client.readyState);

        if(client.readyState === WebSocket.OPEN){

            client.send(JSON.stringify(data));

            console.log("Message Sent");

        }

    });

}

/*
==================================================
Keyboard Down
==================================================
*/

uIOhook.on("keydown",(event)=>{

    console.log("");
    console.log("========================");
    console.log("KEY DOWN");
    console.log("========================");

    console.log(event);

    broadcast({

        type:"keydown",

        keycode:event.keycode,

        rawcode:event.rawcode

    });

});

/*
==================================================
Keyboard Up
==================================================
*/

uIOhook.on("keyup",(event)=>{

    console.log("");
    console.log("========================");
    console.log("KEY UP");
    console.log("========================");

    console.log(event);

    broadcast({

        type:"keyup",

        keycode:event.keycode,

        rawcode:event.rawcode

    });

});

/*
==================================================
Start Listening
==================================================
*/

uIOhook.start();

console.log("Keyboard Hook Started");