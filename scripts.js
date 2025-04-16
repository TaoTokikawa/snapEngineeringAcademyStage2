/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */


//image and youtube album urls
const HOMEWORK_URL =
  "https://upload.wikimedia.org/wikipedia/en/9/9c/Daftpunk-homework.jpg";
const DISCOVERY_URL =
  "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png";
const HAA_URL =
  "https://upload.wikimedia.org/wikipedia/en/0/0d/Humanafterall.jpg";
const RAM_URL = 
  "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png"

const HOMEWORK_AUDIO_URL =
  "https://www.youtube.com/playlist?list=PLSdoVPM5Wnne3Q2AxosemsThywhraJ0su";
const DISCOVERY_AUDIO_URL =
  "https://www.youtube.com/playlist?list=PLSdoVPM5WnndSQEXRz704yQkKwx76GvPV";
const HAA_AUDIO_URL = 
  "https://www.youtube.com/playlist?list=PLSdoVPM5Wnne47ib65gVG206M7qp43us-";
const RAM_AUDIO_URL = 
  "https://www.youtube.com/playlist?list=PLSbDLF8wQ3oKcstd9ybCSv2lNm_8NTYkI";

//stack implementation
class Stack{
  constructor(){
    this.items = [];
  }

  push(songName){
    this.items.push(songName);
  }

  pop(){
    if(this.items.length == 0){
      return;
    }
    return this.items.pop();
  }

  peek(){
    this.items[this.items.length - 1];
  }

  size(){
    return this.items.length;
  }

  isEmpty(){
    return this.items.length === 0;
  }
}

//main playlist stack and a stack of the undos and redos
let playlist = [];
let playlistEdit = new Stack();

//daft punk albums
//albums contain a title, image link, youtube link, and an array of songs
let albums = [
  {
    title: "Homework",
    imageURL: HOMEWORK_URL,
    youtubeLink: HOMEWORK_AUDIO_URL,
    songs: ["Da Funk", "Around the World", "Alive"]
  },
  {
    title: "Discovery",
    imageURL: DISCOVERY_URL,
    youtubeLink: DISCOVERY_AUDIO_URL,
    songs: ["One More Time", "Digital Love", "Harder, Better, Faster, Stronger"]
  },
  {
    title: "Human After All",
    imageURL: HAA_URL,
    youtubeLink: HAA_AUDIO_URL,
    songs: ["Robot Rock", "Technologic", "Television Rules the Nation"]
  },
  {
    title: "Random Access Memories",
    imageURL: RAM_URL,
    youtubeLink: RAM_AUDIO_URL,
    songs: ["Get Lucky", "Lose Yourself to Dance", "Instant Crush"]
  }
]


// This function adds cards the page to display the data in the array
function showCards() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    const nextCard = templateCard.cloneNode(true); // Copy the template card
    editCardContent(nextCard, album); // Edit title and image
    cardContainer.appendChild(nextCard); // Add new card to the container
  }
}

function editCardContent(card, album) {
  card.style.display = "block";

  const cardHeader = card.querySelector("h2");

  //all cards have the album linked on youtube through a hyperlink
  cardHeader.innerHTML = `<a href="${album.youtubeLink}" target="_blank">${album.title}</a>`;

  const list = card.querySelector("ul");
  list.innerHTML = "";

  //every song in the album can be clicked to be added to playlist, 
  // so a button is made for every song in an album
  for(let song of album.songs){
    let button = document.createElement("button");
    button.textContent = song;
    button.classList.add("song-button");
    button.onclick = function(){
      alert('Added ' + song + ' to playlist.');
      playlist.push(song);
      updatePlaylist();
    };
    list.appendChild(button);
  }

  const cardImage = card.querySelector("img");
  cardImage.src = album.imageURL;
  cardImage.alt = album.title + " Poster";

  console.log("new card:", album.title, "- html: ", card);
}

//update the playlist with every element inside the playlist, called after every change to the playlist
function updatePlaylist() {
  const playlistBox = document.querySelector(".playlist-box");
  playlistBox.innerHTML = "<h3 class='playlist-title'>Playlist</h3>";
  for (let i = 0; i < playlist.length; i++) {
    const song = playlist.items[i];
    const songDiv = document.createElement("div");
    songDiv.textContent = song;
    songDiv.style.padding = "8px";
    songDiv.style.fontSize = "20px";
    songDiv.style.color = "#333";
    songDiv.style.borderBottom = "1px solid #ccc";
    songDiv.style.fontFamily = "Verdana";
    playlistBox.appendChild(songDiv);
  }
}

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showCards);

//undos both element addition and shuffle/sort
function undo(){
  if(playlist.length == 0){
    return;
  }
  playlistEdit.push(playlist.pop());
  updatePlaylist();
}

//redos element undos and shuffle/sorts
function redo(){
  if(playlistEdit.isEmpty()){
    return;
  }
  playlist.push(playlistEdit.pop());
  updatePlaylist();
}

//sort the playlist alphabetically
function sortAlphabetically(){

  playlist.sort();
  updatePlaylist();
}

function shuffle(){


  for(let i = playlist.length - 1; i>0; i--){
    const x = Math.floor(Math.random() * (i+1));
    [playlist[i], playlist[x]] = [playlist[x], playlist[i]];
  }
  updatePlaylist();
}


function clonePlaylist(playlistTemp){
  return [...playlistTemp.items];
}
