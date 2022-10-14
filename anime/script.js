var urlParams = new URLSearchParams(window.location.search);

const anime_data = new Vue({
    el: "#descriptions",
    data: {
        anime: [],
        genres: '',
        image_url:'',
    }
});

async function display() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.get('id')) {
        localStorage.setItem('anime_id', urlParams.get('id'))
    }
    let res = '';
    res = await fetch(`https://api.jikan.moe/v4/anime/` + localStorage.getItem('anime_id'))
        .then(response => response.json())

    anime_data.anime = res.data;
    for (genre of res.data.genres) {
        anime_data.genres = anime_data.genres + genre.name + ', '
    }
    anime_data.genres=anime_data.genres.substr(0, anime_data.genres.length-2)
    anime_data.image_url = anime_data.anime.images.jpg.image_url
    console.log(anime_data.image_url)

    stars = document.getElementsByClassName('fa fa-star')
    for (let i=0; i<anime_data.anime.score/2-1; i++) {
        star = stars[i];
        star.classList.add("checked");
    }

    for(let e =1; e<=anime_data.anime.episodes;e++){
        div = document.getElementById('episode_buttons')
        button = document.createElement("button");
        button.setAttribute('id','ep-'+e);
        button.classList.add("btn");
        button.classList.add("btn-secondary");
        button.innerText = e
        button.style.margin = 2
        button.onclick = async function() {
            let url = 'http://127.0.0.1:5000/episodes'
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    iframe = document.getElementById('ep-iframe')
                    iframe.src=xhr.responseText
                }
            }
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                anime_url: anime_data.anime.url,
                ep: e
            }));
        }
        div.appendChild(button);
    }

    document.getElementById("ep-1").click();
}

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

async function Search(){
    s = document.getElementById('search')
    localStorage.setItem('search', s.value)
    window.location.replace("../index.html");
}

var user = new XMLHttpRequest();
    user.onreadystatechange= function () {
        if (user.readyState==4) {
            //handle response
            if(user.status==401) {
                alert("Session Timeout! Please log in again");
                location.href="../user/login.html"
            } else {
            }
        }
        if (user.readyState == XMLHttpRequest.DONE) {
            localStorage.setItem('watching', JSON.parse(user.responseText)["watching"])
            localStorage.setItem('watched', JSON.parse(user.responseText)["watched"])
            localStorage.setItem('like', JSON.parse(user.responseText)["like"])
        }
    }

function updateUser(key) {    
    var method = key.id;
    let updateUrl = 'http://127.0.0.1:5000/update_preference'
    user.open("POST", updateUrl, true);
    user.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    user.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // user.setRequestHeader("Access-Control-Allow-Origin","*");
    user.send(JSON.stringify({"email":localStorage.getItem('email'), "anime_id":localStorage.getItem('anime_id'), "choice":method}))
}

window.onload= async function() {
    display()
    document.getElementById("description").click();
    if(localStorage.getItem('access_token')) {
        user.open("GET", "http://127.0.0.1:5000/user/" + localStorage.getItem('email'), true);
        user.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        user.setRequestHeader("Accept","text/plain");
        user.send()

        watching = document.createElement('button')
        watching.innerHTML = "Watching"
        watching.classList.add('btn')
        watching.classList.add('btn-success')
        watching.setAttribute('id','watching');
        watching.setAttribute('type','button');
        watching.setAttribute('onclick','updateUser(this)');
        watching.classList.add('col-4')
        row = document.getElementById('img-row')
        row.appendChild(watching)

        watched = document.createElement('button')
        watched.innerHTML = "Watched"
        watched.classList.add('btn')
        watched.setAttribute('id','watched');
        watched.setAttribute('type','button');
        watched.setAttribute('onclick','updateUser(this)');
        watched.classList.add('btn-info')
        watched.classList.add('col-4')
        row.appendChild(watched)

        like = document.createElement('button')
        like.innerHTML = "Like"
        like.classList.add('btn')
        like.setAttribute('id','like');
        like.setAttribute('onclick','updateUser(this)');
        like.setAttribute('type','button');
        like.classList.add('btn-warning')
        like.classList.add('col-4')
        row.appendChild(like)     
    }
}