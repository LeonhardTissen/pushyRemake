// let active_pushys = [
//     {color: pushyColors[0], controls: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']},
//     {color: pushyColors[1], controls: ['w', 'd', 's', 'a']},
//     {color: pushyColors[2], controls: ['t', 'h', 'g', 'f']},
//     {color: pushyColors[3], controls: ['i', 'l', 'k', 'j']}
// ];

function mobileMove(key) {
    document.body.requestFullscreen();
    level.pushys.forEach((pushy) => {
        pushy.move(key);
    })
};

class Pushy {
    constructor(level, x, y, controls, color = 'green') {
        this.level = level;
        this.x = x;
        this.y = y;
        this.controls = controls;
        this.orientation = 0;
        this.color = color;
        const color_additive = pushyColors.indexOf(color);
        this.img = tiles[10000 + color_additive];
        this.img.classList.add('pushy');
        this.img.style.filter = '';
        this.img.style.opacity = 1;
        this.footprint = false;
        this.keys = 0;
        this.electrocuted = false;
        this.cancontrol = true;
        this.holdingbullet = false;
        this.inverted = false;
        this.speedpower = false;
        this.hash = level.hash;
        con.appendChild(this.img);
        this.render();
        window.addEventListener('keydown', (event) => this.move(event.key));
    };
    move(key) {
        if (!this.cancontrol || level.finished || this.hash !== level.hash) {

            if (level.finished && [' ','Enter'].includes(key)) {
                nextLevel();
            };
            return;
        };

        // Convert the key stroke to an orientation
        let orientation = this.controls.indexOf(key);
        if (orientation === -1) {
            return;
        };

        // Turn 180deg if inverted
        if (this.inverted) {
            orientation += 2;
            orientation = orientation % 4;
        };

        // Coordinate changes based on direction
        let diff_x = 0;
        let diff_y = 0;
        switch(orientation) {
            case 0:
                diff_y --;
                break;
            case 1:
                diff_x ++;
                break;
            case 2:
                diff_y ++;
                break;
            case 3:
                diff_x --;
                break;
        };

        let can_move = false;
        let will_win = false;
        let will_teleport = false;

        // The tile pushy is moving into
        const one_x = this.x + diff_x;
        const one_y = this.y + diff_y;

        // The tile behind that tile (Used for pushing objects)
        const two_x = this.x + diff_x * 2;
        const two_y = this.y + diff_y * 2;

        // Prevent walking off edge because it causes an error
        if (one_x < 0 || one_y < 0) {
            return;
        };
        if (one_x >= level.ld[0].length || one_y >= level.ld.length) {
            return;
        };

        const target = level.ld[one_y][one_x];
        switch (target) {
            case 0: // Empty
                if (this.footprint) {
                    level.ld[one_y][one_x] = 12;
                    level.render();
                };
                can_move = true;
                break;
            case 5: // Ball goals
            case 7:
            case 9:
            case 11: // Unoccupied Box goal
            case 14: // Button
            case 16: // Open button wall
            case 17: // Ball colors
            case 18:
            case 19:
            case 31: // Dice goal
            case 33: // Ring spinning
                can_move = true;
                break;
            case 1: // Wall
                break;
            case 2: // House
            case 51: // House of colors
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 58:
            case 59:
                let correct_house = false;
                if (target == 2) {
                    can_move = true;
                    correct_house = true;
                } else if (assigned_houses[target] == this.color) {
                    can_move = true;
                    correct_house = true;
                } else {
                    can_move = false;
                };

                if (correct_house) {
                    will_win = true;
                    for (let y = 0; y < level.ld.length; y ++) {
                        for (let x = 0; x < level.ld[0].length; x ++) {
                            // Check for uncleared conditions
                            if ([11,13,4,104,204,304,404,6,106,206,306,406,8,108,208,308,408,24,124,224,324,424,27,127,227,327,427,128,129,130,428,430,31,32,33].includes(level.ld[y][x])) {
                                will_win = false;
                            }
                        }
                    };
                };
                break;
            case 3: // Box
            case 103: // Occupied box goals by box
            case 203: // Occupied button by box
            case 303: // Occupied button wall by box
            case 403: // Occupied dice goal by box
            case 4: // Balls
            case 104: // Occupied box goals by balls
            case 204: // Occupied buttons by balls
            case 304: // Occupied button wall by balls
            case 404: // Occupied dice goal by balls
            case 6:
            case 106:
            case 206:
            case 306:
            case 406:
            case 8:
            case 108:
            case 208:
            case 308:
            case 408:
            case 24: // Target
            case 124:
            case 224:
            case 324:
            case 424:
            case 27: // Starbox
            case 127:
            case 227:
            case 327:
            case 427:
            case 28: // Dice blue
            case 128:
            case 228:
            case 328:
            case 428:
            case 29: // Dice red
            case 129:
            case 229:
            case 329:
            case 429:
            case 30: // Dice yellow
            case 130:
            case 230:
            case 330:
            case 430:
                let left_behind = 0;

                if (this.footprint) {
                    left_behind = 12;
                };

                let new_target = level.ld[one_y][one_x];

                // Box goal conversion
                if (target > 100 && target < 200) {
                    left_behind = 11;
                    new_target -= 100;
                };

                // Button conversion
                if (target > 200 && target < 300) {
                    left_behind = 14;
                    new_target -= 200;
                };

                // Button wall conversion
                if (target > 300 && target < 400) {
                    left_behind = 16;
                    new_target -= 300;
                };

                // Dice goal conversion
                if (target > 400 && target < 500) {
                    left_behind = 31;
                    new_target -= 400;
                };

                if ([0, 11, 14, 16, 31].includes(level.ld[two_y][two_x])) {
                    // Simply move the object one tile forward
                    can_move = true;

                    // Convert tile if pushed onto boxgoal
                    if (level.ld[two_y][two_x] === 11) {
                        new_target += 100;
                    };

                    // Convert tile if pushed onto button
                    if (level.ld[two_y][two_x] === 14) {
                        new_target += 200;
                    };

                    // Convert tile if pushed onto button wall
                    if (level.ld[two_y][two_x] === 16) {
                        new_target += 300;
                    };

                    // Convert tile if pushed onto dice goal
                    if (level.ld[two_y][two_x] === 31) {
                        new_target += 400;
                    };

                    // Cycle dice
                    let dice_sound = false;
                    if ([29,30].includes(new_target % 100)) {
                        new_target --;
                        dice_sound = 'dicepush';
                    } else if ([28].includes(new_target % 100)) {
                        new_target += 2;
                        dice_sound = 'dicepush';
                    };
                    // If dice is red and on dice goal
                    if (new_target == 429) {
                        dice_sound = 'dicegoal';
                    };
                    // Play the sound when moving dice
                    if (dice_sound) {
                        playSound(dice_sound);
                    };

                    // Starbox logic
                    if (new_target % 100 === 27) {
                        let adjacent_boxes = [];
                        const adjacent_tiles = [[-1,0],[1,0],[0,1],[0,-1]];
                        adjacent_tiles.forEach((neighbour) => {
                            if (level.ld[two_y + neighbour[1]][two_x + neighbour[0]] == 27) {
                                adjacent_boxes.push([two_x + neighbour[0], two_y + neighbour[1]]);
                            };
                        });
                        if (adjacent_boxes.length > 1) {
                            new_target = 0;
                            adjacent_boxes.forEach((box) => {
                                level.ld[box[1]][box[0]] = 0;
                            })
                        };
                    };
                    
                    level.ld[two_y][two_x] = new_target;
                    level.ld[one_y][one_x] = left_behind;
                    level.render();
                };

                // Push ball into appropriate goal
                if ([4, 6, 8].includes(new_target) && new_target + 1 == level.ld[two_y][two_x]) {
                    can_move = true;
                    level.ld[one_y][one_x] = left_behind;
                    level.render();
                    playSound('ball');
                };

                // Push ball into color
                if ([4, 6, 8].includes(new_target) && [17,18,19].includes(level.ld[two_y][two_x])) {
                    can_move = true;
                    level.ld[one_y][one_x] = left_behind;

                    // Change the color of the ball
                    let new_ball_color;
                    switch(level.ld[two_y][two_x]) {
                        case 17:
                            new_ball_color = 4;
                            break;
                        case 18:
                            new_ball_color = 6;
                            break;
                        case 19:
                            new_ball_color = 8;
                            break;
                    };
                    level.ld[two_y][two_x] = new_ball_color;

                    level.render();
                    playSound('color');
                };
                break;
            case 10: // Portal
                can_move = true;
                will_teleport = true;
                break;
            case 12: // Footprint
                can_move = true;
                if (!this.footprint) {
                    playSound('footprint');
                };
                this.footprint = true;
                break;
            case 13: // Apple
                can_move = true;

                // Eat the apple
                level.ld[one_y][one_x] = (this.footprint ? 12 : 0);
                level.render();
                playSound('apple');
                break;
            case 20: // Lightning
                can_move = true;
                if (!this.electrocuted) {
                    this.electrocuted = true;
                    playSound('electro');
                    this.img.style.filter = 'brightness(0.5)';
                } else {
                    this.cancontrol = false;
                    playSound('electrodeath');
                    this.img.style.opacity = 0.5;
                };
                break;
            case 21: // Key
                can_move = true;
                this.keys ++;
                level.ld[one_y][one_x] = 0;
                playSound('key');
                level.render();
                break;
            case 22: // Lock
                if (this.keys > 0) {
                    this.keys --;
                    level.ld[one_y][one_x] = 0;
                    can_move = true;
                    playSound('door');
                    level.render();
                };
                break;
            case 23: // Bullet
                can_move = true;
                level.ld[one_y][one_x] = 0;
                if (!this.holdingbullet) {
                    tiles[35].id = 'bulletfor' + this.color;
                    tiles[35].style.display = 'absolute';
                    tiles[35].style.transition = '';
                    con.appendChild(tiles[35]);
                };
                this.holdingbullet = true;
                playSound('bullet');
                level.render();
                break;
            case 25: // Inverter
                can_move = true;
                this.inverted = true;
                level.ld[one_y][one_x] = 0;
                playSound('invert');
                level.render();
                break;
            case 26: // Speed power
                can_move = true;
                this.speedpower = true;
                level.ld[one_y][one_x] = 0;
                playSound('invert');
                level.render();
                this.img.style.transition = 'top 0.1s linear, left 0.1s linear';
                break;
            case 32: // Ring
                can_move = true;
                level.ld[one_y][one_x] = 33;
                const new_ring = [one_x, one_y];
                if (level.activering) {
                    // Remember connection to render a line
                    level.connectedrings.push([level.activering, new_ring]);
                    // Set to ring blocks
                    level.ld[level.activering[1]][level.activering[0]] = 34;
                    level.ld[new_ring[1]][new_ring[0]] = 34;
                    playSound('line2');
                    level.activering = false;
                } else {
                    playSound('line1');
                    level.activering = new_ring;
                };
                level.render();
                break;
        };
        if (can_move) {
            this.x += diff_x;
            this.y += diff_y;
        };
        if (will_teleport) {
            if (level.portals.primary.x === this.x && level.portals.primary.y === this.y) {
                // Go in secondary portal if primary portal was entered
                if (level.portals.secondary) {
                    this.x = level.portals.secondary.x;
                    this.y = level.portals.secondary.y;
                }
            } else {
                // Otherwise go to primary portal
                this.x = level.portals.primary.x;
                this.y = level.portals.primary.y;
            };
            playSound('portal');
        };
        if (will_win) {
            playSound('win');
            level.finish();
        };
        this.orientation = orientation;
        this.render();

        if (this.speedpower && can_move) {
            this.move(key);
        };
    };
    render() {
        this.img.style.top = this.y * ts + 'px';
        this.img.style.left = this.x * ts + 'px';
        this.img.style.transform = `rotateZ(${this.orientation * 90}deg)`;
        if (this.holdingbullet) {
            const bullet = document.getElementById('bulletfor' + this.color);
            bullet.style.left = this.x * ts + 'px';
            bullet.style.top = this.y * ts + 'px';
        }
    };
    destroy() {
        this.destroy = true;
    }
};
