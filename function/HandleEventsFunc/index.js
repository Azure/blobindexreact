const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const { AuthorizationManagementClient } = require("@azure/arm-authorization");

const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, eventGridEvent) {
    context.log(eventGridEvent);

    const topic = eventGridEvent.topic; //  topic: '/subscriptions/48531784-</>/resourceGroups/storagerg/providers/Microsoft.Storage/storageAccounts/blobindexreactsa',
    const topicarr = topic.split("/");
    const storageaccountname = topicarr[8];
    const subscriptionid = topicarr[2];
    // context.log(subscriptionid);

    const subject = eventGridEvent.subject; //  subject: '/blobServices/default/containers/temp/blobs/47379853-</>',
    const userguid = subject.substr(subject.lastIndexOf("/")+1);
    context.log(userguid);

    const credential = new DefaultAzureCredential();
    const profileServiceClient = new BlobServiceClient("https://" + storageaccountname + ".blob.core.windows.net", credential);
    // const profileServiceClient = BlobServiceClient.fromConnectionString(connectionstring);

    const profileContainerClient = profileServiceClient.getContainerClient(userguid);

    try {
        // if (!profileContainerClient.exists())
        // {
            context.log(`Creating container "${userguid}"...`);
            await profileContainerClient.createIfNotExists();

            // container created. now set rbac for the new user on the new container
            context.log(`Creating roleAssignment ...`);
            const client = new AuthorizationManagementClient(credential, subscriptionid);

            // the new container
            const scope = topic + "/blobServices/default/containers/" + userguid;
            // newguid()
            const roleassignmentname = uuidv4();
            // Storage Blob Data Contributor
            const roledefid = "/subscriptions/" + subscriptionid + "/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe";

            const roleAssignmentCreateParameters = {
                principalId: userguid, 
                roleDefinitionId: roledefid,
              };
              await client.roleAssignments.create(scope, roleassignmentname, roleAssignmentCreateParameters).then((res) => {
                context.log(res);
              });

            context.log(`Setting roleassignment done.`);

        // }
        // else
        // {context.log(`Container exists...`);}
    } 
    catch (error) {
        context.log('Error: ' + error.message);
        // throw (error);
    }

    try{
        context.log(`Deleting temp blob "${userguid}"...`);
        const tempContainerClient = profileServiceClient.getContainerClient("temp");
        const tempBlobClient = tempContainerClient.getBlobClient(userguid)
        await tempBlobClient.deleteIfExists();
        context.log(`Deleting temp blob done.`);
    }
    catch (error) {
        context.log('Error: ' + error.message);
        // throw (error);
    }

};
