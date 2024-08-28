const citiesController = (repository) => ({
    getCinemasByCity: async (req, res, next) => {
        try {
            const cinemas = await repository.getCinemasByCityId(req.params.cityId);

            if (!cinemas || !cinemas.length) {
                return res.sendStatus(404);
            }
            res.json(cinemas);
        } catch (error) {
            next(error);
        }
    },

    getAllCities: async (req, res, next) => {
        try {
            const cities = await repository.getAllCities();

            if (!cities || !cities.length) {
                return res.sendStatus(404);
            }
            res.json(cities);
        } catch (error) {
            next(error);
        }
    }
});

module.exports = citiesController;