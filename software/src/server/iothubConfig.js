
import iothub from 'azure-iothub'
var JobClient = require('azure-iothub').JobClient;

const iothubConnectionString = 'HostName=ELE400-OptimusPrime.azure-devices.net;SharedAccessKeyName=Robot;SharedAccessKey=a5OBh2RjpSnVN3z1CVicMQoj37axsVdGBvJ7QOIwqHc='

// Device registration
let client, registry
if (iothubConnectionString)
{
    registry = iothub.Registry.fromConnectionString(iothubConnectionString);
    client = iothub.Client.fromConnectionString(iothubConnectionString);
}

// Job manager
var jobClient = JobClient.fromConnectionString(iothubConnectionString);

export { client, registry, jobClient };
