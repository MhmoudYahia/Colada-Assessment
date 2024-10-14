import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import http from 'http'; // Import the 'http' module
import https from 'https'; // Import the 'https' module
import app from './app';
import { connectToMongoDB } from './db';

process.on('uncaughtException', (err: Error) => {
  console.log('uncaught exception'.toUpperCase(), ',Shutting down......');
  console.log(err.name, err.message);
});

const PORT = process.env.PORT || 2000;

let server: http.Server | https.Server;

(async () => {
  try {
    // connection with DB here
    await connectToMongoDB();

    console.log('DB connection established ✔️');

    let serverCreator = () => http.createServer(app);

    server = serverCreator().listen(PORT, () => {
      console.log(`Server listening on port ${PORT} 🚀`);
    });

  } catch (err) {
    console.log((err as Error).name, (err as Error).message);
  }
})();

process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandled Rejection'.toUpperCase(), ',Shutting down....');
  console.log(err.name, err.message);
});
