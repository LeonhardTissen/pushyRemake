const audio_path_prefix = '/audio/';
const audio_path_suffix = '.wav';

function loadWav(name) {
    const audio = new Audio();
    audio.src = audio_path_prefix + name + audio_path_suffix;
    return audio;
};
function loadWavs(name, start, finish) {
    const audios = [];
    for (let i = start; i <= finish; i ++) {
        const audio = new Audio();
        audio.src = audio_path_prefix + name + i + audio_path_suffix;
        audios.push(audio);
    };
    return audios;
};

const audio = {
    portal: loadWav('Beamer'),
    ball: loadWav('Kugel'),
    apple: loadWav('Apfel'),
    color: loadWav('Fleck'),
    button: loadWav('Knopf2'),
    footprint: loadWav('Spur'),
    gui: loadWav('knopf'),
    key: loadWav('Schlüssel'),
    door: loadWav('Tür'),
    electro: loadWav('Electric'),
    electrodeath: loadWav('Electric2'),
    bullet: loadWav('Munition'),
    shoot: loadWav('Munition2'),
    invert: loadWav('blind'),
    dicepush: loadWav('Würfel'),
    dicegoal: loadWav('WürfelZiel'),
    line1: loadWav('Linie1'),
    line2: loadWav('Linie2'),
    win: loadWavs('Pushy', 1, 23)
};

function playSound(name) {
    let file;
    if (audio[name].length === undefined) {
        file = audio[name];
    } else {
        // Play a random sound from a range
        file = audio[name][Math.floor(Math.random() * audio[name].length)];    
    };
    file.pause();
    file.currentTime = 0;
    file.play();
};
