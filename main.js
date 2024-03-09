/* Elementlere ulasmak */

const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')


//  sira, dongu, karıştırma
let index = 3, loop = false, shuffle = false


//json verisi
let songsList = []

const xlr = new XMLHttpRequest()
xlr.open('GET', 'songs_list.json', true)
xlr.onload = function () {
    if (this.status === 200)
        songsList = JSON.parse(this.responseText)
}
xlr.send()

// play
playButton.addEventListener("click", playAudio)

function playAudio() {
    audio.play()
    playButton.classList.add("hide")
    pauseButton.classList.remove("hide")
}

// pause
pauseButton.addEventListener("click", pauseAudio)

function pauseAudio() {
    audio.pause()
    playButton.classList.remove("hide")
    pauseButton.classList.add("hide")
}

// select new song
function setSong(arrayIndex) {
    let { name, link, artist, image } = songsList[arrayIndex]

    songName.innerText = arrayIndex + " - " + name
    audio.src = link
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = function () {
        // second calculation        
        currentTimeRef.innerText = timeFormatter(audio.currentTime)
        maxDuration.innerText = timeFormatter(audio.duration)
    }
    //playListContainer.classList.add("hide")
    playAudio()
}

// when previus button clicked
prevButton.addEventListener("click", function () {
    if (index > 0) {
        pauseAudio()
        index -= 1
    } else {
        index = songsList.length - 1
    }
    setSong(index)
})

// when next button clicked
nextButton.addEventListener("click", nextSong)

function nextSong() {
    // karıştırıcı kapalı iken
    if (!shuffle) {
        if (index === songsList.length - 1) {
            // son şarkıdayız, döngü kapalı ise fonksiyonu durdur
            if (loop === false) {
                pauseAudio()
                return
            }
            index = 0
        } else {
            index += 1
        }
    } else {
        let oncekiIndex = index
        while (true) {
            index = Math.floor(Math.random() * songsList.length)
            // önceki müzik tekrar çıkarsa
            if (oncekiIndex !== index) break
        }
    }
    audio.volume = 0.1;
    setSong(index)
}

// when random button clicked
repeatButton.addEventListener("click", function () {
    if (repeatButton.classList.contains("active")) {
        repeatButton.classList.remove("active")
    } else {
        repeatButton.classList.add("active")
    }
    loop = !loop
})

// when shuffle button clicked
shuffleButton.addEventListener("click", () => {
    if (shuffleButton.classList.contains("active")) {
        shuffleButton.classList.remove("active")
        repeatButton.classList.remove("active")
    } else {
        shuffleButton.classList.add("active")
        repeatButton.classList.add("active")
    }
    shuffle = !shuffle
})

// time formatter
function timeFormatter(timeInput) {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}

// show passed time
setInterval(function () {
    currentTimeRef.innerText = timeFormatter(audio.currentTime);
    currentProgress.style.width = `${(audio.currentTime / audio.duration.toFixed(0)).toFixed(3) * 100}%`
}, 1000)

// when progressbar clicked
progressBar.addEventListener("click", function (e) {
    let prg = progressBar.getBoundingClientRect()
    const percent = ((e.clientX - prg.x) / prg.width).toFixed(3)
    console.log(percent)
    currentProgress.style.width = (percent * 100) + "%"
    audio.currentTime = (percent * audio.duration).toFixed(2)
})

const initializePlayList = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `
        <li class="playlistSong" onclick="setSong(${i})">
            <div class="playlist-image-container">
                <img src="${songsList[i].image}" alt="image">
            </div>
            <div class="playlist-song-details">
                <span id="playlist-song-name">${songsList[i].name}</span>
                <span id="playlist-song-artist-album">${songsList[i].artist}</span>
            </div>
        </li>
        `
    }
}

// playlist hide
closeButton.addEventListener("click", function(){
    playListContainer.classList.add("hide")
})

// playlist show
playListButton.addEventListener("click", function(){
    playListContainer.classList.remove("hide")
})

// when a song finished
audio.onended = function () {
    nextSong()
}

// when page loaded
window.onload = function () {
    nextSong()
    initializePlayList()
}

