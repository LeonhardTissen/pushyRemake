let current_level = 1;
let current_world = '';

load().then(() => {
    resetGUI(false);
});

function resetGUI() {
    level = new Level(levels['level' + current_world + current_level]);
    document.getElementById('winContainer').style.display = 'none';
    const title = document.getElementById('levelTitleNumber');
    title.innerText = current_level;
    const levelid = document.getElementById('levelID');
    levelid.innerText = current_level;
    playSound('gui');
};

function nextLevel() {
    if (current_level >= 135) {
        return;
    };
    current_level ++;
    resetGUI();
};

function previousLevel() {
    if (current_level <= 0) {
        return;
    };
    current_level --;
    resetGUI();
};

function goToWorld(world = '') {
    current_world = world;
    current_level = 1;
    resetGUI();
};

function goToLevel(level = prompt('Level eingeben:'), emit = true) {
    if ([null,''].includes(level)) {
        return;
    };
    current_level = parseInt(level);
    resetGUI();
};

document.body.onkeydown = function(event) {
    if (event.key === 'q') {
        editorControls();
        document.getElementById('editorContainer').style.display = 'block';
    } else if (event.key === 'r') {
        if (!confirm('Willst du neu starten?')) {
            return;
        };
        resetGUI();
    } else if (event.key === ' ') {
        level.pushys.forEach((pushy) => {
            if (!pushy.holdingbullet) {
                return;
            };
            playSound('shoot');
            pushy.holdingbullet = false;
            const bullet = document.getElementById('bulletfor' + pushy.color);
            let bullet_x = pushy.x;
            let bullet_y = pushy.y;
            actively_flying_bullet = true;
            while (actively_flying_bullet) {
                switch (pushy.orientation) {
                    case 0:
                        bullet_y --;
                        break;
                    case 1:
                        bullet_x ++;
                        break;
                    case 2:
                        bullet_y ++;
                        break;
                    case 3:
                        bullet_x --;
                        break;
                };
                const target = level.ld[bullet_y][bullet_x];
                switch (target) {
                    case 1:
                    case 15:
                    case 22:
                        actively_flying_bullet = false;
                        break;
                    case 24:
                        level.ld[bullet_y][bullet_x] = 0;
                        break;
                    case 124:
                        level.ld[bullet_y][bullet_x] = 11;
                        break;
                    case 224:
                        level.ld[bullet_y][bullet_x] = 14;
                        break;
                    case 324:
                        level.ld[bullet_y][bullet_x] = 16;
                        break;
                }
            };
            bullet.style.transition = 'all 0.1s linear';
            setTimeout(function() {
                bullet.style.left = bullet_x * ts + 'px';
                bullet.style.top = bullet_y * ts + 'px';
            }, 1);
            setTimeout(function() {
                bullet.remove();
            }, 100);
            level.render();
        })
    }
};
