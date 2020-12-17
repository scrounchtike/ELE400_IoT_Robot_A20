
//import jobClient from './iothubConfig'
import * as cosmos from './cosmosDB.js'

var uuid = require('uuid');

//var JobClient = require('azure-iothub').JobClient;
//const iothubConnectionString = 'HostName=ELE400-OptimusPrime.azure-devices.net;SharedAccessKeyName=Robot;SharedAccessKey=a5OBh2RjpSnVN3z1CVicMQoj37axsVdGBvJ7QOIwqHc='
//var jobClient = JobClient.fromConnectionString(iothubConnectionString);
import { client, registry, jobClient } from './iothubConfig.js'


// Update the status of a job in the database
// The 'commandStatus' entry is initialized to "Waiting for status" and will
// be filled later when the device provides the information with telemetry
function UpdateCommandStatus(dbItem, jobId, result)
{
    // Update job entry in the database
    dbItem.requestStatus = result.status;
    dbItem.commandStatus = "Waiting for status";
    
    cosmos.UpdateJobItem(dbItem);
}

// Monitor the status of the current job every 2000 ms
// The 'requestStatus' entry is updated in the job entry of the database
function monitorJob (dbItem, jobId, callback)
{
    var jobMonitorInterval = setInterval(function() {
        jobClient.getJob(jobId, function(err, result) {
            if (err)
	    {
                console.error('Could not get job status: ' + err.message);
            }
	    else
	    {
                console.log('Job: ' + jobId + ' - status: ' + result.status);

		// Update the database item
		UpdateCommandStatus(dbItem, jobId, result);
		
		// Upon completion (either failed or success print to console)
                if (result.status === 'completed' || result.status === 'failed' || result.status === 'cancelled')
		{
                    clearInterval(jobMonitorInterval);
                    callback(null, result);
                }
            }
        });
    }, 5000);
}

// InvokeCommandFromJobId(jobId)
// 
// Invokes the 'command' method on the IoT device with the payload
// associated with a given jobId. The job data is queried from the databse
// where it was first inserted in the queuing phase.
//
// The invokeMethod payload is a JSON of the following format :
// [{
//    'commandName' = 'linear',     // linear, angular or reset
//    'payload' = {                 // Appropriate payload depending on the command
//        'distance' = '10',
//        'speed' = '2'
//    }
// }]
//
// Once the job is scheduled on the device, its requestStatus entry is updated to 'Sent'
// in the cosmos database. The JobClient will update this requestStatus to 'running' and
// then eventually 'completed' once the command has been invoked.
//
// Note that 'requestStatus' = 'complete' does not indicate that the job is done, just that the
// request invoke was performed. The IoT device will update its 'jobStatus' information in
// the telemetry.
//
export async function InvokeCommandFromJobID(jobId)
{
    console.log("Sending command to robot via InvokeDeviceMethod");
    
    // Get the database entry
    let dbItem = await cosmos.QueryJob(jobId);
    const commandName = dbItem.commandName;
    const commandPayload = dbItem.payload;

    // Direction parameter
    // 0: Advance
    // 1: Reverse
    // 2. CW
    // 3. CCW
    let direction = 0; // Advance
    if (commandPayload.distance < 0)
	direction = (direction + 1) % 2;
    if (commandPayload.speed < 0)
	direction = (direction + 1) % 2;
    if (commandName == "angular" || commandName == "rotation")
	direction += 2;

    var methodParams = {
        methodName: 'Command', // Unique client method for all commands
        payload: {
	    "cmd": commandName,
	    "jobId": dbItem.jobID,
	    "direction": direction.toString(),
	    "value": Math.abs(commandPayload.distance).toString(),
	    "speed": Math.abs(commandPayload.speed).toString()
	}, // Contains actual command information
        responseTimeoutInSeconds: 5 // Timeout after 5 seconds if device has not responded
    };

    
    jobClient.scheduleDeviceMethod(
	jobId,
	"deviceId IN ['Robot']", // unique client to invoke method on
	methodParams,
	new Date(),
	5,   // Is not used
	function(err)
	{
	    if (err) {
		console.error('Could not schedule device method job: ' + err.message);
	    } else {
		monitorJob(dbItem, jobId, function(err, result) {
		    if (err) {
			console.error('Could not monitor device method job: ' + err.message);
		    } else {
			console.log("result = \n");
			console.log(JSON.stringify(result, null, 2));
		    }
		});
	    }
	}
    );
    
    // Update the job database entry to 'Sent' status
    dbItem.requestStatus = "Sent";
    dbItem.commandStatus = "Waiting for status";
    cosmos.UpdateJobItem(dbItem);
}
