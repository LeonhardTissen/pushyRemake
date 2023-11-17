let editor_tile = 0;
let editor_held = false;
let editor_x = 0;
let editor_y = 0;

function editorControls() {
    document.getElementById('editorContainer').innerHTML = '';
    Object.keys(tiles).forEach((id) => {
        if (id > 100) {
            return;
        };
        const img = new Image();
        img.src = tiles[id].toDataURL();
        img.classList.add('editorTile');
        img.draggable = false;
        img.onclick = function() {
            editor_tile = parseInt(id);
            document.querySelectorAll('.editorTile').forEach((element) => {
                element.style.opacity = 1;
            });
            this.style.opacity = 0.5;
        };
        document.getElementById('editorContainer').appendChild(img);
    });

    cvs.onmousedown = function(event) {
        editor_x = Math.floor(event.layerX / ts);
        editor_y = Math.floor(event.layerY / ts);
    
        level.ld[editor_y][editor_x] = editor_tile;
        level.render();
    
        editor_held = true;
    };
    
    cvs.onmouseup = function() {
        editor_held = false;
    };
    
    cvs.onmousemove = function(event) {
        editor_x = Math.floor(event.layerX / ts);
        editor_y = Math.floor(event.layerY / ts);
    
        if (!editor_held) {
            return;
        };
    
        level.ld[editor_y][editor_x] = editor_tile;
        level.render();
    }
};