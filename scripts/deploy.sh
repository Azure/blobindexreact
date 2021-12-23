#!/bin/bash

# Set these variables to match your environment
REGION="westeurope"
SUBSCRIPTIONNAME="prodold"

# When rerunning you can set SUFFIX to your previous value
SUFFIX=$RANDOM

# Optionally change
PREFIX="blobindexreact"
RG=$PREFIX"rg"$SUFFIX
export STORAGEACCOUNT=$PREFIX"sa$SUFFIX"
export IMAGESCONTAINER="productcatalog"
TEMPCONTAINER="temp"
ADAPPNAME=$PREFIX"web"$SUFFIX
EVENTTOPIC=$PREFIX"event"$SUFFIX
EVENTSUB=$PREFIX"eventsub"
FUNCTIONAPP=$PREFIX"function"$SUFFIX
FUNCTIONNAME="HandleEventsFunc"

echo "Logging in"
#az login 
az account set -s $SUBSCRIPTIONNAME
echo "Creating resource group"
az group create -n $RG -l $REGION

### Storage account ###

echo "Creating storage account"
STORAGEID="$(az storage account create --name $STORAGEACCOUNT --access-tier Hot --kind StorageV2 --sku Standard_LRS --https-only true -g $RG -l $REGION --query id -o tsv)"
export SACONNSTRING="$(az storage account show-connection-string --name $STORAGEACCOUNT -g $RG -o tsv)"
STORAGEURL="https://$STORAGEACCOUNT.blob.core.windows.net"
STORAGEWEBURL="https://$STORAGEACCOUNT.z6.web.core.windows.net"

# Deploying services that take time to become available (instead of sleep)
echo "Creating app registration"
ADAPPID="$(az ad app create --display-name $ADAPPNAME --required-resource-accesses @manifest.json --native-app false --oauth2-allow-implicit-flow false --reply-urls $STORAGEWEBURL "http://localhost:3000/" --available-to-other-tenants true --query appId -o tsv)"
echo "Creating function app"
az functionapp create -n $FUNCTIONAPP -g $RG -s $STORAGEACCOUNT -c $REGION --assign-identity [system] --functions-version 4 --runtime node --os-type Linux --runtime-version 14 

az storage container create -n $IMAGESCONTAINER --connection-string $SACONNSTRING

source ./sampledata.sh

echo "Enabling static website"
az storage blob service-properties update --account-name $STORAGEACCOUNT --static-website --index-document index.html

echo "Enabling CORS"
az storage cors add --methods GET HEAD OPTIONS POST PUT --origins '*' --allowed-headers '*' --exposed-headers '*' --max-age 86400 --services b --connection-string $SACONNSTRING

echo "Creating temp container"
az storage container create -n $TEMPCONTAINER --connection-string $SACONNSTRING

# Authorize the signed-in user
USERID="$(az ad signed-in-user show --query objectId -o tsv)"
az role assignment create --assignee $USERID --role "ba92f5b4-2d11-453d-a403-e96b0029c9fe"  --scope $STORAGEID

# SAS tokens
echo "Creating read sas"
EXPIRY="$(date -u -d "2 months" '+%Y-%m-%dT%H:%M:%SZ')" # '+%Y-%m-%dT%H:%M:%SZ'

# While tf permissions are not yet supported in az cli, create it manually using the portal or powershell https://github.com/Azure/azure-cli/issues/20368
# READSASTOKEN="$(az storage account generate-sas --account-name $STORAGEACCOUNT --permissions rltf --services b --resource-types sco --expiry $EXPIRY --https-only --connection-string $SACONNSTRING -o tsv)"

# Rest doesn't support tf permissions yet
# SUBSCRIPTIONID=$(az account show --query id -o tsv)
# RESTURI='https://management.azure.com/subscriptions/'$SUBSCRIPTIONID'/resourceGroups/'$RG'/providers/Microsoft.Storage/storageAccounts/'$STORAGEACCOUNT'/ListAccountSas?api-version=2021-04-01'
# READSASTOKEN="$(az rest --method POST --uri $RESTURI --headers 'Content-Type=application/json' --body '{"signedVersion":"2020-08-04","signedServices":"b","signedResourceTypes":"sco","signedPermission":"rltf","signedExpiry":"'$EXPIRY'","keyToSign":"key1"}')"
# READSASTOKEN="#insertmanually#"

echo "Creating create sas"
CREATETEMPBLOBSASTOKEN=?"$(az storage container generate-sas -n $TEMPCONTAINER --permissions w --expiry $EXPIRY --https-only --connection-string $SACONNSTRING -o tsv)"

### AAD App registration ###

echo "Creating AAD app registration. (Az ad commands do not work in Azure Cloud Shell)"
ADOBJECTID=$(az ad app show --id $ADAPPID --query objectId --output tsv)
# Workaround to set the type to Spa
az rest --method PATCH --uri 'https://graph.microsoft.com/v1.0/applications/'$ADOBJECTID --headers 'Content-Type=application/json' --body '{"spa":{"redirectUris":["'$STORAGEWEBURL'", "http://localhost:3000/"]}}'
AUTHORITY="https://login.microsoftonline.com/$(az account show --query homeTenantId -o tsv)"
# az ad app permission admin-consent --id $ADAPPID

echo "Updating env vars in web app"
sed -i "s|#accountendpoint#|$STORAGEURL|g" ../web/src/authConfig.js
# First escape ampersand which is a special character in sed
READSASTOKEN2=$(echo $READSASTOKEN | sed -e 's/&/\\\&/g')
# Then replace the placeholder with the actual value
#sed -i "s|#readsastoken#|$READSASTOKEN2|" ../web/src/authConfig.js
CREATETEMPBLOBSASTOKEN2=$(echo $CREATETEMPBLOBSASTOKEN | sed -e 's/&/\\\&/g')
sed -i "s|#createtempblobsastoken#|$CREATETEMPBLOBSASTOKEN2|" ../web/src/authConfig.js
sed -i "s|#clientid#|${ADAPPID}|" ../web/src/authConfig.js
sed -i "s|#authority#|${AUTHORITY}|" ../web/src/authConfig.js

echo "Builing web app" # including the updated authConfig.js
npm install --if-present --prefix ../web
npm run build --if-present --prefix ../web

echo "Deploying web app"
az storage blob upload-batch --account-name $STORAGEACCOUNT --auth-mode key -d '$web' -s ../web/build/. --connection-string $SACONNSTRING --overwrite true

### Azure Function ###

echo "Creating function app"

pushd ../function
echo "Deploying function app"
npm install --if-present
func azure functionapp publish $FUNCTIONAPP
popd

FUNCTIONPRINCIPALID="$(az functionapp show -g $RG -n $PREFIX"function"$SUFFIX --query identity.principalId --output tsv)"
az role assignment create --assignee $FUNCTIONPRINCIPALID --role "ba92f5b4-2d11-453d-a403-e96b0029c9fe"  --scope $STORAGEID
az role assignment create --assignee $FUNCTIONPRINCIPALID --role "8e3af657-a8ff-443c-a75c-2fe8c4bcb635"  --scope $STORAGEID

FUNCTIONID="$(az functionapp show --name $FUNCTIONAPP --resource-group $RG  --query id --output tsv)"/functions/$FUNCTIONNAME

### Event Grid ###

echo "Creating eventgrid system-topic"
az provider register --namespace Microsoft.EventGrid
az eventgrid system-topic create --resource-group $RG --name $EVENTTOPIC --location $REGION --source $STORAGEID --topic-type microsoft.storage.storageaccounts

echo "Creating eventgrid system-topic event-subscription"
az eventgrid system-topic event-subscription create --name $EVENTSUB -g $RG --system-topic-name $EVENTTOPIC --endpoint $FUNCTIONID --endpoint-type azurefunction --included-event-types "Microsoft.Storage.BlobCreated" --subject-begins-with "/blobServices/default/containers/temp" --event-delivery-schema eventgridschema

### Workaround for read sas ###

echo "Temporary workaround. Copy the below instructions to a text editor:"
echo "Create a SAS token as described in deploy.md"
echo "Set READSASTOKEN in ../web/src/authConfig.js"
echo "RG=$RG"
echo "STORAGEACCOUNT=$STORAGEACCOUNT"
echo 'SACONNSTRING="$(az storage account show-connection-string --name $STORAGEACCOUNT -g $RG -o tsv)"'
echo "npm run build --if-present --prefix ../web"
echo 'az storage blob upload-batch --account-name $STORAGEACCOUNT --auth-mode key -d '"'"'$web'"'"' -s ../web/build/. --connection-string $SACONNSTRING --overwrite true'

echo "Deployment done. Web app is available at $STORAGEWEBURL"
