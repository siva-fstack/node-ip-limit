import dotenv from "dotenv";
import express from "express";
import cors from 'cors';

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.SERVER_PORT;

let ipHitsMap: any = {};
const limit: any = process.env.REQ_LIMIT;
const minutes: number = 1000 * 60;
const ipInterval: any = process.env.RESET_INTERVAL;
const resetInterval: any = minutes * ipInterval;


console.log(limit);
console.log(resetInterval);
console.log(minutes);

const app = express();
app.use(cors())


// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send(`welcome to CarTrack`)
} );



app.post( "/login", ( req, res, next ) => {
    const requesterIp = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown');
    startResetInterval();
    console.log('requesterIp', requesterIp);

    if (!ipHitsMap[requesterIp]) {
      ipHitsMap[requesterIp] = 1;
    } else {
      ipHitsMap[requesterIp] = ipHitsMap[requesterIp] + 1;
    }

    if (ipHitsMap[requesterIp] > limit) {
      const rate = resetInterval/minutes;
      console.log( `Your ip has exceeded the ${limit} request limit per ${rate} minute(s). Try again in ${rate} minute(s).`)
      res.send( { message: `Your ip has exceeded the ${limit} request limit per ${rate} minute(s). Try again in ${rate} minute(s).`, timestamp: Date.now()})
    } else {
        res.send({ message: `welcome to CarTrack`, timestamp: Date.now()})
    }
} );

function startResetInterval(interval = resetInterval) {
    setInterval(() => resetIpHitsMap(), interval);
}

function resetIpHitsMap() {
    ipHitsMap = {};
}

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );