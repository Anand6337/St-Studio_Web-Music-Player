// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    let currentMusic = 0;
    const music = document.querySelector('#audio');
    const seekBar = document.querySelector('.seek-bar');
    const songName = document.querySelector('.music-name');
    const artistName = document.querySelector('.artist-name');
    const disk = document.querySelector('.disk');
    const currentTime = document.querySelector('.current-time');
    const musicDuration = document.querySelector('.song-duration');
    const playBtn = document.querySelector('.play-btn');
    const forwardBtn = document.querySelector('.forward-btn');
    const backwardBtn = document.querySelector('.backward-btn');
    const ulTag = document.querySelector(".playlist");

    const firebaseConfig = {
        apiKey: "AIzaSyDd7R5GrCfpdn1a61Ox1ItgBI0H-brBCu0",
        authDomain: "st-studio-films-and-music.firebaseapp.com",
        projectId: "st-studio-films-and-music",
        storageBucket: "st-studio-films-and-music.appspot.com",
        messagingSenderId: "940676956958",
        appId: "1:940676956958:web:23b45c5fd1d99ece07ff0f",
        measurementId: "G-46J1RFFKDP",
        databaseURL: "https://st-studio-films-and-music-default-rtdb.asia-southeast1.firebasedatabase.app",

      };
    

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const songRef = ref(database, 'songs');

    // Function to toggle the play/pause state
    function togglePlayPause() {
        if (music.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    }

    playBtn.addEventListener('click', () => {
        togglePlayPause();
    });

    music.addEventListener('play', () => {
        playBtn.classList.remove('pause');
        disk.classList.add('play');
    });

    music.addEventListener('pause', () => {
        playBtn.classList.add('pause');
        disk.classList.remove('play');
    });

    const setMusic = (i, songs) => {
        seekBar.value = 0;
        let song = songs[i];
        currentMusic = i;
        music.src = song.path;
        songName.innerHTML = song.name;
        artistName.innerHTML = song.artist;
        disk.style.backgroundImage = `url(${song.cover})`;
        music.addEventListener('loadedmetadata', () => {
            seekBar.max = music.duration;
            musicDuration.innerHTML = formatTime(music.duration);
        });

        currentTime.innerHTML = '00:00';
    };

    const formatTime = (time) => {
        let min = Math.floor(time / 60);
        if (min < 10) {
            min = `0${min}`;
        }
        let sec = Math.floor(time % 60);
        if (sec < 10) {
            sec = `0${sec}`;
        }
        return `${min}:${sec}`;
    };

    const playMusic = () => {
        var playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Success
            }).catch(() => {
                // Autoplay was prevented
            });
        }
    };

    const pauseMusic = () => {
        music.pause();
    };

    forwardBtn.addEventListener('click', () => {
        onValue(songRef, (snapshot) => {
            const songs = snapshot.val();
            if (currentMusic >= songs.length - 1) {
                currentMusic = 0;
            } else {
                currentMusic++;
            }
            setMusic(currentMusic, songs);
            togglePlayPause();
        });
    });

    backwardBtn.addEventListener('click', () => {
        onValue(songRef, (snapshot) => {
            const songs = snapshot.val();
            if (currentMusic <= 0) {
                currentMusic = songs.length - 1;
            } else {
                currentMusic--;
            }
            setMusic(currentMusic, songs);
            togglePlayPause();
        });
    });

    onValue(songRef, (snapshot) => {
        const songs = snapshot.val();

        let currentSongIndex = null;

        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const liTag = document.createElement("li");
            liTag.setAttribute("data-li-index", i + 1);
            liTag.setAttribute("data-song-src", song.path);

            liTag.innerHTML = `
                <div class="audio-img">
                    <img src="${song.cover}" alt="Song ${i + 1}">
                </div>
                <marquee behavior="" direction="">
                    <h3>${song.name}</h3>
                </marquee>
                <button class="play-song-btn">Play</button>`;

            ulTag.appendChild(liTag);

            const playBtn = liTag.querySelector(".play-song-btn");
            playBtn.addEventListener("click", () => {
                const songPath = liTag.getAttribute("data-song-src");
                playsong(songPath, i);
            });
        }
    });

    function playsong(songPath, songIndex) {
        music.src = songPath;
        playMusic();
        currentSongIndex = songIndex;

        const song = songs[currentSongIndex];
        songName.textContent = song.name;
        artistName.textContent = song.artist;

        seekBar.value = 0;
        currentTime.textContent = '00:00';
        musicDuration.textContent = formatTime(music.duration);
    }
});
