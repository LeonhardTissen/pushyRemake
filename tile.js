const hash = parseInt(window.location.hash.replace('#',''));
const ts = (hash ? hash : 32);

function resizeCanvas() {
    try {
        const cw = level.ld[0].length * 32;
        const ch = level.ld.length * 32;
        if (window.innerWidth > cw * 2 && window.innerHeight > ch * 2) {
            con.style.transform = `scale(2) translate(-50%, -50%)`;
            con.style.transformOrigin = 'top left';
        } else if (window.innerWidth < cw || window.innerHeight < ch) {
            const scale = Math.min(window.innerWidth / cw, window.innerHeight / ch);
            con.style.transform = `scale(${scale}) translate(-50%, -50%)`;
            con.style.transformOrigin = 'top left';
        } else {
            con.style.transform = `scale(1) translate(-50%, -50%)`;
            con.style.transformOrigin = 'top left';
        }
    } catch (err) {}
};
document.body.onresize = resizeCanvas;
resizeCanvas();
setTimeout(resizeCanvas, 1000);

const assigned_houses = {};

const tiles = {
    50: 'pushyeditor',
    0: 'empty',
    1: 'wall',
    2: 'house',
    3: 'box',
    103: 'box', // on Boxgoal
    203: 'box', // on Button
    303: 'box', // on Buttonwall
    403: 'box', // on Dicegoal
    4: 'greenball',
    5: 'greengoal',
    104: 'greenball', // on Boxgoal
    204: 'greenball', // on Button
    304: 'greenball', // on Buttonwall
    404: 'greenball', // on Dicegoal
    6: 'redball',
    7: 'redgoal',
    106: 'redball', // on Boxgoal
    206: 'redball', // on Button
    306: 'redball', // on Buttonwall
    406: 'redball', // on Dicegoal
    8: 'blueball',
    9: 'bluegoal',
    108: 'blueball', // on Boxgoal
    208: 'blueball', // on Button
    308: 'blueball', // on Buttonwall
    408: 'blueball', // on Dicegoal
    10: 'portal',
    11: 'boxgoal', // Unoccupied
    12: 'footprint',
    13: 'apple',
    14: 'button',
    15: 'wallclosed',
    16: 'wallopen',
    17: 'greencolor',
    18: 'redcolor',
    19: 'bluecolor',
    20: 'lightning',
    21: 'key',
    22: 'lock',
    23: 'bullet',
    24: 'target',
    124: 'target', // on Boxgoal
    224: 'target', // on Button
    324: 'target', // on Buttonwall
    424: 'target', // on Dicegoal
    25: 'inverter',
    26: 'speedpower',
    27: 'starbox',
    127: 'starbox',
    227: 'starbox',
    327: 'starbox',
    427: 'starbox',
    28: 'diceblue',
    128: 'diceblue',
    228: 'diceblue',
    328: 'diceblue',
    428: 'diceblue',
    29: 'dicered',
    129: 'dicered',
    229: 'dicered',
    329: 'dicered',
    429: 'dicered',
    30: 'diceyellow',
    130: 'diceyellow',
    230: 'diceyellow',
    330: 'diceyellow',
    430: 'diceyellow',
    31: 'dicegoal',
    32: 'ring',
    33: 'ringspin',
    34: 'ringblock',
    35: 'bulletoverlay'
};

const pushyColors = ['green', 'yellow', 'orange', 'red', 'pink', 'purple', 'blue', 'cyan', 'gray'];

let tindex = 0;
pushyColors.forEach((color) => {
    tiles[51 + tindex] = 'house' + color;
    assigned_houses[51 + tindex] = color;
    tiles[10000 + tindex] = 'pushy' + color;
    tindex ++;
});