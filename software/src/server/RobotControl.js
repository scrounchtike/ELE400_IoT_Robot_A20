
import * as cosmos from './cosmosDB.js'
var uuid = require('uuid');

import { InvokeCommand, InvokeCommandFromJobID } from './JobScheduler.js'
import { Queue } from './JobQueue.js'


// JobQueue
let jobQueue = new Queue();

// Current Job ID last sent
let currentJobId = "";


// Send a command to the robot through Azure iothub
// Type is a string specific to the command ('linear', 'angular', 'reset')
// The payload is type dependent and is JSON formatted, for a rotation command :
// type = 'angular'
// {
//   'angle': '60',            // In degrees
//   'speed': '30'             // In deg/s
// }
//
// type = 'linear'
// For linear displacement:
// {
//   'distance': '20',            // In cm
//   'speed': '5'                 // In cm/s
// }
//
// type = 'reset'
// For a reset command, the payload should only contain
// {
//    'reset': 'true'
// }
// The payload of a reset command does not really matter
//
export async function CallCommand(type, payload)
{
    // Add new job to the database
    // Force it to be done before continuing execution !
    // Starting status will be 'queued'
    var uniqueJobId = uuid.v4();
    if (type == "angular")
	type = "rotation";
    let createdItem = await cosmos.AddJobItem(uniqueJobId, type, payload);
    console.log(`\ncreated item job id = ${createdItem.jobID}\n`);
    console.log(`\ncreated item command name = ${createdItem.commandName}\n`);
    
    // Queue it
    // We can query the command info later from the database using the unique job ID
    jobQueue.enqueue(uniqueJobId);
    console.log(`Job queue queued jobs count = ${jobQueue.length()}`);

    return uniqueJobId;
}

async function InvokeCancelMethod(jobId)
{
    const methodParams = {
        methodName: 'CancelCommand',
        payload:
	{
	    "jobId": jobId
	},
        timeoutInSeconds: 10
    };
    
    client.invokeDeviceMethod("Robot", methodParams, function(error, result) {
        if (err) {
            console.error(`Failed to invoke method ${methodParams.methodName}: ${err.toString()}`);
            return false;
        } else {
            return true;
        }
    });

    return true;
}

// CancelCommand(jobId)
// Cancels a command using its jobID
//
// Job has to be queued or running to be able to cancel
// If a job is already done, CancelCommand() does not do anything
//
// If the job is only queued, then jobID is simply removed from the queue
//
// If the job was sent to device and is currently running (done != 'true') then
// we invoke a special method 'CancelCommand' with the jobID to command the device
// to cancel the jobID passed. The JobID is sent as a precaution, the device makes sure the jobID
// received matches the current job ID.
//
export async function CancelCommand(jobId)
{
    console.log(`Trying to cancel job ID = ${jobId}`);

    // Get the job item from the database
    let dbItem = await cosmos.QueryJob(jobId);

    // Test that the job is not completed yet
    // If the job has already been completed, then the field 'done' will be set to true
    if (dbItem.done == 'true')
    {
	// Can't cancel an already done job
	return false;
    }

    // Remove the job from the queue if present
    const jobIndex = jobQueue.find(jobId);
    if (jobIndex != -1)
    {
	// Job is inside the queue
	// Remove job from queue
	jobQueue.removeIndex(jobIndex);

	// Update the database job entry
	dbItem.requestStatus = 'Cancelled';
	// Command will not be sent
	dbItem.commandStatus = 'Cancelled';
	await cosmos.UpdateJobItem(dbItem);
    }
    else
    {
	// Job was already sent to the device,
	// Update the database job entry
	dbItem.requestStatus = 'Cancelled';
	// We will update the commandStatus to 'Cancelled' upon confirmation of
	// cancellation by the device
	dbItem.commandStatus = 'Cancelling';
	await cosmos.UpdateJobItem(dbItem);
	
	// Send a cancel message to the device
	const cancelSent = await InvokeCancelMethod(jobId);
	if (!cancelSent)
	    console.log(`Failed to cancel job ID = ${jobId}`);
    }    
    
    console.log(`Successfully cancelled job ID = ${jobId}`);
    return true;
}


//
// Clear the job queue
// Happens when a reset (remise-a-zero) is triggered by telemetry
//
export function ClearJobQueue()
{
    console.log('Clearing job queue');
    jobQueue.clear();
}

export function GetCurrentJobId()
{
    return currentJobId;
}


//
// Periodically check if the robot is ready to receive a new command from the queue
// Checks every 500 ms
//

// Flag to indicate whether device (robot) is ready to receive a new command
// When a command is sent through invocation, this flag is set to false, effectively
// disabling further commands
// The flag is set to true when the robot updates the telemetry field 'status' to 'ready'.
// The robot should only set this 'status' to 'ready' when it is done executing a command.
let robotReady = true;

export function SetRobotReadyFlag(ready)
{
    robotReady = ready;
}


// monitorQueue calls lambda periodically to check wheter the robot
// is ready to receive a new command
function monitorQueue()
{
    var queueMonitorInterval = setInterval(function() {
	//console.log(`robot ready = ${robotReady}`);
	if (robotReady)
	{
	    // Check if a job is queued
	    if (jobQueue.length() != 0)
	    {
		var jobId = jobQueue.dequeue();
		
		// Invoke method on robot
		InvokeCommandFromJobID(jobId);

		// Update current jobID
		currentJobId = jobId;
		
		// Reset the ready flag
		robotReady = false;
	    }
	}
    }, 1000) // Check job queue every 1s
}

monitorQueue();

