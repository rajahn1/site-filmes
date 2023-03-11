const moviesDiv = document.querySelector('.movies');
const inputSearch = document.querySelector('.input');
const buttonNext = document.querySelector('.btn-next');
const buttonPrev = document.querySelector('.btn-prev');

const movieModal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal_close');
const modalTitle = document.querySelector('.modal_title');
const modalImg = document.querySelector('.modal_img');
const modalDescription = document.querySelector('.modal_description');
const modalAverage = document.querySelector('.modal_average');

const allMovies = [];
const allMoviesTitle = [];
const allMoviesNote = [];
const allMoviesInfo = [];

const firstMoviePage = [];
const secondMoviePage = [];
const thirdMoviePage = [];
const pages = [firstMoviePage,secondMoviePage,thirdMoviePage];
let pageCounter = 0;
let haveMoreMovies = true;

const urlSearch = 'https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false';
let inputSearchValue = '';
let searchResults;

async function carrosel() {
    try {
    const response = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
    const results = response.data.results;

    for (let index = 0; index < 18; index++) {

        const movieBackgroundDiv = document.createElement('div');
        movieBackgroundDiv.classList.add('movie');

        const movieInfoDiv = document.createElement('div');
        movieInfoDiv.classList.add('movie_info');

        const movieTitleSpan = document.createElement('span');
        movieTitleSpan.classList.add('movie_title');

        const movieRatingSpan = document.createElement('span');
        movieRatingSpan.classList.add('movie_rating');

        const ratingImg = document.createElement('img');
        ratingImg.src = './assets/estrela.svg';
        ratingImg.alt = 'estrela';

        moviesDiv.appendChild(movieBackgroundDiv);
        movieBackgroundDiv.appendChild(movieInfoDiv);
        movieInfoDiv.appendChild(movieTitleSpan);
        movieInfoDiv.appendChild(movieRatingSpan);
        movieInfoDiv.appendChild(ratingImg);

        allMovies.push(movieBackgroundDiv);
        allMoviesTitle.push(movieTitleSpan);
        allMoviesNote.push(movieRatingSpan);
        allMoviesInfo.push(movieInfoDiv);

        if (index < 6) {
            firstMoviePage.push(movieBackgroundDiv);
        } else if (index < 12) {
            secondMoviePage.push(movieBackgroundDiv);
        } else if (index < 18) {
            thirdMoviePage.push(movieBackgroundDiv);
        }

        let currentResult = results[index];
        let movieImgUrl = currentResult.poster_path;
        let title = currentResult.title;
        let averageNote = currentResult.vote_average;

        movieBackgroundDiv.style.backgroundImage = `url(${movieImgUrl})`;
        movieTitleSpan.innerHTML = title;
        movieRatingSpan.innerHTML = averageNote;

        if(index > 5){
            movieBackgroundDiv.style.display = 'none';
        }

        allMovies[index].addEventListener('click', () => {
            if (allMovies[index].style.backgroundImage === '') {
                return;
            }

            const titleModal = currentResult.title;
            const imgModal = currentResult.backdrop_path;
            const descriptionModal = currentResult.overview;
            const averageModal = currentResult.vote_average.toFixed(1);
    
            modalTitle.textContent = titleModal;
            modalImg.src = imgModal;
            modalDescription.textContent = descriptionModal;
            modalAverage.textContent = averageModal;
            movieModal.classList.remove('hidden');         
        })
    }

    inputSearch.addEventListener('keypress', (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.key !== 'Enter') {
            inputSearch.value += event.key;
            return;
        }
        inputSearchValue = inputSearch.value;
        const fullUrl = `${urlSearch}&query=${inputSearchValue}`;
    
        async function searchMovie () {
            try {
            const response = await api.get(fullUrl);
            const searchResults = response.data.results;

            for(let i = 0; i < allMovies.length; i++) {
                if (i < 6) {
                    allMovies[i].style.display = 'flex';
                    pageCounter = 0;
                } else {allMovies[i].style.display = 'none'};

                if (inputSearchValue === '') {
                    haveMoreMovies = true;

                    allMoviesInfo[i].style.display = 'flex';
                    allMovies[i].style.backgroundImage = `url(${results[i].poster_path})`;
                    allMoviesNote[i].innerHTML = results[i].vote_average.toFixed(1);      
                    allMoviesTitle[i].innerHTML = results[i].title;

                    allMovies[i].addEventListener('click', () => {
                        if (allMovies[i].style.backgroundImage === '') {
                            return;
                        }
                        modalTitle.textContent = results[i].title;
                        modalImg.src = results[i].backdrop_path;
                        modalDescription.textContent = results[i].overview;
                        modalAverage.textContent = results[i].vote_average.toFixed(1);
                        movieModal.classList.remove('hidden');
                })

                } else {
                    if (i < 6) {
                        allMovies[i].style.display = 'flex';
                        pageCounter = 0;
                    } else {allMovies[i].style.display = 'none'};

                    if (!searchResults[i]) {
                        allMoviesInfo[i].style.display = 'none';
                        allMovies[i].style.backgroundImage = '';

                    if (!searchResults[6]) {
                        haveMoreMovies = false;
                    }

                    } else {
                        haveMoreMovies = true;

                        allMoviesInfo[i].style.display = 'flex';
                        allMovies[i].style.backgroundImage = `url(${searchResults[i].poster_path})`;
                        allMoviesNote[i].innerHTML = searchResults[i].vote_average.toFixed(1);      
                        allMoviesTitle[i].innerHTML = searchResults[i].title;
                    }

                allMovies[i].addEventListener('click', () => {
                    if (allMovies[i].style.backgroundImage === ''){
                        return;
                    }
                    if (!searchResults[i]) {
                        return;
                    }

                    modalTitle.textContent = searchResults[i].title;
                    modalImg.src = searchResults[i].backdrop_path;
                    modalDescription.textContent = searchResults[i].overview;
                    modalAverage.textContent = searchResults[i].vote_average.toFixed(1);
                    movieModal.classList.remove('hidden');
                })
            }
        }
        if (searchResults.length === 0 && inputSearchValue !== '') {
            alert('Nenhum filme encontrado!')
        }
        } catch {alert('Api de buscas não está respondendo');}
    }
        searchMovie();
        inputSearch.value = ''; 
    })

    movieModal.addEventListener('click', () => {
        movieModal.classList.add('hidden');
    })

    closeModal.addEventListener('click', () => {
        movieModal.classList.add('hidden');
    })

    buttonNext.addEventListener('click', () => {
        if (haveMoreMovies) {
            let currentPage = pages[pageCounter];
            pageCounter++
            if (pageCounter > 2) {
                pageCounter = 0;
            }
            let nextPage = pages[pageCounter];

            for (let i = 0; i < currentPage.length; i++) {
                currentPage[i].style.display = 'none'; 
                nextPage[i].style.display = 'flex';
            }
        }
    })

    buttonPrev.addEventListener('click', () => {
        if (haveMoreMovies) {
            let currentPage = pages[pageCounter];
            pageCounter--
            if (pageCounter < 0) {
            pageCounter = 2;
            }
            let previousPage = pages[pageCounter];

            for (let i = 0; i <currentPage.length; i++) {
                currentPage[i].style.display = 'none';
                previousPage[i].style.display = 'flex';
            }
        }
    })
} catch {alert('Api não está respondendo');}
}

async function highlightMovie () {
    try { 
    const response = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
    const videoEndpoint = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
    const videoKey = videoEndpoint.data.results[1].key;
    const linkVideo = `https://www.youtube.com/watch?v=${videoKey}`;

    const data = response.data;
    const backgroundVideo = data.backdrop_path;
    const title = data.title;
    const averageVote = data.vote_average.toFixed(1);
    const genres = data.genres;
    const description = data.overview;

    let launchDate = data.release_date;
    launchDate = new Date(launchDate).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });

    let genresName = genres[0].name;
    for (let i = 1; i < genres.length; i++) {
        genresName += `, ${genres[i].name}`;
    }

    const highlightVideo = document.querySelector('.highlight_video');
    const highlightTitle = document.querySelector('.highlight_title');
    const highlightRating = document.querySelector('.highlight_rating');
    const highlightGenres = document.querySelector('.highlight_genres');
    const highlightLaunch = document.querySelector('.highlight_launch');
    const highlightDescription = document.querySelector('.highlight_description');
    const highlightVideoLink = document.querySelector('.highlight_video-link');

    highlightVideo.style.backgroundImage = `url(${backgroundVideo})`;
    highlightTitle.textContent = title;
    highlightRating.textContent = averageVote;
    highlightGenres.textContent = genresName;
    highlightLaunch.textContent = launchDate;
    highlightDescription.textContent = description;
    highlightVideoLink.href = linkVideo;

    } catch {alert('Api não está respondendo');}
}

function changeTheme () {

    const buttonTheme = document.querySelector('.btn-theme');
    const root = document.querySelector(':root');
    const imgLogo = document.querySelector('.header_container-logo img');

    buttonTheme.addEventListener('click', () => {
        const currentBgColor = root.style.getPropertyValue("--background");

        if (!currentBgColor || currentBgColor === '#fff'){
            root.style.setProperty('--background', '#1B2028');
            root.style.setProperty('--text-color', '#FFFFFF');
            root.style.setProperty('--input-color', '#665F5F');
            root.style.setProperty('--bg-secondary', '#2D3440');
            root.style.setProperty('--bg-modal', '#2D3440');
            imgLogo.src = './assets/logo.svg';
            buttonTheme.src = './assets/dark-mode.svg';
            buttonNext.src = './assets/arrow-right-light.svg';
            buttonPrev.src = './assets/arrow-left-light.svg';
            return;
        }
        root.style.setProperty('--background', '#fff');
        root.style.setProperty('--text-color', '#1b2028');
        root.style.setProperty('--input-color', '#FFFFFF');
        root.style.setProperty('--bg-secondary', '#ededed');
        root.style.setProperty('--bg-modal', '#ededed');
        imgLogo.src = './assets/logo-dark.png';
        buttonTheme.src = './assets/light-mode.svg';
        buttonNext.src = './assets/arrow-right-dark.svg';
        buttonPrev.src = './assets/arrow-left-dark.svg';
    })
}

carrosel();
highlightMovie();
changeTheme();
