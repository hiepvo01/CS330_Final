var d = new Date();
const grid = new Vue({
    el: "#filter-grid",
    data: {
        watching: [],
        watched: [],
        like: []
    }
});

function watch(ckType){
    anime_url='../anime/anime.html?id=' + ckType.id
    location.href = anime_url;
}

window.onload= async function(){
    BASE = 'https://api.jikan.moe/v3/anime/'

    if(localStorage.getItem('access_token')) {
        header = document.createElement('h2')
        header.innerHTML = localStorage.getItem('name') + "'s Anime Profile";
        Name = document.getElementById('Name')
        Name.appendChild(header)

        for(wi of localStorage.getItem('watching').split(', ')) {
            res = await fetch(BASE + wi).then(response => response.json());
            grid.watching.push(res)
        }
        for(wi of localStorage.getItem('watched').split(', ')) {
            res = await fetch(BASE + wi).then(response => response.json());
            grid.watched.push(res)
        }
        for(wi of localStorage.getItem('like').split(', ')) {
            res = await fetch(BASE + wi).then(response => response.json());
            grid.like.push(res)
        }

        
    } else {
        alert("Please log in to see your profile")
        location.href='login.html'
    }
}