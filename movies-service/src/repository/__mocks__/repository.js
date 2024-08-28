const movies = [{
    "_id": "669a97ab8efd847f6dcc8988",
    "titulo": "Os Vingadores: Ultimato",
    "sinopse": "Os heróis mais poderosos da Terra enfrentando o Thanos. De novo.",
    "duracao": 181,
    "dataLancamento": new Date("2024-07-10T00:00:00.000Z"),
    "imagem": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "categorias": ["Aventura", "Ação"]
}];

const simulateNotFound = {
    allMovies: false,
    movieById: false,
    premieres: false,
    movie: false
};

const testMovie = {
    titulo: "Teste Title test",
    sinopse: "Teste Summary test",
    duracao: 120,
    dataLancamento: new Date(),
    imagem: 'https://website/image.jpg',
    categorias: ['Aventura', 'ação']
};

async function getAllMovies() {
    if (simulateNotFound.allMovies) return null;
    return movies;
}

async function getMovieById(id) {
    if (simulateNotFound.movieById || id === '-1') return null;
    return movies.find(movie => movie._id === id) || null;
}

async function getMoviePremieres() {
    if (simulateNotFound.premieres) return null;
    return movies; 
}

async function addMovie() {
    if (!testMovie) {
        throw new Error('Simulated error when adding a movie');
    }
    return testMovie;
}

async function deleteMovie(id) {
    if (id === '-1') {
        throw new Error('Simulated internal server error');
    }
    if (!id) {
        throw new Error('Unable to delete this movie.');
    }
    return true;
}

function api(app, repository) {
    app.get('/movies', async (req, res) => {
        try {
            const movies = await repository.getAllMovies();
            if (movies === null) return res.status(404).json({ error: 'Movies not found' });
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.get('/movies/:id', async (req, res) => {
        try {
            const movie = await repository.getMovieById(req.params.id);
            if (movie === null) return res.status(404).json({ error: 'Movie not found' });
            res.status(200).json(movie);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.post('/movies', async (req, res) => {
        try {
            const movie = await repository.addMovie(req.body);
            res.status(201).json(movie);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.delete('/movies/:id', async (req, res) => {
        try {
            await repository.deleteMovie(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}

module.exports = {
    getAllMovies,
    getMovieById,
    getMoviePremieres,
    simulateNotFound,
    addMovie,
    testMovie,
    deleteMovie,
    api
};
