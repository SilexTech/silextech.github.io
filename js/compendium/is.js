/* BEGIN: canvas and matrix setup */
let map_canvas = document.getElementById('search-algorithm-canvas');
let map_context = map_canvas.getContext('2d');
let node = document.getElementById('node-radio');
let edge = document.getElementById('edge-radio');
let matrix = null;
let graph = null;
let node_count = 0;
let square_side = map_canvas.width / 12;
map_canvas.height = map_canvas.width * 8/12; // 8 cells tall, 12 cells wide

function resetCanvas() {
    map_context.clearRect(0, 0, map_canvas.width, map_canvas.height);
    for (let x = 0; x <= 12; x++) {
        map_context.moveTo(x * map_canvas.width / 12, 0);
        map_context.lineTo(x * map_canvas.width / 12, map_canvas.height);
    }
    for (let y = 0; y <= 8; y++) {
        map_context.moveTo(0, y * map_canvas.height / 8);
        map_context.lineTo(map_canvas.width, y * map_canvas.height / 8);
    }
    map_context.strokeStyle = '#DDDDDD';
    map_context.stroke();
}

function resetMatrix() {
    matrix = new Array(8);
    for (let i = 0; i < 8; i++) {
        matrix[i] = new Array(12);
    }
}

function reset() {
    resetCanvas();
    resetMatrix();
}
/* END: canvas and matrix setup */

/* BEGIN: precise mouse click */
// Source: https://stackoverflow.com/questions/10449890/detect-mouse-click-location-within-canvas
let stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(map_canvas, null)['paddingLeft'], 10)      || 0;
let stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(map_canvas, null)['paddingTop'], 10)       || 0;
let styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(map_canvas, null)['borderLeftWidth'], 10)  || 0;
let styleBorderTop   = parseInt(document.defaultView.getComputedStyle(map_canvas, null)['borderTopWidth'], 10)   || 0;
// Some pages have fixed-position bars at the top or left of the page
// They will mess up mouse coordinates and this fixes that
let html = document.body.parentNode;
htmlTop = html.offsetTop;
htmlLeft = html.offsetLeft;
// Creates an object with x and y defined,
// set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky,
// we have to worry about padding and borders
// takes an event and a reference to the canvas
function getMouse(e, canvas) {
    let element = canvas, offsetX = 0, offsetY = 0, mx, my;
    // Compute the total offset. It's possible to cache this if you want
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }
    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar (like the stumbleupon bar)
    // This part is not strictly necessary, it depends on your styling
    offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
    offsetY += stylePaddingTop + styleBorderTop + htmlTop;
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    // We return a simple javascript object with x and y defined
    return {x: mx, y: my};
}
/* END: precise mouse click */

/* BEGIN: map creation */
function canvasOnMouseDown(e) {
    let coordinates = getMouse(e, map_canvas);
    // canvas.width/.height return the default canvas size, 300x150
    let i = Math.floor(coordinates.y / (map_canvas.getBoundingClientRect().height / 8));
    let j = Math.floor(coordinates.x / (map_canvas.getBoundingClientRect().width / 12));
    if (node.checked && matrix[i][j] === undefined) {
        drawNode(i, j);
        matrix[i][j] = new Node(String.fromCharCode('A'.charCodeAt(0) + node_count++), i, j);
        console.log(matrix[i][j]);
    }
    else if (edge.checked && matrix[i][j] === undefined) {
        drawEdge(i, j);
        matrix[i][j] = 'e';
    }
}

function drawNode(i, j) {
    map_context.fillStyle = '#444444';
    map_context.fillRect(j * square_side, i * square_side, square_side, square_side);
}

function drawEdge(i, j) {
    map_context.fillStyle = "#DDDDDD";
    map_context.fillRect(
        j * square_side + square_side/4,
        i * square_side + square_side / 4,
        square_side / 2 ,
        square_side / 2
    );
}
/* END: map creation */

/* BEGIN: side-panel inputs */
function validateCheckbox() {
    let select = document.getElementById('algorithm');
    let checkbox = document.getElementById('dynamic');
    checkbox.disabled = !(select.value === 'bnb' || select.value === 'a*');
}

function createGraph() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 12; j++) {
            if (matrix[i][j] !== undefined && matrix[i][j].constructor.name === 'Node') {

            }
        }
    }
}

function runAlgorithm() {
    createGraph();
}
/* END: side-panel inputs */

/* BEGIN: graph */
class Node {
    constructor(name, i, j, heuristic = 0) {
        this.name = name;
        this.i = i;
        this.j = j;
        this.heuristic = heuristic;
        this.edges = [];
    }
    addEdge(edge) {
        let e = edge;
        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i].node === edge.node ) {} // TODO: add an edge only if there is no (shorter) path yet

        }
    }
}

class Edge {
    constructor(node, length) {
        this.node = node;
        this.length = length;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
    }
    addNode(node) {
        let n = this.nodes.find(node);
        if (!n) {
            this.nodes.push(node);
        }
    }
}
/* END: graph */

// Function bindings:
map_canvas.addEventListener('mousedown', canvasOnMouseDown);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('algorithm').addEventListener('change', validateCheckbox);
document.getElementById('play').addEventListener('click', runAlgorithm);

// Setup:
resetCanvas();
resetMatrix();