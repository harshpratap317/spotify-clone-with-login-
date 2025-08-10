console.log("javascript is running");
// fetch('http://192.168.16.4:3000/playlists')

let currentSong = new Audio();
let songs;
let currFolder;
let openPlaylistSPA;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${currFolder}/`)
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        
                            <img class="invert" src="img/music.svg" alt="" srcset="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                
                                <div></div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="" srcset="">
                            </div>
        
         </li>`;

    }



    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    return songs

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track
    // let currentSongName = "";
    // currentSongName = track;
    // currentSong.src = `/${currFolder}/` + encodeURIComponent(track); 
    if (!pause) {

        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    // audio.play()
}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div  class="play">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="./songs/${folder}/cover.jpg" alt="" srcset="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            // playMusic(songs[0])
        })
    })
}

async function main() {

    await getSongs("songs/ncs")
    playMusic(songs[0], true)
    //sghow ALL SONGS IN PLAYLIST   

    displayAlbums()



    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";

            //     document.querySelectorAll(".songlist li").forEach(li => {
            //     if (currentSong.src.includes(li.getAttribute("data-filename"))) {
            //         li.querySelector(".playpause-btn").src = "img/pause.svg";
            //     } else {
            //         li.querySelector(".playpause-btn").src = "img/play.svg";
            //     }
            // });

        }
        else {
            currentSong.pause();
            play.src = "img/play.svg";
            // document.querySelectorAll(".playpause-btn").forEach(img => img.src = "img/play.svg");
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })


    // dopcument.querySelector(".seekbar").addEventListener("mousedown", e => {
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px";
    })

    document.querySelector(".left .close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //add previios and next

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })




    //add volume control
    document.querySelector(".volume-bar").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100

    })


    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0
            document.querySelector(".volume-bar").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10
            document.querySelector(".volume-bar").getElementsByTagName("input")[0].value = 10
        }
    })

        // const loginBtn = document.getElementById("loginBtn");
        // const loginForm = document.getElementById("loginForm");
        // const confirmBtn = document.getElementById("confirmBtn");

        // // Show the login form when button clicked
        // loginBtn.addEventListener("click", function () {
        //     loginForm.style.display = "block";
        //     loginBtn.style.display = "none";
        //     spotifyplaylists.style.display = "none";
        // });

        // // On confirm click
        // confirmBtn.addEventListener("click", function () {
        //     const username = document.getElementById("username").value.trim();
        //     const password = document.getElementById("password").value.trim();

        //     if (username && password) {
        //         // Redirect to next page
        //         window.location.href = "home.html"; // change to your page
        //     } else {
        //         alert("Please enter both username and password");
        //     }
        // });




}



main()