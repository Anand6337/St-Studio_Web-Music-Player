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

    function setMusic(i, songs) {
        seekBar.value = 0;
        currentMusic = i;
        const song = songs[i];
        music.src = song.path;
        songName.innerHTML = song.name;
        artistName.innerHTML = song.artist;
        disk.style.backgroundImage = `url(${song.cover})`;
        music.addEventListener('loadedmetadata', () => {
            seekBar.max = music.duration;
            musicDuration.innerHTML = formatTime(music.duration);
        });

        currentTime.innerHTML = '00:00';
    }

    function formatTime(time) {
        let min = Math.floor(time / 60);
        if (min < 10) {
            min = `0${min}`;
        }
        let sec = Math.floor(time % 60);
        if (sec < 10) {
            sec = `0${sec}`;
        }
        return `${min}:${sec}`;
    }

    function playMusic() {
        var playPromise = music.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Success
            }).catch(() => {
                // Autoplay was prevented
            });
        }

            // Event listener for when the current song ends
            music.addEventListener('ended', () => {
            // Play the next song
            forwardBtn.click();
    });
    }

    function pauseMusic() {
        music.pause();
    }

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

    seekBar.addEventListener('change', () => {
        music.currentTime = seekBar.value;
    });

    music.addEventListener('timeupdate', () => {
        seekBar.value = music.currentTime;
        currentTime.innerHTML = formatTime(music.currentTime);
    });

    onValue(songRef, (snapshot) => {
        const songs = snapshot.val();

        ulTag.innerHTML = ''; // Clear the playlist before updating

        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const liTag = document.createElement("li");
            liTag.setAttribute("data-li-index", i);
            liTag.setAttribute("data-song-src", song.path);

            liTag.innerHTML = `
                <div class="audio-img">
                    <img src="${song.cover}" alt="Song ${i + 1}">
                </div>
                <marquee behavior="" direction=""
                animation="marquee 90s linear infinite"
                width="100%"
                white-space="nowrap"
                overflow="hidden">
                    <h3>${song.name}</h3>
                </marquee>
                <button class="play-song-btn">Play</button>`;

            ulTag.appendChild(liTag);

            liTag.querySelector(".play-song-btn").addEventListener("click", () => {
                setMusic(i, songs);
                playMusic();
            });
        }
    });

});
