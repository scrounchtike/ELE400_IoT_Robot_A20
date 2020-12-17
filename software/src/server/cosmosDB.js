
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./dbConfig");

const { endpoint, key,
	telemetryDatabaseId, telemetryContainerId, telemetryPartitionKey,
	jobsDatabaseId, jobsContainerId, jobsPartitionKey }
      = config;

const client = new CosmosClient({ endpoint, key });

// Telemetry database info
const telemetryDatabase = client.database(telemetryDatabaseId);
const telemetryContainer = telemetryDatabase.container(telemetryContainerId);

// Jobs database info
const jobsDatabase = client.database(jobsDatabaseId);
const jobsContainer = jobsDatabase.container(jobsContainerId);

/*
// This script ensures that the database is setup and populated correctly
*/
async function create(client, databaseId, containerId, partitionKey) {
    /**
     * Create the database if it does not exist
     */
    const { database } = await client.databases.createIfNotExists({
      id: databaseId
    });
    console.log(`Created database:\n${database.id}\n`);
  
    /**
     * Create the container if it does not exist
     */
    const { container } = await client
      .database(databaseId)
      .containers.createIfNotExists(
        { id: containerId, partitionKey },
        { offerThroughput: 400 }
      );
  
    console.log(`Created container:\n${container.id}\n`);
  }

// Make sure Telemetry database is already setup. If not, create it.
//create(client, telemetryDatabaseId, telemetryContainerId, telemetryPartitionKey);

// Make sure Jobs database is already setup. If not, create it.
create(client, jobsDatabaseId, jobsContainerId, jobsPartitionKey);


// Query telemetry data from database
export const QueryTelemetry = async (limit) =>
{
    // query to return 10 items in first-to-last order
    const querySpec = {
        query: `SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT ${limit}`
    };

    //const { resources: items } = await container.items
    //    .query(querySpec)
    //    .fetchAll();
    //console.log(`Using container :\n${telemetryContainer.id}\n`);
    //console.log(`Using items :\n${telemetryContainer.items}\n`);
    const { resources } = await telemetryContainer.items.query(querySpec).fetchAll();
    //console.log(`Query completed, resources:\n${resources}\n`);
    return resources;
}

export const AddTelemetryItem = async (payload) =>
{
    const { resource: createdItem } = await telemetryContainer.items.create(payload);
    
    console.log(`\r\nCreated new telemetry item: ${createdItem.id}\r\n`);
    return await createdItem;
}

// Query jobs data from database
export const QueryJobs = async () =>
{
    // query to return 10 items in first-to-last order
    const querySpec = {
	query: "SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT 10"
    };

    //console.log(`Using container :\n${jobsContainer.id}\n`);
    //console.log(`Using items :\n${jobsContainer.items}\n`);
    const { resources } = await jobsContainer.items.query(querySpec).fetchAll();
    //console.log(`Query completed, resources:\n${resources}\n`);
    return resources;
}

// Query a single element from the jobs database
//export const QueryJob() = async () =>
export async function QueryJob(jobId)
{
    const querySpec = {
	query: `SELECT * FROM c WHERE c.jobID = "${jobId}"`
    };

    //console.log(`Trying to query jobId = ${jobId} in jobs database`);
    //console.log(`query = ${querySpec.query}`);
    const { resources: results } = await jobsContainer.items.query(querySpec).fetchAll();

    if (results.length == 0)
    {
	console.log(`Error: QueryJob for id = ${jobId} returned 0 items`);
	throw "No items found matching";
    }
    else if (results.length > 1)
    {
	console.log(`Error: QueryJob for id = ${jobId} returned more than 1 item`);
	throw "More than 1 item found matching";
    }

    const job = results[0];
    return job;
}

export const AddJobItem = async (jobId, type, payload) =>
{
    const newJobItem = {
	jobID: jobId,
	commandName: type,
	payload: payload,
	category: "commands",
	requestStatus: "queued", // Queued, Running, Completed, Cancelled
	commandStatus: "Waiting for status", // Sent, Executing, Succeeded, Failed
	done: 'false'
    };
    const { resource: createdItem } = await jobsContainer.items.create(newJobItem);
    //let createdItem = await jobsContainer.items.create(newJobItem);
	  //.then(function() {
	  //    console.log(`\r\nCreated new item: ${createdItem.id}\r\n`);
	  //    return createdItem; 
    //});
    console.log(`\r\nCreated new item: ${createdItem.id}\r\n`);
    console.log(`\r\nCreated new item: ${createdItem.jobID}\r\n`);
    return await createdItem;
}

export const UpdateJobItem = async (jobItem) =>
{
    // Update status of job
    //console.log(`\nJOB UPDATE`);
    //console.log(`jobId = ${jobItem.jobID},`);
    //console.log(`requestStatus = ${jobItem.requestStatus},`);
    //console.log(`commandStatus = ${jobItem.commandStatus}\n`);
    
    const { resource: updatedItem } = await jobsContainer
	  .item(jobItem.id)
	  .replace(jobItem);
    console.log(`\r\nUpdated item jobID = ${updatedItem.jobID} to status = ${updatedItem.requestStatus}`);
}
