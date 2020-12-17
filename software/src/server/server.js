
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.config.js'
import cors from 'cors'

import {client, registry} from './iothubConfig'
import * as cosmos from './cosmosDB.js'
import { CallCommand, CancelCommand, SetRobotReadyFlag } from './RobotControl.js'
import bodyParser from 'body-parser'
import { InitTelemetryConsumer } from './EventConsumer.js'

const app = express()
const DIST_DIR = __dirname
const HTML_FILE = path.join(DIST_DIR, 'index.html')
const compiler = webpack(config)

// Webpack Dev Middleware for recompiling after changes (needs page refresh)
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

// Webpack Hot Middleware for hot-reloading of changes (automatically refreshes page)
app.use(webpackHotMiddleware(compiler))

app.use(bodyParser());

//app.use(cors());

// Init telemetry consumer
InitTelemetryConsumer();

app.get("/api/devices/list", function(req, res)
{
    if (!registry) return res.send([]);

    registry.list((error, list) => {
        const names = list.map(d => d.deviceId);
        res.send(names);
    });
    console.log("Got devices list from Azure IoT-Hub");
})

app.get("/api/cosmosdb/telemetry", async(req, res) =>
{
    //console.log("Querying telemetry data from CosmosDB database")

    const num_items = 1; // 1 telemetry per query
    const items = await cosmos.QueryTelemetry(num_items);

    // For HTML output
    //let itemsStringified = JSON.stringify(items, null, 2);
    //let htmlOutput = itemsStringified.replace(/\n/g, "<br />");
    //res.send(htmlOutput);
    res.send(items);

    //console.log("Got telemetry from cosmos DB")
})

app.get("/api/cosmosdb/jobs", async(req, res) =>
{
    //console.log("Querying jobs data from CosmosDB database");

    const jobs = await cosmos.QueryJobs();

    // For HTML output
    //let jobsStringified = JSON.stringify(jobs, null, 2);
    //let htmlOutput = jobsStringified.replace(/\n/g, "<br />");
    //res.send(htmlOutput);
    res.send(jobs);

    //console.log("Got jobs from cosmos DB");
})

app.get("/api/command/ready", async(req, res) =>
{
    console.log("Reset robot ready flag to 'true' (ready)");

    // Reset the ready flag of the robot (Enables sending the next command)
    SetRobotReadyFlag(true);
})

app.get("/api/command/call", async(req, res) =>
{
    console.log("Send command to robot using clientToDevice method invoke")

    const type = 'linear';
    const payload = {
	'distance': '20',   // 20 cm
	'speed': '5'        // 5 cm/s
    };

    const jobId = CallCommand(type, payload);
})

app.post("/api/command/call", async(req, res) =>
{
    const payload = req.body;
    const {type, ...configuration} = payload;
    console.log(payload);
    
    const jobId = await CallCommand(type, configuration);
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})



