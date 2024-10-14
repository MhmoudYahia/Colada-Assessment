# Colada-Assessment

## Getting Started

Follow these steps to set up and run the project.

### Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/)

### Step 1: Build the Docker Image

Navigate to the project directory and build the Docker image.

```sh
cd path/to/your/project
docker build -t mahmoudyahia/backend-image:latest .
```

### Step 2: Run Docker Compose

Start the services defined in the docker-compose.yml file.

```sh
docker-compose up
```

### Step 3: Install Dependencies

Open a new terminal, navigate to the project directory, and install the npm dependencies.

```sh
npm install
```

### Step 4: Start the Development Server

Run the development server.

```sh
npm run start:dev
```
