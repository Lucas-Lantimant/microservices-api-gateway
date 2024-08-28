# Microservices Movie & Movie Theater Catalog System

This project consists of two microservices: one for managing movies and another for managing cinema catalogs. Both microservices are accessed through an API Gateway. Each microservice, as well as the API Gateway, has its own MongoDB database and server, which are currently running on localhost but are designed to operate independently on separate servers in a production environment.

The project includes comprehensive testing using Jest and Supertest, achieving 100% code coverage.

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Setup](#setup)
- [Running the Microservices](#running-the-microservices)
- [Testing](#testing)
- [Authentication Methods: JWT Tokens vs. Traditional Sessions](#authentication-methods-jwt-tokens-vs-traditional-sessions)

## Project Overview

The system is composed of three main components:

- **Movies Service:** Handles the management and retrieval of movies.
- **Movie Theater Catalog Service:** Manages and provides information about cinemas and the movies they are showing.
- **API Gateway:** Acts as a single entry point to route requests to the appropriate microservices.

Each service is designed to operate independently, with its own database and server, ensuring scalability and fault tolerance.

## Architecture

### Movies Service:
- Provides endpoints for retrieving movie information, including premieres, and managing movie data.
- Utilizes MongoDB for data storage.
- Implements JWT authentication for secure access.

### Movie Theater Catalog Service:
- Provides endpoints for retrieving cinema information by city or cinema ID, along with the movies available in those cinemas.
- Also uses MongoDB for data storage.
- Implements JWT authentication for secure access.

### API Gateway:
- Routes requests to the appropriate microservices based on the endpoint.
- Manages authentication and authorization via JWT tokens.
- Provides endpoints for login and logout.

## Environment Variables

Each service uses a `.env` file to configure essential environment variables. Below are the required variables for each service:

### API Gateway

```
MONGO_CONNECTION= # Connection string for MongoDB (if applicable)
DATABASE= # Database name used by the API Gateway (if applicable)
MOVIES_API=http://localhost:3001 # URL for the Movies Service
CATALOG_API=http://localhost:3002 # URL for the Cinema Catalog Service
PORT=3000 # Port on which the API Gateway will run
MONGO_STORE_SECRET=your_mongo_store_secret # Secret for session management, if used
EXPIRES=3600 # Token expiration time in seconds (e.g., 3600 for 1 hour)
```

### Movie Theater Service

```
MONGO_CONNECTION= # Connection string for MongoDB
DATABASE=cinema_catalog_db # Database name for the Cinema Catalog Service
PORT=3002 # Port on which the Cinema Catalog Service will run
MS_NAME=cinema_catalog_service # Microservice name (useful for logging or identification)
SECRET=your_jwt_secret_key # Secret key used for JWT authentication
```

### Movies Service

```
MONGO_CONNECTION= # Connection string for MongoDB
DATABASE=movies_db # Database name for the Movies Service
PORT=3001 # Port on which the Movies Service will run
MS_NAME=movies_service # Microservice name (useful for logging or identification)
SECRET=your_jwt_secret_key # Secret key used for JWT authentication
```

## Setup

To set up the project locally, follow these steps:

1. **Clone the repository** to your local machine.
2. **Install dependencies** for each service using `npm install`.
3. **Create a `.env` file** in the root directory of each service (`apiGateway`, `cinemaCatalog`, `moviesService`) with the appropriate environment variables as shown above.
4. **Start the MongoDB server** if it's not running already.


## Running the Microservices

To start each microservice and the API Gateway, run the following command in each service's directory:

```
npm start
```
This command will start the service on the port specified in its .env file.

## Testing
All services have been tested using Jest and Supertest. The tests cover 100% of the code, ensuring the reliability of the system. To run the tests, use the following command in the root directory of each service:

```
npm test
```
```
npm test specificJS_file
```

## Authentication Methods: JWT Tokens vs. Traditional Sessions

When it comes to handling user authentication, two common methods are using JSON Web Tokens (JWT) and traditional session-based authentication. Each approach has its own set of advantages and trade-offs. Here’s a breakdown of how they compare:

### 1. Storage and Management

**JWT Tokens:**
- **Storage:** JWTs are typically stored in `localStorage`, `sessionStorage`, or as cookies.
- **Management:** Once a JWT is issued after authentication, it’s sent by the client in the `Authorization` header with each request. The server doesn't need to maintain session state as the token contains all necessary information.

**Traditional Sessions:**
- **Storage:** Session information is kept on the server, often in a database or in-memory store, while a session ID is sent to the client in a cookie.
- **Management:** The client stores the session ID in a cookie, which is sent automatically with each request. The server checks the session ID against its stored data to authenticate the user.

### 2. Session State

**JWT Tokens:**
- **Stateless:** JWTs allow for stateless authentication, meaning the server doesn't need to keep track of user sessions. The token itself contains the user’s credentials and is self-contained.
- **Scalability:** This stateless nature makes scaling horizontally easier, as any server instance can validate the token without needing access to shared session storage.

**Traditional Sessions:**
- **Stateful:** Traditional sessions are stateful; the server maintains the state of the session. This can make horizontal scaling more complex, as all server instances need access to the same session store.

### 3. Security

**JWT Tokens:**
- **Storage:** Storing JWTs in `localStorage` or `sessionStorage` can expose them to XSS attacks. If stored in cookies, they should be secured with `HttpOnly` and `Secure` flags.
- **Expiration:** JWTs have expiration times. Expired tokens need to be refreshed, often with a refresh token mechanism.

**Traditional Sessions:**
- **Storage:** Session cookies should also use `HttpOnly` and `Secure` flags to protect against XSS and CSRF attacks.
- **Expiration:** Sessions have expiration times, managed by the server. Expired sessions can be easily invalidated by the server.

### 4. Performance and Scalability

**JWT Tokens:**
- **Performance:** JWTs can reduce server load as they don’t require session lookups for each request. However, if the tokens are large, it can impact performance.
- **Scalability:** Easier to scale horizontally because the token can be validated by any server instance without needing to sync session data.

**Traditional Sessions:**
- **Performance:** There might be performance overhead due to session lookups in the session store.
- **Scalability:** Horizontal scaling requires shared session storage or synchronization between servers, which can be complex.

### 5. Flexibility

**JWT Tokens:**
- **Flexibility:** Well-suited for modern web applications, especially those with APIs or microservices. Tokens can be easily included in HTTP headers and are useful for cross-service authentication.

**Traditional Sessions:**
- **Flexibility:** Traditionally used in web applications where the server manages the session state. It’s less suited for scenarios where authentication needs to be shared across different services.

### Summary

**JWT Tokens:** Provide a stateless, scalable authentication mechanism that’s well-suited for modern applications and APIs. They require careful management of storage and token expiration.

**Traditional Sessions:** Offer a more centralized way to manage user sessions, which can be simpler in some contexts but may complicate scaling and session management.

Choosing between JWT tokens and traditional sessions depends on factors like application architecture, scalability needs, and security considerations.

---

### License

`MIT License`

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.