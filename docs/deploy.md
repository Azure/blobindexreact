# BlobIndexReact - Deploy <!-- omit in toc -->

## Contents <!-- omit in toc -->
- [BlobIndexReact Prerequisites](#blobindexreact-prerequisites)
- [Deploy BlobIndexReact](#deploy-blobindexreact)

## BlobIndexReact Prerequisites

BlobIndexReact requires the following Azure services and role assignments to be deployed:

- Access to an Azure subscription 
- Global Admin in Azure Active Directory
  - App Registration with API permissions and admin consent 
- Contributor (or equivalent) [RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview) assignments at a subscription scope to create the following Azure services:
  - [Azure Storage](https://azure.microsoft.com/services/storage/)
  - [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)
  - [Azure Event Grid](https://azure.microsoft.com/services/event-grid/)
  - [Azure Functions](https://azure.microsoft.com/services/functions/)

BlobIndexReact depends on a script to deploy its components and data. To deploy these, the following is required:

- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- Node & NPM (Default in codespaces) https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04 
- Func https://docs.microsoft.com/azure/azure-functions/functions-run-local
Note: The deploy script uses `az ad` commands, to configure Azure Active Directory, which is not supported in Azure Cloud Shell. https://github.com/Azure/azure-cli/issues/12137#issuecomment-596567479

The sample was built in GitHub CodeSpaces, which has az cli and node configured out-of-the-box.

## Deploy BlobIndexReact

For a complete set of instruction to deploy the sample, see deploy.sh in the scripts folder.

**Please note** that the script currently requires a workaround, because az cli doesn't support tf permissions to generate a sas. https://github.com/Azure/azure-cli/issues/20368 The following instructions help create the read sas token in the Azure portal and then build and deploy the React web app. 

In the Azure Portal, find the new storage account, navigate to shared access signature and create a new one using these settings: 
Allowed services: Blob
Allowed resource types: Service, Container, Object
Allowed permissions: Read, List
Blob versioning permissions: None
Allowed blob index permissions: Read/Write, Filter
End: Choose a date, for instance 2 months ahead
Leave the remaining settings to their defaults.
Click Generate SAS and connection string.

Copy the SAS token value (starting with ?sv=) and paste it to replace the #insertmanually# value.

Note that this script assumes present working directory is the scripts folder. 

``` Bash
echo "Temporary workaround. Copy the below instructions to a text editor:"
echo "Create a SAS token as described in deploy.md"
echo "Set READSASTOKEN in ../web/src/authConfig.js"
echo "RG=$RG"
echo "STORAGEACCOUNT=$STORAGEACCOUNT"
echo 'SACONNSTRING="$(az storage account show-connection-string --name $STORAGEACCOUNT -g $RG -o tsv)"'
echo "npm run build --if-present --prefix ../web"
echo 'az storage blob upload-batch --account-name $STORAGEACCOUNT --auth-mode key -d '"'"'$web'"'"' -s ../web/build/. --connection-string $SACONNSTRING --overwrite true'

echo "Deployment done. Web app is available at $STORAGEWEBURL"
```

## Remove

The deploy script of BlobIndexReact creates all Azure services in one resource group. Additionally it creates an app registration in Azure Active Directory. You can remove both in the Azure portal.