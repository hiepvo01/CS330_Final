var urlParams = new URLSearchParams(window.location.search);

const anime_data = new Vue({
    el: "#descriptions",
    data: {
        anime: [],
        genres: ''
    }
});

async function display() {
    console.log("Testing")
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get('id'))
    let res = '';
    res = await fetch(`https://api.jikan.moe/v3/anime/` + urlParams.get('id'))
        .then(response => response.json())
    anime_data.anime = res;
    for (genre of res.genres) {
        anime_data.genres = anime_data.genres + genre.name + ', '
    }
    anime_data.genres=anime_data.genres.substr(0, anime_data.genres.length-2)

    stars = document.getElementsByClassName('fa fa-star')
    for (let i=0; i<anime_data.anime.score/2-1; i++) {
        star = stars[i];
        star.classList.add("checked");
    }

    console.log(anime_data.anime.url)

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

window.onload= async function() {
    display()
    document.getElementById("description").click();
}