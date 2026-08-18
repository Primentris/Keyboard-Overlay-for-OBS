/*
==================================================
Monkey Keyboard Overlay
script.js

Version 2

This script does four things.

1. Builds the keyboard.

2. Creates a lookup table.

3. Connects to the WebSocket server.

4. Highlights keys.
==================================================
*/

/*
==================================================
HTML Containers
==================================================
*/

const leftKeyboard = document.getElementById("leftKeyboard");

const rightKeyboard = document.getElementById("rightKeyboard");

/*
==================================================
Save every generated key here.

Instead of searching the page every time
a key is pressed, we save references.

Example

keyLookup["a"]

returns the A key instantly.
==================================================
*/

const keyLookup = {};

/*
==================================================
Keyboard Layout

Each key has

label
key
width
==================================================
*/

const leftLayout = [

[
{label:"Esc",key:"Escape"},
{label:"F1",key:"F1"},
{label:"F2",key:"F2"},
{label:"F3",key:"F3"},
{label:"F4",key:"F4"},
{label:"F5",key:"F5"}
],

[
{label:"`",key:"`"},
{label:"1",key:"1"},
{label:"2",key:"2"},
{label:"3",key:"3"},
{label:"4",key:"4"},
{label:"5",key:"5"},
{label:"6",key:"6"}
],

[
{label:"Tab",key:"Tab",width:1.5},
{label:"Q",key:"q"},
{label:"W",key:"w"},
{label:"E",key:"e"},
{label:"R",key:"r"},
{label:"T",key:"t"}
],

[
{label:"Caps",key:"CapsLock",width:1.8},
{label:"A",key:"a"},
{label:"S",key:"s"},
{label:"D",key:"d"},
{label:"F",key:"f"},
{label:"G",key:"g"}
],

[
{label:"Shift",key:"Shift",width:2.3},
{label:"Z",key:"z"},
{label:"X",key:"x"},
{label:"C",key:"c"},
{label:"V",key:"v"},
{label:"B",key:"b"}
],

[
{label:"Ctrl",key:"Control"},
{label:"Win",key:"Meta"},
{label:"Alt",key:"Alt"},
{label:"Space",key:" ",width:4}
]

];

const rightLayout = [

[
{label:"F6",key:"F6"},
{label:"F7",key:"F7"},
{label:"F8",key:"F8"},
{label:"F9",key:"F9"},
{label:"F10",key:"F10"},
{label:"F11",key:"F11"},
{label:"F12",key:"F12"},
{label:"Del",key:"Delete"}
],

[
{label:"7",key:"7"},
{label:"8",key:"8"},
{label:"9",key:"9"},
{label:"0",key:"0"},
{label:"-",key:"-"},
{label:"=",key:"="},
{label:"Back",key:"Backspace",width:2}
],

[
{label:"Y",key:"y"},
{label:"U",key:"u"},
{label:"I",key:"i"},
{label:"O",key:"o"},
{label:"P",key:"p"},
{label:"[",key:"["},
{label:"]",key:"]"},
{label:"\\",key:"\\"}
],

[
{label:"H",key:"h"},
{label:"J",key:"j"},
{label:"K",key:"k"},
{label:"L",key:"l"},
{label:";",key:";"},
{label:"'",key:"'"},
{label:"Enter",key:"Enter",width:2}
],

[
{label:"N",key:"n"},
{label:"M",key:"m"},
{label:",",key:","},
{label:".",key:"."},
{label:"/",key:"/"},
{label:"Shift",key:"Shift",width:3.3}
],

[
{label:"Space",key:" ",width:4},
{label:"Alt",key:"Alt"},
{label:"Fn",key:"Fn"},
{label:"Menu",key:"ContextMenu"},
{label:"Ctrl",key:"Control"}
]

];

/*
==================================================
Build one keyboard half

This function creates every key and stores
references to it inside keyLookup.
==================================================
*/

function buildKeyboard(container, layout){

    layout.forEach(function(row){

        const rowDiv = document.createElement("div");

        rowDiv.className = "row";

        row.forEach(function(keyData){

            const key = document.createElement("div");

            key.className = "key";

            key.textContent = keyData.label;

            key.dataset.key = keyData.key;

            /*
                Apply custom widths.
            */

            if(keyData.width){

                key.style.width = (52 * keyData.width) + "px";

            }

            /*
                Save this key so we can
                instantly find it later.
            */

            if(!keyLookup[keyData.key]){

                keyLookup[keyData.key] = [];

            }

            keyLookup[keyData.key].push(key);

            rowDiv.appendChild(key);

        });

        container.appendChild(rowDiv);

    });

}

/*
==================================================
Generate both halves
==================================================
*/

buildKeyboard(leftKeyboard, leftLayout);

buildKeyboard(rightKeyboard, rightLayout);

/*
==================================================
Connect to server
==================================================
*/

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = function(){

    console.log("Connected.");

};

/*
==================================================
uIOhook keycodes

Only the keys we currently display.
==================================================
*/

const keyMap = {

    /* Escape */
    1:"Escape",

    /* Number Row */
    2:"1",
    3:"2",
    4:"3",
    5:"4",
    6:"5",
    7:"6",
    8:"7",
    9:"8",
    10:"9",
    11:"0",
    12:"-",
    13:"=",
    14:"Backspace",

    /* Tab Row */
    15:"Tab",
    16:"q",
    17:"w",
    18:"e",
    19:"r",
    20:"t",
    21:"y",
    22:"u",
    23:"i",
    24:"o",
    25:"p",
    26:"[",
    27:"]",
    43:"\\",

    /* Home Row */
    28:"Enter",
    29:"Control",
    3613:"Control",

    30:"a",
    31:"s",
    32:"d",
    33:"f",
    34:"g",
    35:"h",
    36:"j",
    37:"k",
    38:"l",
    39:";",
    40:"'",
    41:"`",

    /* Bottom Row */
    42:"Shift",
    54:"Shift",

    44:"z",
    45:"x",
    46:"c",
    47:"v",
    48:"b",
    49:"n",
    50:"m",
    51:",",
    52:".",
    53:"/",

    /* Alt */
    56:"Alt",
    3640:"Alt",

    /* Space */
    57:" ",

    /* Caps */
    58:"CapsLock",

    /* Windows */
    3675:"Meta",
    3676:"Meta",

    /* Delete */
    3667:"Delete",

    /* Function Keys */
    59:"F1",
    60:"F2",
    61:"F3",
    62:"F4",
    63:"F5",
    64:"F6",
    65:"F7",
    66:"F8",
    67:"F9",
    68:"F10",
    87:"F11",
    88:"F12"

};

/*
==================================================
Receive messages
==================================================
*/

socket.onmessage = function(event){

    const data = JSON.parse(event.data);

    const key = keyMap[data.keycode];

    if(!key){

        return;

    }

    const elements = keyLookup[key];

    if(!elements){

        return;

    }

    elements.forEach(function(element){

        if(data.type === "keydown"){

            element.classList.add("active");

        }

        else{

            element.classList.remove("active");

        }

    });

};