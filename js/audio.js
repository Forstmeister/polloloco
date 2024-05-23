let audioFiles = [
  {
    name: "walking",
    path: "./audio/walking3.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 4,
  },

  {
    name: "jumping",
    path: "./audio/jump2.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 1,
  },
  {
    name: "throwing",
    path: "./audio/throw2.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 1,
  },

  {
    name: "bottlebreaking",
    path: "./audio/bottlebreak2.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 1,
  },

  {
    name: "getItem",
    path: "./audio/getItem.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 1,
  },

  {
    name: "bossHurt",
    path: "./audio/enemyscream.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 1,
  },

  {
    name: "bossDead",
    path: "./audio/bossdead.mp3",
    loop: false,
    volume: 0.5,
    playbackrate: 1,
  },
  {
    name: "winGame",
    path: "./audio/win.mp3",
    loop: false,
    volume: 0.5,
    playbackrate: 1,
  },
  {
    name: "looseGame",
    path: "./audio/loose.mp3",
    loop: false,
    volume: 0.5,
    playbackrate: 1,
  },
  {
    name: "chickenKill",
    path: "./audio/chickenkill.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 2,
  },
  {
    name: "pepeHurt",
    path: "./audio/pepehurt.mp3",
    loop: false,
    volume: 0.3,
    playbackrate: 1,
  },
  {
    name: "menuLoop",
    path: "./audio/menuloop.mp3",
    loop: true,
    volume: 0.3,
    playbackrate: 1,
  },
];
let muteIntro = false;
let isMuted = false;
// cache for created audio objects
let audioElements = {};
/**
 * Plays an audio file with the specified name, loading it if not already in cache.
 * @function
 * @param {string} name - The name of the audio file to be played.
 * @throws {Error} Throws an error if the audio file is not found or cannot be loaded.
 */
function playAudio(name) {
  /**
   * Object to cache audio elements by name.
   * @type {Object.<string, HTMLAudioElement>}
   */
  if (!audioElements[name]) {
    // Check if the audio file is already in cache.
    let file = audioFiles.find((file) => file.name === name);
    // If the file is found, create a new audio element and set its properties.
    if (file) {
      audioElements[name] = new Audio(file.path);
      audioElements[name].loop = file.loop;
      audioElements[name].volume = file.volume;
      audioElements[name].playbackRate = file.playbackrate;
    } else {
      // Throw an error if the file is not found.
      console.error(`Die Datei kann nicht gefunden werden: ${name}`);
      return;
    }
  }
  // Play the audio if not muted.
  if (!isMuted) {
    audioElements[name].play();
  }
}

/**
 * Mutes all audio elements by setting their volume to zero and updating mute buttons.
 */

function muteAudio() {
  /**
   * Flag indicating whether the audio is muted.
   * @type {boolean}
   */
  isMuted = true;
  let mobileBtn = document.getElementById("muteBtnMobile");
  let Btn = document.getElementById("muteBtn");
  /**
   * Object to cache audio elements by name.
   * @type {Object.<string, HTMLAudioElement>}
   */
  mobileBtn.classList.add("active");
  Btn.classList.add("active");
  Object.values(audioElements).forEach((audio) => {
    // Set the volume of all audio elements to zero.
    audio.volume = 0;
  });
}
/**
 * Unmutes all audio elements by setting their volume to maximum and updating unmute buttons.
 */
function unMuteAudio() {
  /**
   * Flag indicating whether the audio is muted.
   * @type {boolean}
   */
  isMuted = false;
  let mobileBtn = document.getElementById("muteBtnMobile");
  let Btn = document.getElementById("muteBtn");
  /**
   * Object to cache audio elements by name.
   * @type {Object.<string, HTMLAudioElement>}
   */
  mobileBtn.classList.remove("active");
  Btn.classList.remove("active");
  // Set the volume of all audio elements to maximum.
  Object.values(audioElements).forEach((audio) => {
    audio.volume = 1;
  });
}
