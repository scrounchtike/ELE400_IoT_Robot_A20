
const config = {
    endpoint: "https://optimusprime2.documents.azure.com:443/",
    key: "VIJGPZYVus4BTCxoPtA6kkXjgAa8bbHgkTvn1UX61UEPyWIpQ4Sb7W6DsZuE2ubhPeM34dlvhv8Q7bWvMjRyVw==",

    // Telemetry
    telemetryDatabaseId: "TelemetryDatabase",
    telemetryContainerId: "Telemetry",
    telemetryPartitionKey: { kind: "Hash", paths: ["/time"] },

    // Jobs
    jobsDatabaseId: "JobsDatabase",
    jobsContainerId: "Jobs",
    jobsPartitionKey: { kind: "Hash", paths: ["/jobID"] }
  };
  
  module.exports = config;
