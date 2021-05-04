var d = new Date();
const grid = new Vue({
    el: "#filter-grid",
    data: {
        animes: []
    }
});

var select = new Vue({
    el: "#filter",
    data: {
        genres: [],
        selectedGenres: [],
        types: ['tv', 'ova', 'movie', 'special', 'ona', 'music'],
        selectedType: '',
        statuses: ['airing', 'complete', 'to_be_aired', 'tba', 'upcoming'],
        selectedStatus: '',
        rates: ['g', 'pg', 'pg13', 'r17', 'r', 'rx'],
        selectedRate: '',
        years: [],
        selectedYear: ''
    },
    methods: {
        onChangeGenre(event) {
            if (select.selectedGenres.includes(event.target.value)) {
                const index = select.selectedGenres.indexOf(event.target.value);
                select.selectedGenres.splice(index, 1);
            } else {
                select.selectedGenres.push(event.target.value)
            }
        },
        async filter_data(){
            let genresCode = '';
            for (g of select.selectedGenres) {
                genresCode += select.genres.indexOf(g) + 1 + ','
            }
            genresCode = genresCode.substr(0, genresCode.length-1)
            
            let clean_submit = {}
            if (genresCode != ''){
                clean_submit['genre'] = genresCode
            }
            if (select.selectedType){
                clean_submit['type'] = select.selectedType
            }
            if (select.selectedStatus){
                clean_submit['status'] = select.selectedStatus
            }
            if (select.selectedRate){
                clean_submit['rated'] = select.selectedRate
            }
            if (select.selectedYear){
                clean_submit['start_date'] = select.selectedYear.toString() + "-01-01"
            }
            console.log(clean_submit)
            let animes_url = 'https://api.jikan.moe/v3/search/anime?'
            for (key in clean_submit) {
                animes_url = animes_url + key + "=" + clean_submit[key] + "&" 
            }
            
            animes_url += 'order_by=score'
            let res = '';
            try {
                res = await fetch(animes_url)
                    .then(response => response.json())
                grid.animes = res.results;
                console.log(grid.animes)
            } catch(error) {
                res= 'No animes found with this filter'
            }
        }
    },
});

function ckChange(ckType){
    var ckName = document.getElementsByName(ckType.name);
    var checked = document.getElementById(ckType.id);

    if (ckType.name == "filter_type") {
        select.selectedType = ckType.id
    } else if (ckType.name == "filter_status") {
        select.selectedStatus = ckType.id
    } else if (ckType.name == "filter_year") {
        select.selectedYear = ckType.id
    } else if (ckType.name == "filter_rate") {
        select.selectedRate = ckType.id
    }

    if (checked.checked) {
      for(var i=0; i < ckName.length; i++){

          if(!ckName[i].checked){
              ckName[i].disabled = true;
          }else{
              ckName[i].disabled = false;
          }
      } 
    }
    else {
      for(var i=0; i < ckName.length; i++){
        ckName[i].disabled = false;
      } 
    }    
}

function watch(ckType){
    anime_url='anime/anime.html?id=' + ckType.id
    location.href = anime_url;
}

window.onload = async function(){
    res = await fetch('https://hiepvo01.pythonanywhere.com/genres').then(response => response.json());
    select.genres = res.genres;  
    year = []
    for (i = 2000; i < parseInt(d.getFullYear()); i++) {
        year.push(i)
      }
    select.years = year;
}