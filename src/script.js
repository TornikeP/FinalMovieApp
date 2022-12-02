    //   ჰედერისთვის ცვლადების შექმნა
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li");
    
//    ქლიქის დროს
    hamburger.addEventListener('click', ()=>{
    //    ლინკები
        navLinks.classList.toggle("open");
        links.forEach(link => {
            link.classList.toggle("fade");
        });
    
        // ანიმაცია
        hamburger.classList.toggle("toggle");
    });
    
    
                //    ინდივიდუალური აპი ქი, ტმდბ-დან  წამოღებული
    const API_KEY =`427831e0c241af4dae179660da6019b2`
    const image_path =`https://image.tmdb.org/t/p/w1280`
    
                //    კონსტები html-შესაბამისად
    const input = document.querySelector('.search input')
    const btn = document.querySelector('.search button')
    const main_grid_title = document.querySelector('.favorites h1')
    const main_grid = document.querySelector('.movies-grid')
                
                    // ტრენდული, ტოპ რეიტიგიანი ფილმებისთვს და პოპაპისთვის ელემენტები innerhtml-ის
    const trending_el = document.querySelector('.trending .movies-grid')
    const toprated_el = document.querySelector('.toprated .movies-grid')
    const popup_container = document.querySelector('.popup-container')
    
        //   სლაიდ შოუსთვის
    let slideIndex = 1;
    let slideCaption = "";
    let slideImg = "";
    
       
    
        //   ფილმის ქარდზე ქლიქით სრულ აღწერილობაზე გადასვლა
    function add_click_effect_to_card (cards) {
        cards.forEach(card => {
            card.addEventListener('click', () => show_popup(card))
        })
    }
    
            //    სერჩი - ასინქრონულობა, ფეჩით ფილმების წამოღება მონაცემების ჯეისონად გადაკეთება და გამოტანა
    async function get_movie_by_search (search_term) {
        const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`)
        const respData = await resp.json()
        return respData.results
    }
    
        //    ელემენტების წამოღება და გაგზავნა-ინნერით კონკრეტული მოთხოვნების მიხედვით
    btn.addEventListener('click', add_searched_movies_to_dom)

    async function add_searched_movies_to_dom () {
        const data = await get_movie_by_search(input.value)
       
    
        main_grid_title.innerText = `Search Results...`
        main_grid.innerHTML = data.map(e => {
            return `
                    <div class="card" data-id="${e.id}">
                        <div class="img">
                            <img src="${image_path + e.poster_path}">
                        </div>
                        <div class="info">
                            <h2>${e.title}</h2>
                            <div class="single-info">
                                <span>Rate:</span>
                                <span>${e.vote_avarage}</span>
                            </div>
                            <div class="single-info">
                                <span>Release Date:</span>
                                <span>${e.release_date}</span>
                            </div>
                        </div>
                    </div>
            `
        }).join('')
    
        const cards = document.querySelectorAll('.card')
        add_click_effect_to_card(cards)
        
    }
    
            // აპი ქის დახმარებით ფილმის აიდის და ქვევით უკვე ტრეილერის წამოღება
    async function get_movie_by_id (id) {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
        const respData = await resp.json()
        return respData
    }
    
    
    async function get_movie_trailer (id) {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
        const respData = await resp.json()
        return respData.results[0].key
       
    }
    

    async function show_popup (card) {
        popup_container.classList.add('show-popup')
    
        const movie_id = card.getAttribute('data-id')
        const movie = await get_movie_by_id(movie_id)
        const movie_trailer = await get_movie_trailer(movie_id)
    
            // დეტალური აღწერის გვერდზე, რომ პოსტერი იყოს ბექგრაუნდად
        popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`
    
        popup_container.innerHTML = `
                <span class="x-icon">&#10006;</span>
                <div class="content">
                    <div class="left">
                        <div class="poster-img">
                            <img src="${image_path + movie.poster_path}" alt="">
                        </div>
                        <div class="single-info">
                            <span>Add to favorites:</span>
                            <span class="heart-icon">&#9829;</span>
                        </div>
                    </div>
                    <div class="right">
                        <h1>${movie.title}</h1>
                        <h3>${movie.tagline}</h3>
                        <div class="single-info-container">
                            <div class="single-info">
                                <span>Language:</span>
                                <span>${movie.spoken_languages[0].name}</span>
                            </div>
                            <div class="single-info">
                                <span>Length:</span>
                                <span>${movie.runtime} minutes</span>
                            </div>
                            <div class="single-info">
                                <span>Rate:</span>
                                <span>${movie.vote_average} / 10</span>
                            </div>
                            <div class="single-info">
                                <span>Budget:</span>
                                <span>$ ${movie.budget}</span>
                            </div>
                            <div class="single-info">
                                <span>Release Date:</span>
                                <span>${movie.release_date}</span>
                            </div>
                        </div>
                        <div class="genres">
                            <h2>Genres</h2>
                            <ul>
                                ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="overview">
                            <h2>Overview</h2>
                            <p>${movie.overview}</p>
                        </div>
                        <div class="trailer">
                            <h2>Trailer</h2>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
        `

        // X-აიქონის დაჭერისას რომ გაითიშოს დეტალური აღწერა
        const x_icon = document.querySelector('.x-icon')
        x_icon.addEventListener('click', () => popup_container.classList.remove('show-popup'))
    
            //    გულის/ფეივორიტ აიქონი - ქლიქის დროს ფერი რომ შეიცვალოს წითლად და შემდეგზე დააბრუნოს თეთრი 
        const heart_icon = popup_container.querySelector('.heart-icon')
        heart_icon.addEventListener('click', () => {
            if(heart_icon.classList.contains('change-color')) {
                remove_LS(movie_id)
                heart_icon.classList.remove('change-color')
            } else {
                add_to_LS(movie_id)
                heart_icon.classList.add('change-color')
            }
            fetch_favorite_movies()
    
        })
    }
    
        //   თუ ფილმის სახელწოდება არ მოიძებნა დააბრუნოს ცარიელი და ა.შ  ?
    function get_LS () {
        const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
        return movie_ids === null ? [] : movie_ids
    }
    
        function add_to_LS (id) {
            const movie_ids = get_LS()
            localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
    
    }
    function remove_LS (id) {
        const movie_ids = get_LS()
        localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
    }
    
   
        // ფეივორიტების ფუნქცია 
    fetch_favorite_movies()
    async function fetch_favorite_movies () {
        main_grid.innerHTML = ''
    
        const movies_LS = await get_LS()
        const movies = []
        for(let i = 0; i <= movies_LS.length - 1; i++) {
            const movie_id = movies_LS[i]
            let movie = await get_movie_by_id(movie_id)
            add_favorites_to_dom_from_LS(movie)
            movies.push(movie)
        }
    }
    
    function add_favorites_to_dom_from_LS (movie_data) {
        main_grid.innerHTML += `
            <div class="card" data-id="${movie_data.id}">
                <div class="img">
                    <img src="${image_path + movie_data.poster_path}">
                </div>
                <div class="info">
                    <h2>${movie_data.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${movie_data.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${movie_data.release_date}</span>
                    </div>
                </div>
            </div>
    `
    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
    
    }
    
    
        //  ტრენინგ ფილმების ფუნქცია 
    get_trending_movies()
    async function get_trending_movies () {
        const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
        const respData = await resp.json()
        return respData.results
    }
    
    add_to_dom_trending()
    async function add_to_dom_trending () {
    
        const data = await get_trending_movies()
        console.log(data);
    
        trending_el.innerHTML = data.slice(0, 20).map(e => {
            return `
                <div class="card" data-id="${e.id}">
                    <div class="img">
                        <img src="${image_path + e.poster_path}">
                    </div>
                    <div class="info">
                        <h2>${e.title}</h2>
                        <div class="single-info">
                            <span>Rate: </span>
                            <span>${e.vote_average} / 10</span>
                        </div>
                        <div class="single-info">
                            <span>Release Date: </span>
                            <span>${e.release_date}</span>
                        </div>
                    </div>
                </div>
            `
        }).join('')
    
        const cards = document.querySelectorAll('.card')
        add_click_effect_to_card(cards)
    }

    //   ტოპ რეიტინგიანი ფილმების ფუნქცია 
    get_toprated_movies()
async function get_toprated_movies () {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
    const respData = await resp.json()
    return respData.results;
}

add_to_dom_toprated()
async function add_to_dom_toprated () {

    const data = await get_toprated_movies()

    toprated_el.innerHTML = data.slice(0, 20).map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title || e.name}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')
}
    // სლაიდერი
    showSlides(slideIndex);
    
    // შემდეგ/უკან 
    function plusSlides(n) {
        showSlides(slideIndex += n);
    }
    
    
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }
    
    async function showSlides(n) {
        const data = await get_trending_movies();
        if(n > data.length -1 ) {
            n = data.length -1;
            slideIndex = data.length -1;
        }
        if(n < 1) {
            n = 1;
            slideIndex = 1;
        }
        document.getElementById('slideIdex').innerHTML = `${n} / ${data.length -1}`;
        document.getElementById('slideImage').src = `${image_path + data[n].poster_path}`;
    
    }
    
   