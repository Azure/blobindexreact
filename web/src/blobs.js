const { BlobServiceClient } = require("@azure/storage-blob");
const { InteractiveBrowserCredential } = require("@azure/identity");

const catalogcontainername = "productcatalog";
const tempblobcontainername = "temp";
const blobSasUrl = accountendpoint+readsastoken;
const blobServiceClient = new BlobServiceClient(blobSasUrl);
const catalogContainerClient = blobServiceClient.getContainerClient(catalogcontainername);

import { storageRequest, accountendpoint, readsastoken, createtempblobsastoken } from "./authConfig";

export const getTags = async (blobclient, myblob) => {
    myblob.url = blobclient.url;
    var mytags = await blobclient.getTags();

    for (var i = 0; i< mytags.TagSet.Tag.length; i++)
    {
        var tag = mytags.TagSet.Tag[i];
        switch (tag.Key)
        {
            case "category":
                myblob.category = tag.Value;
                break;
            case "product":
                myblob.product = tag.Value;
                break;
            case "price":
                myblob.price = tag.Value;
                break;
            case "order":
                myblob.order = tag.Value;
                break;
            case "description":
                myblob.description = tag.Value;
                break;
    
        }
    }

    // console.log(myblob);
    return myblob;
};

export const findBlobs = async (partialquery, boolGetTags) => {
    var query = "@container = '" + catalogcontainername + "' AND " + partialquery;
    const temp = storageRequest;
    const result = [];
    try {
        let iter = blobServiceClient.findBlobsByTags(query);
        let blobItem = await iter.next();
        // console.log(blobItem);
        while (!blobItem.done) {
            var myblob={};
            myblob.name = blobItem.value.name;
            if (boolGetTags)
            {
                var blobClient = catalogContainerClient.getBlobClient(blobItem.value.name);
                myblob = await getTags (blobClient, myblob);
            }
            result.push(myblob);
            blobItem = await iter.next();
        }
        // console.log('result: ' + result);

    } catch (error) {
        console.log(error.message);
    }

    return result;
};

const createBlob = async (credential, containername, blobname, jsonblob) => {
    
    const profileServiceClient = new BlobServiceClient(accountendpoint, credential);
    const profileContainerClient = profileServiceClient.getContainerClient(containername);

    try {
        console.log("Saving...");
        const promises = [];
        const blockBlobClient = profileContainerClient.getBlockBlobClient(blobname);
        promises.push(blockBlobClient.upload(jsonblob,jsonblob.length));

        await Promise.all(promises);
        console.log("Done.");
    }
    catch (error) {
        // console.log(error.message);
        console.log(error);
    }
}

// separate function for createtempblobsastoken
const createTempBlob = async (containername, blobname, jsonblob) => {
    
    console.log('createTempBlob');
    console.log(containername);
    console.log(blobname);
    console.log(jsonblob);
    

    const profileServiceClient = new BlobServiceClient(accountendpoint+createtempblobsastoken);
    const profileContainerClient = profileServiceClient.getContainerClient(containername);

    try {
        console.log("Saving...");
        const promises = [];
        const blockBlobClient = profileContainerClient.getBlockBlobClient(blobname);
        promises.push(blockBlobClient.upload(jsonblob,jsonblob.length));

        await Promise.all(promises);
        console.log("Done.");
    }
    catch (error) {
        // console.log(error.message);
        console.log(error);
    }
}


const upload = async (credential, containerName, blobname, jsonblob) => {

    // await createContainer(credential, containerName);
    await createBlob(credential, containerName, blobname, jsonblob);
}

export const saveProfile = async (credential, containerName, jsonblob) => {
    await upload(credential, containerName, "profile.json", jsonblob);
}

export const saveOrder = async (account, jsonblob) => {
    const credential = getCredential(account);
    console.log(credential);

    await upload(credential, account.localAccountId, "order" + getdatetime() + ".json", jsonblob);
}

const containerExists = async (credential, containername)=> {
    const profileServiceClient = new BlobServiceClient(accountendpoint, credential);
    const profileContainerClient = profileServiceClient.getContainerClient(containername);

    return profileContainerClient.exists();
}

export const ensureProfile = async (account) => {
    console.log ('ensureProfile');
    // console.log (account);

    const credential = getCredential(account);

    var containerexists = false;

    try
    {
        // if container or iam permissions are missing, this will throw
        containerexists = await containerExists(credential, account.localAccountId);
    }
    catch (error) {
        console.log(error.message);
    }

    console.log('containerexists:');
    console.log(containerexists);

    if (!containerexists)
    {
        // create a blob that can be picked up by event grid and function that will create a container for the user
        await createTempBlob(tempblobcontainername, account.localAccountId, "");
    }

    return containerexists;
}

export const getdatetime = () =>
{
    var now = new Date().toISOString().substring(0,19);
    console.log(now);
    return now; 
}

export const listJsonBlobs = async (credential, containername) => {
    const result = [];
    try {
        const serviceClient = new BlobServiceClient(accountendpoint, credential);
        const containerClient = serviceClient.getContainerClient(containername);
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        // console.log(blobItem);
        while (!blobItem.done) {
            var myblob = await getBlob (containerClient, blobItem.value.name);
            result.push(JSON.parse(myblob));
            blobItem = await iter.next();
        }
        // console.log('result: ' + result);

    } catch (error) {
        console.log(error.message);
    }

    return result;
};

export const getBlob = async (containerClient, blobname) => {
    var result = null;
    
    try {
        const blobClient = containerClient.getBlobClient(blobname);

        const downloadBlockBlobResponse = await blobClient.download();
        const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
        console.log("Downloaded blob content", downloaded);

        result = downloaded;
    } catch (error) {
        console.log(error.message);
    }

    return result;
};

async function blobToString(blob) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve(ev.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(blob);
    });
  }

const getCredential = (account) =>
{
    const credential = new InteractiveBrowserCredential({
        tenantId: account.tenantId,
        clientId: account.idTokenClaims.aud
      });
      return credential;
}

export const loadAddresses = async (account) => {
    const credential = getCredential(account);

    const result = null;
    // await getBlob(credential, account.localAccountId, "addresses.json");

    return result;
}

export const loadOrders = async (account) => {
    const credential = getCredential(account);

    const result = await listJsonBlobs(credential, account.localAccountId);

    return result;
}