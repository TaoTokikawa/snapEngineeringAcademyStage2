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

//stack class and basic functions of stacks
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

//stack which houses the entire playlist and the changes made
let playlist = new Stack();
let playlistEdit = new Stack();

//all albums contain the name of the album, image/youtube url, and an array songs.
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
  cardHeader.innerHTML = `<a href="${album.youtubeLink}" target="_blank">${album.title}</a>`;

  const list = card.querySelector("ul");
  list.innerHTML = "";

  for(let song of album.songs){
    const button = document.createElement("button");
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

  // You can use console.log to help you debug!
  // View the output by right clicking on your website,
  // select "Inspect", then click on the "Console" tab
  console.log("new card:", album.title, "- html: ", card);
}

//updates the playlist with the elements of the stack
//called everytime an edit to the playlist (undo, shuffle, etc.) is made
function updatePlaylist() {
  const playlistBox = document.querySelector(".playlist-box");
  playlistBox.innerHTML = "<h3 class='playlist-title'>Playlist</h3>";
  for (let i = 0; i < playlist.size(); i++) {
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

//undos last entry into the playlist if not shuffled/sorted
//or removes the last element if the playlist was shuffled/sorted
//by popping the playlist stack.
//adds the popped element into an edits stack.
function undo(){
  if(playlist.isEmpty()){
    return;
  }
  playlistEdit.push(playlist.pop());
  updatePlaylist();
}

//reverses undo to last entry into the playlist
//by popping the removed element out of the edits stack
function redo(){
  if(playlistEdit.isEmpty()){
    return;
  }
  playlist.push(playlistEdit.pop());
  updatePlaylist();
}

//sorts the playlist by alphabetical order using built-in array sorting
//moves the elements of the stack to a temporary array and use .sort()
function sortAlphabetically(){
  const temp = [];
  while(playlist.size() > 0){
    temp.push(playlist.pop());
  }
  temp.sort();
  for (let i = 0; i < temp.length; i++) {
    playlist.push(temp[i]);
  }
  updatePlaylist();
}

//shuffles the playlist stack with fisher-yates method in a temporary array
function shuffle(){
  const temp = [];
  while(playlist.size() > 0){
    temp.push(playlist.pop());
  }
  for(let i = temp.length - 1; i>0; i--){
    const x = Math.floor(Math.random() * (i+1));
    [temp[i], temp[x]] = [temp[x], temp[i]];
  }
  while(temp.length > 0){
    playlist.push(temp.pop());
  }
  updatePlaylist();
}