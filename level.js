const con = document.getElementById('levelContainer');
let cvs;
let ctx;
let level;

function generate2Darray(width, height) {
    return Array(height).fill().map(() => Array(width).fill(0));
};

const atlas_coords = {'apple': [0, 0], 'blueball': [32, 0], 'bluecolor': [64, 0], 'bluegoal': [96, 0], 'boulder': [128, 0], 'box': [160, 0], 'boxgoal': [192, 0], 'boxisland': [224, 0], 'boxwater': [256, 0], 'bullet': [288, 0], 'bulletoverlay': [0, 32], 'button': [32, 32], 'diceblue': [64, 32], 'dicegoal': [96, 32], 'dicered': [128, 32], 'diceyellow': [160, 32], 'empty': [192, 32], 'emptysand': [224, 32], 'eventile': [256, 32], 'footprint': [288, 32], 'glower': [0, 64], 'glowoff': [32, 64], 'glowon': [64, 64], 'greenball': [96, 64], 'greencolor': [128, 64], 'greengoal': [160, 64], 'house': [192, 64], 'houseblue': [224, 64], 'housecyan': [256, 64], 'housegray': [288, 64], 'housegreen': [0, 96], 'houseisland': [32, 96], 'houseorange': [64, 96], 'housepink': [96, 96], 'housepurple': [128, 96], 'housered': [160, 96], 'houseyellow': [192, 96], 'inverter': [224, 96], 'key': [256, 96], 'lightning': [288, 96], 'lock': [0, 128], 'newwall': [32, 128], 'oddtile': [64, 128], 'portal': [96, 128], 'pushyblue': [128, 128], 'pushycyan': [160, 128], 'pushyeditor': [192, 128], 'pushygray': [224, 128], 'pushygreen': [256, 128], 'pushyorange': [288, 128], 'pushypink': [0, 160], 'pushypurple': [32, 160], 'pushyred': [64, 160], 'pushyyellow': [96, 160], 'redball': [128, 160], 'redcolor': [160, 160], 'redgoal': [192, 160], 'ring': [224, 160], 'ringblock': [256, 160], 'ringspin': [288, 160], 'speedpower': [0, 192], 'starbox': [32, 192], 'starfish': [64, 192], 'target': [96, 192], 'treeleft': [128, 192], 'treeright': [160, 192], 'wall': [192, 192], 'wallclosed': [224, 192], 'wallopen': [256, 192], 'water': [288, 192]};

const load = function() {
    return new Promise(function(resolve, reject) {
        const atlas = new Image();
        atlas.src = 'tiles/atlas.png';
        atlas.onload = function() {
            const tile_ids = Object.keys(tiles);
            tile_ids.forEach((id) => {
                const tempcvs = document.createElement('canvas');
                tempcvs.width = 32;
                tempcvs.height = 32;
                const tempctx = tempcvs.getContext('2d');
                const coords = atlas_coords[tiles[id]];
                tempctx.drawImage(atlas, coords[0], coords[1], 32, 32, 0, 0, 32, 32);
                tiles[id] = tempcvs;
            });
            resolve();
        }
    })
};

class Level {
    constructor(leveldata = [[0]]) {
        con.innerHTML = '';
        cvs = document.createElement('canvas');
        cvs.id = 'level';
        con.appendChild(cvs);
        ctx = cvs.getContext('2d');
        const width = leveldata[0].length;
        const height = leveldata.length;
        cvs.width = width * ts;
        this.width = width;
        con.style.width = width * ts + 'px';
        cvs.height = height * ts;
        this.height = height;
        con.style.height = height * ts + 'px';
        this.ld = generate2Darray(width, height);
        this.pushys = [];
        this.hash = Math.floor(Math.random() * 1000000);
        this.finished = false;
        this.portals = {primary: false, secondary: false};
        this.activering = false;
        this.connectedrings = [];
        this.buttonpressed = false;
        let spawned_pushys = 0;
        if (leveldata.length !== 0) {
            for (let y = 0; y < leveldata.length; y ++) {
                for (let x = 0; x < leveldata[0].length; x ++) {
                    this.ld[y][x] = leveldata[y][x];

                    // Spawn spots for pushy
                    if (this.ld[y][x] == 50) {
                        this.ld[y][x] = 0;
                        const pushy = new Pushy(this, x, y, ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'], pushyColors[0], this.hash);
                        this.pushys.push(pushy);
                        spawned_pushys ++;
                    };

                    // Portal indexing
                    if (leveldata[y][x] == 10) {
                        if (this.portals.primary === false) {
                            this.portals.primary = {'x': x, 'y': y};
                        } else if (this.portals.secondary === false) {
                            this.portals.secondary = {'x': x, 'y': y};
                        }
                    }
                }   
            }
        };
        this.render();
    };
    update() {
        // Check if there is any button with an object on top
        const buttonpressedbefore = this.buttonpressed;
        this.buttonpressed = false;
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                // Check if there is a button occupied by any movable object
                if ([203, 204, 206, 208].includes(this.ld[y][x])) {
                    this.buttonpressed = true;
                }
            }
        };
        // Play the sound if the state changed from what it was
        if (buttonpressedbefore != this.buttonpressed) {
            playSound('button');
        };

        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                // Replace all button wall tiles
                if ([15,16].includes(this.ld[y][x])) {
                    this.ld[y][x] = (this.buttonpressed ? 16 : 15);
                }
            }
        };
    };
    render() {
        this.update();

        // Disable image smoothing
        ctx.imageSmoothingEnabled = false;

        // Draw all the tiles from the level data
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                const tile_id = this.ld[y][x];
                ctx.drawImage(tiles[tile_id], x * ts, y * ts, ts, ts)
            }
        };
        // Draw a red line between connected rings
        this.connectedrings.forEach((connection) => {
            ctx.strokeStyle = '#D00';
            ctx.lineWidth = px;
            const px = ts / 32;
            ctx.beginPath();
            ctx.setLineDash([px * 5, px * 5]);
            ctx.moveTo(connection[0][0] * ts + ts / 2, connection[0][1] * ts + ts / 2);
            ctx.lineTo(connection[1][0] * ts + ts / 2, connection[1][1] * ts + ts / 2);
            ctx.stroke();
        });
    };
    export() {
        // Render pushys as start points
        this.pushys.forEach((pushy) => {
            this.ld[pushy.y][pushy.x] = 50;
        });

        // Generate a string with the level data
        let out = '[';
        for (let y = 0; y < this.height; y ++) {
            out += '[';
            for (let x = 0; x < this.width; x ++) {
                out += this.ld[y][x];
                out += ',';
            };
            out = out.slice(0, -1);
            out += '],';
        };
        out = out.slice(0, -1);
        out += ']';

        console.log(out);
    };
    wipe() {
        for (let y = 1; y < this.height - 1; y ++) {
            for (let x = 1; x < this.width - 1; x ++) {
                this.ld[y][x] = 0;
            };
        };
        this.render();
    };
    finish() {
        document.getElementById('winContainer').style.display = 'block';
        this.finished = true;
    }
};

function nextLevel() {
    document.getElementById('winContainer').style.display = 'none';
};
