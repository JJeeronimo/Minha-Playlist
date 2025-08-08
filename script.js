document.addEventListener('DOMContentLoaded', () => {
    const cdPlayerWindow = document.getElementById('cdPlayerWindow');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');
    const nextButton = document.getElementById('nextTrackButton');
    const previousButton = document.getElementById('previousTrackButton');
    const ejectButton = document.getElementById('ejectButton');
    const timeDisplay = document.getElementById('text2');
    const totalPlayDisplay = document.querySelector('.status-bar-field:first-child');
    const trackTimeDisplay = document.querySelector('.status-bar-field:last-child');
    const volumeControl = document.querySelector('.volume-control');
    const volumeSlider = document.getElementById('volumeSlider');
    const fileInput = document.getElementById('fileInput');
    const menuAddMusic = document.getElementById('menuAddMusic');
    
    const playlist = [
        { artist: "Devon Hendryx", title: "Missing Image File", url: "https://github.com/JJeeronimo/Minha-Playlist/raw/main/dados/Missing%20image%20file..mp3", albumCoverUrl: "https://m.media-amazon.com/images/I/71NmRa8Sp7L._AC_SL1500_.jpg" },
        { artist: "Radiohead", title: "Jigsaw Falling Into Place", url: "https://github.com/JJeeronimo/Minha-Playlist/raw/main/dados/Radiohead%20-%20Jigsaw%20Falling%20into%20Place%20%5BHD%5D.mp3", albumCoverUrl: "https://m.media-amazon.com/images/I/A1MwaIeBpwL._AC_SX679_.jpg" },
        { artist: "Death Grips", title: "I've Seen Footage", url: "https://github.com/JJeeronimo/Minha-Playlist/raw/refs/heads/main/dados/Death%20Grips%20-%20I've%20Seen%20Footage.mp3", albumCoverUrl: "https://imusic.b-cdn.net/images/item/original/119/0886919635119.jpg?death-grips-2012-the-money-store-lp&class=scaled&v=1647319621" },
        { artist: "Dean Blunt", title: "19 (feat. A$AP Rocky & Sauce Walka)", url: "https://github.com/JJeeronimo/Minha-Playlist/raw/main/dados/19.mp3", albumCoverUrl: "https://m.media-amazon.com/images/I/41BhfHxlbIL._UX358_FMwebp_QL85_.jpg" },
        { artist: "Ecco2k", title: "Fragile", url: "https://github.com/JJeeronimo/Minha-Playlist/raw/main/dados/Ecco2K%20-%20Fragile%20(Official%20Audio).mp3", albumCoverUrl: "https://lastfm.freetls.fastly.net/i/u/770x0/a15ce3e3c915faa4b90d6fb155359506.jpg#a15ce3e3c915faa4b90d6fb155359506" }
    ];
    
    const audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isContinuous = true;
    
    function updateDisplay(isEjected = false) {
        const root = document.documentElement;
        if (isEjected) {
            root.style.setProperty('--artist', `"No Disc"`);
            root.style.setProperty('--title', `""`);
            root.style.setProperty('--albumcover', `none`);
            timeDisplay.textContent = `[--] --:--`;
            totalPlayDisplay.textContent = 'Total Play: --:-- m:s';
            trackTimeDisplay.textContent = 'Track: --:-- m:s';
        } else {
            const currentTrack = playlist[currentTrackIndex];
            root.style.setProperty('--artist', `"${currentTrack.artist}"`);
            root.style.setProperty('--title', `"${currentTrack.title}"`);
            root.style.setProperty('--albumcover', `url('${currentTrack.albumCoverUrl}')`);
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function playMusic() {
        if (!audio.src || audio.src.includes('about:blank')) {
            loadTrack(0, true);
        } else {
            audio.play();
            isPlaying = true;
        }
    }

    function pauseMusic() { audio.pause(); isPlaying = false; }
    
    function stopMusic() {
        audio.pause(); audio.currentTime = 0; isPlaying = false;
        timeDisplay.textContent = `[${String(currentTrackIndex + 1).padStart(2, '0')}] 00:00`;
        trackTimeDisplay.textContent = `Track: 00:00 m:s`;
    }
    
    function loadTrack(trackIndex, autoplay = false) {
        currentTrackIndex = trackIndex;
        audio.src = playlist[currentTrackIndex].url;
        updateDisplay();
        if (autoplay) {
            audio.play(); isPlaying = true;
        }
    }

    function nextTrack() {
        let newIndex;
        if (isShuffle) {
            do { newIndex = Math.floor(Math.random() * playlist.length); } while (playlist.length > 1 && newIndex === currentTrackIndex);
        } else {
            newIndex = (currentTrackIndex + 1) % playlist.length;
        }
        loadTrack(newIndex, true);
    }

    function previousTrack() {
        const newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(newIndex, true);
    }

    function ejectDisc() {
        stopMusic(); audio.src = ''; updateDisplay(true);
    }

    playButton.addEventListener('click', playMusic);
    pauseButton.addEventListener('click', pauseMusic);
    stopButton.addEventListener('click', stopMusic);
    nextButton.addEventListener('click', nextTrack);
    previousButton.addEventListener('click', previousTrack);
    ejectButton.addEventListener('click', ejectDisc);
    
    audio.addEventListener('timeupdate', () => {
        if (isPlaying) {
            const { currentTime, duration } = audio;
            totalPlayDisplay.textContent = `Total Play: ${formatTime(duration)} m:s`;
            trackTimeDisplay.textContent = `Track: ${formatTime(currentTime)} m:s`;
            timeDisplay.textContent = `[${String(currentTrackIndex + 1).padStart(2, '0')}] ${formatTime(currentTime)}`;
        }
    });
    
    audio.addEventListener('ended', () => {
        if (isContinuous) { nextTrack(); } else { stopMusic(); isPlaying = false; }
    });

    volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
    
    const menuItems = document.querySelectorAll('.menu-item');
    function closeAllMenus() {
        menuItems.forEach(item => item.classList.remove('active'));
    }

    menuItems.forEach(item => {
        item.querySelector('span').addEventListener('click', (event) => {
            event.stopPropagation();
            const wasActive = item.classList.contains('active');
            closeAllMenus();
            if (!wasActive) item.classList.add('active');
        });
    });

    document.getElementById('menuEject').addEventListener('click', () => { ejectDisc(); closeAllMenus(); });
    menuAddMusic.addEventListener('click', () => {
        fileInput.click();
        closeAllMenus();
    });
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            const title = file.name.replace(/\.[^/.]+$/, ""); 
            const newTrack = {
                artist: "Artista Desconhecido",
                title: title,
                url: fileURL,
                albumCoverUrl: "https://images2.imgbox.com/42/89/JIRoQjUo_o.png"
            };
            playlist.push(newTrack);
            loadTrack(playlist.length - 1, true);
            fileInput.value = '';
        }
    });
    
    document.getElementById('menuViewNormal').addEventListener('click', () => {
        cdPlayerWindow.classList.remove('compact');
        volumeControl.classList.remove('active');
        closeAllMenus();
    });
    document.getElementById('menuViewCompact').addEventListener('click', () => {
        cdPlayerWindow.classList.add('compact');
        volumeControl.classList.remove('active');
        closeAllMenus();
    });
    document.getElementById('menuViewVolume').addEventListener('click', () => {
        volumeControl.classList.toggle('active');
        closeAllMenus();
    });

    const randomCheck = document.querySelector('#menuOptRandom .checkmark');
    document.getElementById('menuOptRandom').addEventListener('click', () => {
        isShuffle = !isShuffle;
        randomCheck.classList.toggle('active', isShuffle);
        randomCheck.innerHTML = isShuffle ? '✓' : '';
        closeAllMenus();
    });

    const continuousCheck = document.querySelector('#menuOptContinuous .checkmark');
    document.getElementById('menuOptContinuous').addEventListener('click', () => {
        isContinuous = !isContinuous;
        continuousCheck.classList.toggle('active', isContinuous);
        continuousCheck.innerHTML = isContinuous ? '✓' : '';
        closeAllMenus();
    });

    window.addEventListener('click', closeAllMenus);
    
    updateDisplay();
});
