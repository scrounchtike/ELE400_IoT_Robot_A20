/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/EventConsumer.js":
/*!*************************************!*\
  !*** ./src/server/EventConsumer.js ***!
  \*************************************/
/*! namespace exports */
/*! export InitTelemetryConsumer [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"InitTelemetryConsumer\": () => /* binding */ InitTelemetryConsumer\n/* harmony export */ });\n/* harmony import */ var _RobotControl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RobotControl.js */ \"./src/server/RobotControl.js\");\n/* harmony import */ var _cosmosDB_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cosmosDB.js */ \"./src/server/cosmosDB.js\");\nconst {\n  EventHubConsumerClient\n} = __webpack_require__(/*! @azure/event-hubs */ \"@azure/event-hubs\");\n\n\n // If you have access to the Event Hub-compatible connection string from the Azure portal, then\n// you can skip the Azure CLI commands above, and assign the connection string directly here.\n\nconst eventHubConnectionString = \"Endpoint=sb://ihsuprodblres017dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=2XJh6Mep2CAn+UjZIMi43CGljUIc5m03Tugl0gcW3Kc=;EntityPath=iothub-ehub-ele400-opt-5410270-d2f648a180\"; // Event listener\n\nconst clientOptions = {};\nconst consumerClient = new EventHubConsumerClient(\"$Default\", eventHubConnectionString, clientOptions);\n\nvar printError = function (err) {\n  console.log(err.message);\n};\n\nvar telemetryCount = 0;\n\nfunction monitorTelemetryCount() {\n  var monitor = setInterval(function () {\n    telemetryCount = telemetryCount / 2.0;\n    console.log(`telemetry received in Hz : ${telemetryCount}`);\n    telemetryCount = 0;\n  }, 2000);\n}\n\nvar processMessages = async function (messages) {\n  for (const message of messages) {\n    ++telemetryCount; //console.log(\"Received telemetry from device\")\n\n    console.log(JSON.stringify(message.body));\n    const telemetry = message.body; // Update the RobotControl ready status (for next command)\n\n    if (telemetry.hasOwnProperty('status') && telemetry.hasOwnProperty('jobStatus'))\n      /* &&\n      telemetry.hasOwnProperty('jobId'))*/\n      {\n        const deviceStatus = telemetry.status;\n        const jobStatus = telemetry.jobStatus; //const currentJobId = telemetry.jobId;\n\n        const currentJobId = (0,_RobotControl_js__WEBPACK_IMPORTED_MODULE_0__.GetCurrentJobId)();\n        let flagSetDone = false; // Check the ready status\n\n        if (deviceStatus == 'Ready') {\n          (0,_RobotControl_js__WEBPACK_IMPORTED_MODULE_0__.SetRobotReadyFlag)(true);\n          flagSetDone = true;\n        } else {\n          (0,_RobotControl_js__WEBPACK_IMPORTED_MODULE_0__.SetRobotReadyFlag)(false);\n        } // Update the status of the job\n\n\n        if (currentJobId != \"\") {\n          try {\n            let dbItem = await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_1__.QueryJob(currentJobId); // The done field of a command flags a command as done, i.e. it can no\n            // longer be cancelled\n\n            if (flagSetDone) dbItem.done = 'true';\n            dbItem.commandStatus = jobStatus;\n            await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_1__.UpdateJobItem(dbItem);\n          } catch (e) {\n            console.log(\"\\nCRITICAL: Failed to query/update job\");\n            console.log(`Job ID = ${currentJobId}\\n`);\n          }\n        }\n      } else {\n      console.log(\"\\nCRITICAL :\");\n      console.log(\"Missing fields 'status', 'jobStatus' or 'currentJobId' in telemetry !\");\n      console.log(\"Job queue and commands will not work\\n\");\n    } // Check for Reset triggered\n\n\n    if (telemetry.hasOwnProperty('raz')) {\n      const razFlag = telemetry.raz;\n\n      if (razFlag == 'true') {\n        // Clear the job queue\n        (0,_RobotControl_js__WEBPACK_IMPORTED_MODULE_0__.ClearJobQueue)();\n      }\n    } else {\n      console.log(\"\\nWARNING :  'raz' parameter not set in telemetry\\n\");\n    } // Add telemetry data to database\n\n\n    await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_1__.AddTelemetryItem(telemetry);\n  }\n}; // Subscribe to messages from all partitions as below\n// To subscribe to messages from a single partition, use the overload of the same method.\n\n\nasync function InitTelemetryConsumer() {\n  consumerClient.subscribe({\n    processEvents: processMessages,\n    processError: printError\n  }); // Uncomment this to line to print the telemetry receiving rate in Hz\n\n  monitorTelemetryCount();\n  console.log('Subscribed to event hub consumer group');\n}\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/EventConsumer.js?");

/***/ }),

/***/ "./src/server/JobQueue.js":
/*!********************************!*\
  !*** ./src/server/JobQueue.js ***!
  \********************************/
/*! namespace exports */
/*! export Queue [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Queue\": () => /* binding */ Queue\n/* harmony export */ });\n//\n// Constructor of the queue\n//\nfunction Queue() {\n  this.elements = [];\n} //\n// Interface of the queue\n//\n\nQueue.prototype.enqueue = function (e) {\n  this.elements.push(e);\n};\n\nQueue.prototype.dequeue = function () {\n  return this.elements.shift();\n};\n\nQueue.prototype.isEmpty = function () {\n  return this.elements.length == 0;\n};\n\nQueue.prototype.length = function () {\n  return this.elements.length;\n};\n\nQueue.prototype.find = function (e) {\n  return this.elements.indexOf(e);\n};\n\nQueue.prototype.removeIndex = function (i) {\n  this.elements.splice(i, 1);\n};\n\nQueue.prototype.clear = function () {\n  this.elements.splice(0, this.elements.length);\n};\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/JobQueue.js?");

/***/ }),

/***/ "./src/server/JobScheduler.js":
/*!************************************!*\
  !*** ./src/server/JobScheduler.js ***!
  \************************************/
/*! namespace exports */
/*! export InvokeCommandFromJobID [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"InvokeCommandFromJobID\": () => /* binding */ InvokeCommandFromJobID\n/* harmony export */ });\n/* harmony import */ var _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cosmosDB.js */ \"./src/server/cosmosDB.js\");\n/* harmony import */ var _iothubConfig_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iothubConfig.js */ \"./src/server/iothubConfig.js\");\n//import jobClient from './iothubConfig'\n\n\nvar uuid = __webpack_require__(/*! uuid */ \"uuid\"); //var JobClient = require('azure-iothub').JobClient;\n//const iothubConnectionString = 'HostName=ELE400-OptimusPrime.azure-devices.net;SharedAccessKeyName=Robot;SharedAccessKey=a5OBh2RjpSnVN3z1CVicMQoj37axsVdGBvJ7QOIwqHc='\n//var jobClient = JobClient.fromConnectionString(iothubConnectionString);\n\n\n // Update the status of a job in the database\n// The 'commandStatus' entry is initialized to \"Waiting for status\" and will\n// be filled later when the device provides the information with telemetry\n\nfunction UpdateCommandStatus(dbItem, jobId, result) {\n  // Update job entry in the database\n  dbItem.requestStatus = result.status;\n  dbItem.commandStatus = \"Waiting for status\";\n  _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__.UpdateJobItem(dbItem);\n} // Monitor the status of the current job every 2000 ms\n// The 'requestStatus' entry is updated in the job entry of the database\n\n\nfunction monitorJob(dbItem, jobId, callback) {\n  var jobMonitorInterval = setInterval(function () {\n    _iothubConfig_js__WEBPACK_IMPORTED_MODULE_1__.jobClient.getJob(jobId, function (err, result) {\n      if (err) {\n        console.error('Could not get job status: ' + err.message);\n      } else {\n        console.log('Job: ' + jobId + ' - status: ' + result.status); // Update the database item\n\n        UpdateCommandStatus(dbItem, jobId, result); // Upon completion (either failed or success print to console)\n\n        if (result.status === 'completed' || result.status === 'failed' || result.status === 'cancelled') {\n          clearInterval(jobMonitorInterval);\n          callback(null, result);\n        }\n      }\n    });\n  }, 5000);\n} // InvokeCommandFromJobId(jobId)\n// \n// Invokes the 'command' method on the IoT device with the payload\n// associated with a given jobId. The job data is queried from the databse\n// where it was first inserted in the queuing phase.\n//\n// The invokeMethod payload is a JSON of the following format :\n// [{\n//    'commandName' = 'linear',     // linear, angular or reset\n//    'payload' = {                 // Appropriate payload depending on the command\n//        'distance' = '10',\n//        'speed' = '2'\n//    }\n// }]\n//\n// Once the job is scheduled on the device, its requestStatus entry is updated to 'Sent'\n// in the cosmos database. The JobClient will update this requestStatus to 'running' and\n// then eventually 'completed' once the command has been invoked.\n//\n// Note that 'requestStatus' = 'complete' does not indicate that the job is done, just that the\n// request invoke was performed. The IoT device will update its 'jobStatus' information in\n// the telemetry.\n//\n\n\nasync function InvokeCommandFromJobID(jobId) {\n  console.log(\"Sending command to robot via InvokeDeviceMethod\"); // Get the database entry\n\n  let dbItem = await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__.QueryJob(jobId);\n  const commandName = dbItem.commandName;\n  const commandPayload = dbItem.payload; // Direction parameter\n  // 0: Advance\n  // 1: Reverse\n  // 2. CW\n  // 3. CCW\n\n  let direction = 0; // Advance\n\n  if (commandPayload.distance < 0) direction = (direction + 1) % 2;\n  if (commandPayload.speed < 0) direction = (direction + 1) % 2;\n  if (commandName == \"angular\" || commandName == \"rotation\") direction += 2;\n  var methodParams = {\n    methodName: 'Command',\n    // Unique client method for all commands\n    payload: {\n      \"cmd\": commandName,\n      \"jobId\": dbItem.jobID,\n      \"direction\": direction.toString(),\n      \"value\": Math.abs(commandPayload.distance).toString(),\n      \"speed\": Math.abs(commandPayload.speed).toString()\n    },\n    // Contains actual command information\n    responseTimeoutInSeconds: 5 // Timeout after 5 seconds if device has not responded\n\n  };\n  _iothubConfig_js__WEBPACK_IMPORTED_MODULE_1__.jobClient.scheduleDeviceMethod(jobId, \"deviceId IN ['Robot']\", // unique client to invoke method on\n  methodParams, new Date(), 5, // Is not used\n  function (err) {\n    if (err) {\n      console.error('Could not schedule device method job: ' + err.message);\n    } else {\n      monitorJob(dbItem, jobId, function (err, result) {\n        if (err) {\n          console.error('Could not monitor device method job: ' + err.message);\n        } else {\n          console.log(\"result = \\n\");\n          console.log(JSON.stringify(result, null, 2));\n        }\n      });\n    }\n  }); // Update the job database entry to 'Sent' status\n\n  dbItem.requestStatus = \"Sent\";\n  dbItem.commandStatus = \"Waiting for status\";\n  _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__.UpdateJobItem(dbItem);\n}\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/JobScheduler.js?");

/***/ }),

/***/ "./src/server/RobotControl.js":
/*!************************************!*\
  !*** ./src/server/RobotControl.js ***!
  \************************************/
/*! namespace exports */
/*! export CallCommand [provided] [no usage info] [missing usage info prevents renaming] */
/*! export CancelCommand [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ClearJobQueue [provided] [no usage info] [missing usage info prevents renaming] */
/*! export GetCurrentJobId [provided] [no usage info] [missing usage info prevents renaming] */
/*! export SetRobotReadyFlag [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CallCommand\": () => /* binding */ CallCommand,\n/* harmony export */   \"CancelCommand\": () => /* binding */ CancelCommand,\n/* harmony export */   \"ClearJobQueue\": () => /* binding */ ClearJobQueue,\n/* harmony export */   \"GetCurrentJobId\": () => /* binding */ GetCurrentJobId,\n/* harmony export */   \"SetRobotReadyFlag\": () => /* binding */ SetRobotReadyFlag\n/* harmony export */ });\n/* harmony import */ var _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cosmosDB.js */ \"./src/server/cosmosDB.js\");\n/* harmony import */ var _JobScheduler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JobScheduler.js */ \"./src/server/JobScheduler.js\");\n/* harmony import */ var _JobQueue_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JobQueue.js */ \"./src/server/JobQueue.js\");\n\n\nvar uuid = __webpack_require__(/*! uuid */ \"uuid\");\n\n\n // JobQueue\n\nlet jobQueue = new _JobQueue_js__WEBPACK_IMPORTED_MODULE_2__.Queue(); // Current Job ID last sent\n\nlet currentJobId = \"\"; // Send a command to the robot through Azure iothub\n// Type is a string specific to the command ('linear', 'angular', 'reset')\n// The payload is type dependent and is JSON formatted, for a rotation command :\n// type = 'angular'\n// {\n//   'angle': '60',            // In degrees\n//   'speed': '30'             // In deg/s\n// }\n//\n// type = 'linear'\n// For linear displacement:\n// {\n//   'distance': '20',            // In cm\n//   'speed': '5'                 // In cm/s\n// }\n//\n// type = 'reset'\n// For a reset command, the payload should only contain\n// {\n//    'reset': 'true'\n// }\n// The payload of a reset command does not really matter\n//\n\nasync function CallCommand(type, payload) {\n  // Add new job to the database\n  // Force it to be done before continuing execution !\n  // Starting status will be 'queued'\n  var uniqueJobId = uuid.v4();\n  if (type == \"angular\") type = \"rotation\";\n  let createdItem = await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__.AddJobItem(uniqueJobId, type, payload);\n  console.log(`\\ncreated item job id = ${createdItem.jobID}\\n`);\n  console.log(`\\ncreated item command name = ${createdItem.commandName}\\n`); // Queue it\n  // We can query the command info later from the database using the unique job ID\n\n  jobQueue.enqueue(uniqueJobId);\n  console.log(`Job queue queued jobs count = ${jobQueue.length()}`);\n  return uniqueJobId;\n}\n\nasync function InvokeCancelMethod(jobId) {\n  const methodParams = {\n    methodName: 'CancelCommand',\n    payload: {\n      \"jobId\": jobId\n    },\n    timeoutInSeconds: 10\n  };\n  client.invokeDeviceMethod(\"Robot\", methodParams, function (error, result) {\n    if (err) {\n      console.error(`Failed to invoke method ${methodParams.methodName}: ${err.toString()}`);\n      return false;\n    } else {\n      return true;\n    }\n  });\n  return true;\n} // CancelCommand(jobId)\n// Cancels a command using its jobID\n//\n// Job has to be queued or running to be able to cancel\n// If a job is already done, CancelCommand() does not do anything\n//\n// If the job is only queued, then jobID is simply removed from the queue\n//\n// If the job was sent to device and is currently running (done != 'true') then\n// we invoke a special method 'CancelCommand' with the jobID to command the device\n// to cancel the jobID passed. The JobID is sent as a precaution, the device makes sure the jobID\n// received matches the current job ID.\n//\n\n\nasync function CancelCommand(jobId) {\n  console.log(`Trying to cancel job ID = ${jobId}`); // Get the job item from the database\n\n  let dbItem = await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__.QueryJob(jobId); // Test that the job is not completed yet\n  // If the job has already been completed, then the field 'done' will be set to true\n\n  if (dbItem.done == 'true') {\n    // Can't cancel an already done job\n    return false;\n  } // Remove the job from the queue if present\n\n\n  const jobIndex = jobQueue.find(jobId);\n\n  if (jobIndex != -1) {\n    // Job is inside the queue\n    // Remove job from queue\n    jobQueue.removeIndex(jobIndex); // Update the database job entry\n\n    dbItem.requestStatus = 'Cancelled'; // Command will not be sent\n\n    dbItem.commandStatus = 'Cancelled';\n    await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__.UpdateJobItem(dbItem);\n  } else {\n    // Job was already sent to the device,\n    // Update the database job entry\n    dbItem.requestStatus = 'Cancelled'; // We will update the commandStatus to 'Cancelled' upon confirmation of\n    // cancellation by the device\n\n    dbItem.commandStatus = 'Cancelling';\n    await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_0__.UpdateJobItem(dbItem); // Send a cancel message to the device\n\n    const cancelSent = await InvokeCancelMethod(jobId);\n    if (!cancelSent) console.log(`Failed to cancel job ID = ${jobId}`);\n  }\n\n  console.log(`Successfully cancelled job ID = ${jobId}`);\n  return true;\n} //\n// Clear the job queue\n// Happens when a reset (remise-a-zero) is triggered by telemetry\n//\n\nfunction ClearJobQueue() {\n  jobQueue.clear();\n}\nfunction GetCurrentJobId() {\n  return currentJobId;\n} //\n// Periodically check if the robot is ready to receive a new command from the queue\n// Checks every 500 ms\n//\n// Flag to indicate whether device (robot) is ready to receive a new command\n// When a command is sent through invocation, this flag is set to false, effectively\n// disabling further commands\n// The flag is set to true when the robot updates the telemetry field 'status' to 'ready'.\n// The robot should only set this 'status' to 'ready' when it is done executing a command.\n\nlet robotReady = true;\nfunction SetRobotReadyFlag(ready) {\n  robotReady = ready;\n} // monitorQueue calls lambda periodically to check wheter the robot\n// is ready to receive a new command\n\nfunction monitorQueue() {\n  var queueMonitorInterval = setInterval(function () {\n    //console.log(`robot ready = ${robotReady}`);\n    if (robotReady) {\n      // Check if a job is queued\n      if (jobQueue.length() != 0) {\n        var jobId = jobQueue.dequeue(); // Invoke method on robot\n\n        (0,_JobScheduler_js__WEBPACK_IMPORTED_MODULE_1__.InvokeCommandFromJobID)(jobId); // Update current jobID\n\n        currentJobId = jobId; // Reset the ready flag\n\n        robotReady = false;\n      }\n    }\n  }, 1000); // Check job queue every 1s\n}\n\nmonitorQueue();\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/RobotControl.js?");

/***/ }),

/***/ "./src/server/cosmosDB.js":
/*!********************************!*\
  !*** ./src/server/cosmosDB.js ***!
  \********************************/
/*! namespace exports */
/*! export AddJobItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export AddTelemetryItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! export QueryJob [provided] [no usage info] [missing usage info prevents renaming] */
/*! export QueryJobs [provided] [no usage info] [missing usage info prevents renaming] */
/*! export QueryTelemetry [provided] [no usage info] [missing usage info prevents renaming] */
/*! export UpdateJobItem [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"QueryTelemetry\": () => /* binding */ QueryTelemetry,\n/* harmony export */   \"AddTelemetryItem\": () => /* binding */ AddTelemetryItem,\n/* harmony export */   \"QueryJobs\": () => /* binding */ QueryJobs,\n/* harmony export */   \"QueryJob\": () => /* binding */ QueryJob,\n/* harmony export */   \"AddJobItem\": () => /* binding */ AddJobItem,\n/* harmony export */   \"UpdateJobItem\": () => /* binding */ UpdateJobItem\n/* harmony export */ });\nconst CosmosClient = __webpack_require__(/*! @azure/cosmos */ \"@azure/cosmos\").CosmosClient;\n\nconst config = __webpack_require__(/*! ./dbConfig */ \"./src/server/dbConfig.js\");\n\nconst {\n  endpoint,\n  key,\n  telemetryDatabaseId,\n  telemetryContainerId,\n  telemetryPartitionKey,\n  jobsDatabaseId,\n  jobsContainerId,\n  jobsPartitionKey\n} = config;\nconst client = new CosmosClient({\n  endpoint,\n  key\n}); // Telemetry database info\n\nconst telemetryDatabase = client.database(telemetryDatabaseId);\nconst telemetryContainer = telemetryDatabase.container(telemetryContainerId); // Jobs database info\n\nconst jobsDatabase = client.database(jobsDatabaseId);\nconst jobsContainer = jobsDatabase.container(jobsContainerId);\n/*\n// This script ensures that the database is setup and populated correctly\n*/\n\nasync function create(client, databaseId, containerId, partitionKey) {\n  /**\n   * Create the database if it does not exist\n   */\n  const {\n    database\n  } = await client.databases.createIfNotExists({\n    id: databaseId\n  });\n  console.log(`Created database:\\n${database.id}\\n`);\n  /**\n   * Create the container if it does not exist\n   */\n\n  const {\n    container\n  } = await client.database(databaseId).containers.createIfNotExists({\n    id: containerId,\n    partitionKey\n  }, {\n    offerThroughput: 400\n  });\n  console.log(`Created container:\\n${container.id}\\n`);\n} // Make sure Telemetry database is already setup. If not, create it.\n//create(client, telemetryDatabaseId, telemetryContainerId, telemetryPartitionKey);\n// Make sure Jobs database is already setup. If not, create it.\n\n\ncreate(client, jobsDatabaseId, jobsContainerId, jobsPartitionKey); // Query telemetry data from database\n\nconst QueryTelemetry = async (limit) => {\n  // query to return 10 items in first-to-last order\n  const querySpec = {\n    query: `SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT ${limit}`\n  }; //const { resources: items } = await container.items\n  //    .query(querySpec)\n  //    .fetchAll();\n  //console.log(`Using container :\\n${telemetryContainer.id}\\n`);\n  //console.log(`Using items :\\n${telemetryContainer.items}\\n`);\n\n  const {\n    resources\n  } = await telemetryContainer.items.query(querySpec).fetchAll(); //console.log(`Query completed, resources:\\n${resources}\\n`);\n\n  return resources;\n};\nconst AddTelemetryItem = async (payload) => {\n  const {\n    resource: createdItem\n  } = await telemetryContainer.items.create(payload);\n  console.log(`\\r\\nCreated new telemetry item: ${createdItem.id}\\r\\n`);\n  return await createdItem;\n}; // Query jobs data from database\n\nconst QueryJobs = async () => {\n  // query to return 10 items in first-to-last order\n  const querySpec = {\n    query: \"SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT 10\"\n  }; //console.log(`Using container :\\n${jobsContainer.id}\\n`);\n  //console.log(`Using items :\\n${jobsContainer.items}\\n`);\n\n  const {\n    resources\n  } = await jobsContainer.items.query(querySpec).fetchAll(); //console.log(`Query completed, resources:\\n${resources}\\n`);\n\n  return resources;\n}; // Query a single element from the jobs database\n//export const QueryJob() = async () =>\n\nasync function QueryJob(jobId) {\n  const querySpec = {\n    query: `SELECT * FROM c WHERE c.jobID = \"${jobId}\"`\n  }; //console.log(`Trying to query jobId = ${jobId} in jobs database`);\n  //console.log(`query = ${querySpec.query}`);\n\n  const {\n    resources: results\n  } = await jobsContainer.items.query(querySpec).fetchAll();\n\n  if (results.length == 0) {\n    console.log(`Error: QueryJob for id = ${jobId} returned 0 items`);\n    throw \"No items found matching\";\n  } else if (results.length > 1) {\n    console.log(`Error: QueryJob for id = ${jobId} returned more than 1 item`);\n    throw \"More than 1 item found matching\";\n  }\n\n  const job = results[0];\n  return job;\n}\nconst AddJobItem = async (jobId, type, payload) => {\n  const newJobItem = {\n    jobID: jobId,\n    commandName: type,\n    payload: payload,\n    category: \"commands\",\n    requestStatus: \"queued\",\n    // Queued, Running, Completed, Cancelled\n    commandStatus: \"sent\",\n    // Sent, Executing, Succeeded, Failed\n    done: 'false'\n  };\n  const {\n    resource: createdItem\n  } = await jobsContainer.items.create(newJobItem); //let createdItem = await jobsContainer.items.create(newJobItem);\n  //.then(function() {\n  //    console.log(`\\r\\nCreated new item: ${createdItem.id}\\r\\n`);\n  //    return createdItem; \n  //});\n\n  console.log(`\\r\\nCreated new item: ${createdItem.id}\\r\\n`);\n  console.log(`\\r\\nCreated new item: ${createdItem.jobID}\\r\\n`);\n  return await createdItem;\n};\nconst UpdateJobItem = async (jobItem) => {\n  // Update status of job\n  //console.log(`\\nJOB UPDATE`);\n  //console.log(`jobId = ${jobItem.jobID},`);\n  //console.log(`requestStatus = ${jobItem.requestStatus},`);\n  //console.log(`commandStatus = ${jobItem.commandStatus}\\n`);\n  const {\n    resource: updatedItem\n  } = await jobsContainer.item(jobItem.id).replace(jobItem);\n  console.log(`\\r\\nUpdated item jobID = ${updatedItem.jobID} to status = ${updatedItem.requestStatus}`);\n};\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/cosmosDB.js?");

/***/ }),

/***/ "./src/server/dbConfig.js":
/*!********************************!*\
  !*** ./src/server/dbConfig.js ***!
  \********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 19:0-14 */
/***/ ((module) => {

eval("const config = {\n  endpoint: \"https://optimusprime2.documents.azure.com:443/\",\n  key: \"VIJGPZYVus4BTCxoPtA6kkXjgAa8bbHgkTvn1UX61UEPyWIpQ4Sb7W6DsZuE2ubhPeM34dlvhv8Q7bWvMjRyVw==\",\n  // Telemetry\n  telemetryDatabaseId: \"TelemetryDatabase\",\n  telemetryContainerId: \"Telemetry\",\n  telemetryPartitionKey: {\n    kind: \"Hash\",\n    paths: [\"/time\"]\n  },\n  // Jobs\n  jobsDatabaseId: \"JobsDatabase\",\n  jobsContainerId: \"Jobs\",\n  jobsPartitionKey: {\n    kind: \"Hash\",\n    paths: [\"/jobID\"]\n  }\n};\nmodule.exports = config;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/dbConfig.js?");

/***/ }),

/***/ "./src/server/iothubConfig.js":
/*!************************************!*\
  !*** ./src/server/iothubConfig.js ***!
  \************************************/
/*! namespace exports */
/*! export client [provided] [no usage info] [missing usage info prevents renaming] */
/*! export jobClient [provided] [no usage info] [missing usage info prevents renaming] */
/*! export registry [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"client\": () => /* binding */ client,\n/* harmony export */   \"registry\": () => /* binding */ registry,\n/* harmony export */   \"jobClient\": () => /* binding */ jobClient\n/* harmony export */ });\n/* harmony import */ var azure_iothub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! azure-iothub */ \"azure-iothub\");\n/* harmony import */ var azure_iothub__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(azure_iothub__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar JobClient = __webpack_require__(/*! azure-iothub */ \"azure-iothub\").JobClient;\n\nconst iothubConnectionString = 'HostName=ELE400-OptimusPrime.azure-devices.net;SharedAccessKeyName=Robot;SharedAccessKey=a5OBh2RjpSnVN3z1CVicMQoj37axsVdGBvJ7QOIwqHc='; // Device registration\n\nlet client, registry;\n\nif (iothubConnectionString) {\n  registry = azure_iothub__WEBPACK_IMPORTED_MODULE_0___default().Registry.fromConnectionString(iothubConnectionString);\n  client = azure_iothub__WEBPACK_IMPORTED_MODULE_0___default().Client.fromConnectionString(iothubConnectionString);\n} // Job manager\n\n\nvar jobClient = JobClient.fromConnectionString(iothubConnectionString);\n\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/iothubConfig.js?");

/***/ }),

/***/ "./src/server/server.js":
/*!******************************!*\
  !*** ./src/server/server.js ***!
  \******************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webpack */ \"webpack\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webpack__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! webpack-hot-middleware */ \"webpack-hot-middleware\");\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _webpack_config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../webpack.config.js */ \"./webpack.config.js\");\n/* harmony import */ var _webpack_config_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_webpack_config_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _iothubConfig__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./iothubConfig */ \"./src/server/iothubConfig.js\");\n/* harmony import */ var _cosmosDB_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cosmosDB.js */ \"./src/server/cosmosDB.js\");\n/* harmony import */ var _RobotControl_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./RobotControl.js */ \"./src/server/RobotControl.js\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _EventConsumer_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./EventConsumer.js */ \"./src/server/EventConsumer.js\");\n\n\n\n\n\n\n\n\n\n\n\nconst app = express__WEBPACK_IMPORTED_MODULE_1___default()();\nconst DIST_DIR = __dirname;\nconst HTML_FILE = path__WEBPACK_IMPORTED_MODULE_0___default().join(DIST_DIR, 'index.html');\nconst compiler = webpack__WEBPACK_IMPORTED_MODULE_2___default()((_webpack_config_js__WEBPACK_IMPORTED_MODULE_5___default())); // Webpack Dev Middleware for recompiling after changes (needs page refresh)\n\napp.use(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default()(compiler, {\n  publicPath: (_webpack_config_js__WEBPACK_IMPORTED_MODULE_5___default().output.publicPath)\n})); // Webpack Hot Middleware for hot-reloading of changes (automatically refreshes page)\n\napp.use(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default()(compiler));\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_9___default()()); // Init telemetry consumer\n\n(0,_EventConsumer_js__WEBPACK_IMPORTED_MODULE_10__.InitTelemetryConsumer)();\napp.get(\"/api/devices/list\", function (req, res) {\n  if (!_iothubConfig__WEBPACK_IMPORTED_MODULE_6__.registry) return res.send([]);\n  _iothubConfig__WEBPACK_IMPORTED_MODULE_6__.registry.list((error, list) => {\n    const names = list.map(d => d.deviceId);\n    res.send(names);\n  });\n  console.log(\"Got devices list from Azure IoT-Hub\");\n});\napp.get(\"/api/cosmosdb/telemetry\", async (req, res) => {\n  //console.log(\"Querying telemetry data from CosmosDB database\")\n  const num_items = 1; // 1 telemetry per query\n\n  const items = await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_7__.QueryTelemetry(num_items); // For HTML output\n  //let itemsStringified = JSON.stringify(items, null, 2);\n  //let htmlOutput = itemsStringified.replace(/\\n/g, \"<br />\");\n  //res.send(htmlOutput);\n\n  res.send(items); //console.log(\"Got telemetry from cosmos DB\")\n});\napp.get(\"/api/cosmosdb/jobs\", async (req, res) => {\n  //console.log(\"Querying jobs data from CosmosDB database\");\n  const jobs = await _cosmosDB_js__WEBPACK_IMPORTED_MODULE_7__.QueryJobs(); // For HTML output\n  //let jobsStringified = JSON.stringify(jobs, null, 2);\n  //let htmlOutput = jobsStringified.replace(/\\n/g, \"<br />\");\n  //res.send(htmlOutput);\n\n  res.send(jobs); //console.log(\"Got jobs from cosmos DB\");\n});\napp.get(\"/api/command/ready\", async (req, res) => {\n  console.log(\"Reset robot ready flag to 'true' (ready)\"); // Reset the ready flag of the robot (Enables sending the next command)\n\n  (0,_RobotControl_js__WEBPACK_IMPORTED_MODULE_8__.SetRobotReadyFlag)(true);\n});\napp.get(\"/api/command/call\", async (req, res) => {\n  console.log(\"Send command to robot using clientToDevice method invoke\");\n  const type = 'linear';\n  const payload = {\n    'distance': '20',\n    // 20 cm\n    'speed': '5' // 5 cm/s\n\n  };\n  const jobId = (0,_RobotControl_js__WEBPACK_IMPORTED_MODULE_8__.CallCommand)(type, payload);\n});\napp.post(\"/api/command/call\", async (req, res) => {\n  const payload = req.body;\n  const {\n    type,\n    ...configuration\n  } = payload;\n  console.log(payload);\n  const jobId = await (0,_RobotControl_js__WEBPACK_IMPORTED_MODULE_8__.CallCommand)(type, configuration);\n});\n/*\napp.get(\"/api/command/test\", async(req, res) =>\n{\n    \n    console.log(\"Invoke test method using clientToDevice invoke\")\n    //const jobId = await InvokeCommand(\"command\", null);\n    \n    const payload = {\n\t'msg': 'Hello World!'\n    };\n    const jobId = await InvokeCommand('Hello', payload);\n    \n    console.log(\"Command sent !\");\n})\n*/\n\napp.get('/api/setled', function (req, res) {\n  if (!_iothubConfig__WEBPACK_IMPORTED_MODULE_6__.client) return res.sendStatus(500);\n  const methodParams = {\n    methodName: 'Hello',\n    payload: {\n      \"msg\": \"helloworld\"\n    },\n    responseTimeoutInSeconds: 30\n  }; //const deviceId = req.body.deviceId;\n\n  _iothubConfig__WEBPACK_IMPORTED_MODULE_6__.client.invokeDeviceMethod(\"Robot\", methodParams, function (error, result) {\n    if (error) {\n      console.error(`Failed to invoke method ${methodParams.methodName}: ${error.toString()}`);\n      res.sendStatus(500);\n    } else {\n      res.sendStatus(200);\n    }\n  });\n});\nconst PORT = process.env.PORT || 8080;\napp.listen(PORT, () => {\n  console.log(`App listening to ${PORT}....`);\n  console.log('Press Ctrl+C to quit.');\n});\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./src/server/server.js?");

/***/ }),

/***/ "./webpack.config.js":
/*!***************************!*\
  !*** ./webpack.config.js ***!
  \***************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 7:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const path = __webpack_require__(/*! path */ \"path\");\n\nconst webpack = __webpack_require__(/*! webpack */ \"webpack\");\n\nconst HtmlWebPackPlugin = __webpack_require__(/*! html-webpack-plugin */ \"html-webpack-plugin\");\n\nmodule.exports = {\n  entry: {\n    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js']\n  },\n  output: {\n    path: path.join(__dirname, 'dist'),\n    publicPath: '/',\n    filename: '[name].js'\n  },\n  target: 'web',\n  devtool: 'source-map',\n  module: {\n    rules: [{\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"babel-loader\"\n    }, {\n      // Loads the javacript into html template provided.\n      // Entry point is set below in HtmlWebPackPlugin in Plugins \n      test: /\\.html$/,\n      use: [{\n        loader: \"html-loader\" //options: { minimize: true }\n\n      }]\n    }, {\n      test: /\\.css$/,\n      use: ['style-loader', 'css-loader']\n    }, {\n      test: /\\.(png|svg|jpg|gif)$/,\n      use: ['file-loader']\n    }]\n  },\n  plugins: [new HtmlWebPackPlugin({\n    template: \"./src/html/index.html\",\n    filename: \"./index.html\",\n    excludeChunks: ['server']\n  }), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]\n};\n\n//# sourceURL=webpack://ELE400-SW-TestApp/./webpack.config.js?");

/***/ }),

/***/ "@azure/cosmos":
/*!********************************!*\
  !*** external "@azure/cosmos" ***!
  \********************************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"@azure/cosmos\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22@azure/cosmos%22?");

/***/ }),

/***/ "@azure/event-hubs":
/*!************************************!*\
  !*** external "@azure/event-hubs" ***!
  \************************************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"@azure/event-hubs\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22@azure/event-hubs%22?");

/***/ }),

/***/ "azure-iothub":
/*!*******************************!*\
  !*** external "azure-iothub" ***!
  \*******************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"azure-iothub\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22azure-iothub%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"body-parser\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22body-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"express\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22express%22?");

/***/ }),

/***/ "html-webpack-plugin":
/*!**************************************!*\
  !*** external "html-webpack-plugin" ***!
  \**************************************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"html-webpack-plugin\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22html-webpack-plugin%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"path\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22path%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! dynamic exports */
/*! exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"uuid\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22uuid%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"webpack\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"webpack-dev-middleware\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22webpack-dev-middleware%22?");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! dynamic exports */
/*! export __esModule [maybe provided (runtime-defined)] [no usage info] [provision prevents renaming (no use info)] */
/*! other exports [maybe provided (runtime-defined)] [no usage info] */
/*! runtime requirements: module */
/***/ ((module) => {

"use strict";
eval("module.exports = require(\"webpack-hot-middleware\");;\n\n//# sourceURL=webpack://ELE400-SW-TestApp/external_%22webpack-hot-middleware%22?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/server/server.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;