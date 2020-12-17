

const { EventHubConsumerClient } = require("@azure/event-hubs");
import { GetCurrentJobId, ClearJobQueue, SetRobotReadyFlag } from './RobotControl.js'
import * as cosmos from './cosmosDB.js'

// If you have access to the Event Hub-compatible connection string from the Azure portal, then
// you can skip the Azure CLI commands above, and assign the connection string directly here.
const eventHubConnectionString = "Endpoint=sb://ihsuprodblres017dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=2XJh6Mep2CAn+UjZIMi43CGljUIc5m03Tugl0gcW3Kc=;EntityPath=iothub-ehub-ele400-opt-5410270-d2f648a180";


// Event listener
const clientOptions = {};
const consumerClient =
      new EventHubConsumerClient("$Default", eventHubConnectionString, clientOptions);


var printError = function (err)
{
    console.log(err.message);
};

var telemetryCount = 0;
var razOnceFlag = false;

function monitorTelemetryCount()
{
    var monitor = setInterval(function() {
	telemetryCount = telemetryCount / 2.0;
	console.log(`telemetry received in Hz : ${telemetryCount}`)
	telemetryCount = 0;
    }, 2000);
}

var processMessages = async function (messages)
{
    for (const message of messages)
    {
	++telemetryCount;
	
	//console.log("Received telemetry from device")
	console.log(JSON.stringify(message.body));
	const telemetry = message.body;

	// Update the RobotControl ready status (for next command)
	if (telemetry.hasOwnProperty('status') &&
	    telemetry.hasOwnProperty('jobStatus'))/* &&
	    telemetry.hasOwnProperty('jobId'))*/
	{
	    const deviceStatus = telemetry.status;
	    const jobStatus = telemetry.jobStatus;
	    //const currentJobId = telemetry.jobId;
	    const currentJobId = GetCurrentJobId();

	    let flagSetDone = false;

	    // Check the ready status
	    if (deviceStatus == 'Ready')
	    {
		SetRobotReadyFlag(true);
		flagSetDone = true;
	    }
	    else
	    {
		SetRobotReadyFlag(false);
	    }

	    // Update the status of the job
	    if (currentJobId != "")
	    {
		try
		{
		    let dbItem = await cosmos.QueryJob(currentJobId);
		    
		    // The done field of a command flags a command as done, i.e. it can no
		    // longer be cancelled
		    if (flagSetDone)
			dbItem.done = 'true';
		    dbItem.commandStatus = jobStatus;
		    
		    await cosmos.UpdateJobItem(dbItem);
		}
		catch (e)
		{
		    console.log("\nCRITICAL: Failed to query/update job");
		    console.log(`Job ID = ${currentJobId}\n`);
		}
	    }
	}
	else
	{
	    console.log("\nCRITICAL :");
	    console.log("Missing fields 'status', 'jobStatus' or 'currentJobId' in telemetry !");
	    console.log("Job queue and commands will not work\n");
	}

	// Check for Reset triggered
	if (telemetry.hasOwnProperty('raz'))
	{
	    const razFlag = telemetry.raz;
	    /*if (razFlag == 'true' && !razOnceFlag)
	    {
		// Clear the job queue
		razOnceFlag = true;
		ClearJobQueue();
	    }
	    else if (razFlag != 'true')
	    {
		razOnceFlag = false;
	    }
	    */
	    if (razFlag == 'true')
	    {
		ClearJobQueue();
	    }
	}
	else
	{
	    console.log("\nWARNING :  'raz' parameter not set in telemetry\n")
	}
	
	// Add telemetry data to database
	await cosmos.AddTelemetryItem(telemetry);
    }
}


// Subscribe to messages from all partitions as below
// To subscribe to messages from a single partition, use the overload of the same method.
export async function InitTelemetryConsumer()
{
    consumerClient.subscribe({
	processEvents: processMessages,
	processError: printError,
    });

    // Uncomment this to line to print the telemetry receiving rate in Hz
    monitorTelemetryCount();
    
    console.log('Subscribed to event hub consumer group');
}
