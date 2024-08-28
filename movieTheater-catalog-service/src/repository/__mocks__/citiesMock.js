const simulateNotFound = {
  allCities: false,
  cityId: false
};

const simulateError = {
  allCities: false,
  cityId: false
};

const getCinemasByCityId = (cityId) => {
  if (simulateError.cityId) {
    throw new Error('Error fetching cinemas by ID');
  }

  if (simulateNotFound.cityId) {
    return []; 
  }

  return [
    { nome: 'Cinemark Bourbon Ipiranga', cityId },
    { nome: 'Cinemark Iguatemi', cityId }
  ];
};

const getAllCities = () => {
  if (simulateError.allCities) {
    throw new Error('Error fetching cinemas by cities');
  }

  if (simulateNotFound.allCities) {
    return [];
  }

  return [
    { cidade: 'Gravataí' },
    { cidade: 'Porto Alegre' }
  ];
};

module.exports = { getCinemasByCityId, getAllCities, simulateNotFound, simulateError };