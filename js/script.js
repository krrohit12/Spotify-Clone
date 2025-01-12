console.log("hello");
let currentsong=new Audio();
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
async function getsongs(){
    let a=await fetch("/songs/")
    let response= await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let songs=[];
    for(let i=0;i<anchors.length;i++){
        let element=anchors[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}
const playMusic = (track) => { 
    currentsong.src= "/songs/"+track;
    currentsong.play()
    play.src="img/pause.svg";
    document.querySelector(".songinfo").innerHTML=track.replaceAll("%20"," ");
    document.querySelector(".songtime").innerHTML="00:00/00:00";
}
async function main() {
    let songs=await getsongs();
    let songul=document.querySelector(".songlists").getElementsByTagName("ul")[0];
    for (const song of songs) { 
        songul.innerHTML += `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="songname">${song.replaceAll("%20"," ")}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`;
    }    
    Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="img/pause.svg"
        }
        else{
            currentsong.pause();
            play.src="img/play.svg"
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"  
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"  
    })
    prev.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    // document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    //     // console.log("Setting volume to", e.target.value, "/ 100")
    //     currentsong.volume = parseInt(e.target.value) / 100
        
    // })
}
main()