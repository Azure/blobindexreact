# Blobindexreact - Monitor <!-- omit in toc -->

Monitoring in Azure can be done within the individual services or in a central location using a combination of Azure Monitor, Log Analytics and Application Insights. In this sample monitoring is a bit different since the essence happens in the React single-page app in the browser of your users. Testing the app using multiple identities and browsers is probably the most useful. Next to that this section describes how to verify the flow of events in Azure.

## Contents <!-- omit in toc -->

- [F12 Developer tools](#f12-developer-tools)
- [Signing in](#signing-in)

## F12 Developer tools

The majority of code in this sample is in the React single-page app. Browsers provide default functionality for developer through F12, including a console view to see errors and log messages and a network view to understand what is being communicated.

When the React application starts it asks storage for categories; blobs with category tag filled and empty product tag. For more details, see [blobindex description](./blobindex.md). When this fails, check in the dev tools console whether the request succeeded. If it didn't, check the url and read sas token by retrieving one image with that token. If it did, then check the storage account, container, images, and tags.

## Signing in

The actual sign-in is relatively straightforward since this sample reuses the react AAD sample. When signing-in doesn't work, check the authConfig.js configuration, specifically the clientid and authority, and their existence in Azure Active Directory. Also note when running the sample locally using npm start, the browser automatically opens to http://127.0.0.1:3000, which is not a valid return url in aad, so use http://localhost:3000 instead.

After the sign-in, the integration flow starts: First the app checks whether the user-specific container exists. If the container and permissions exist, the flow ends here. If the container or the permissions don't exist, the request fails visibly in the dev tools console, which is expected. The app then tries to create a user guid blob in the temp container using the createtempblobsastoken. If this fails, check the storage account, container and sas token.

Next the creation of the blob triggers an Event Grid event and this is passed on to the Azure Function, which can be monitored in the metrics of the Event Grid System Topic. 

Lastly the actual event handling is done by the HandleEventsFunc Function in the Function App. The function can be monitored in the monitor tab and shows the three operations: creating the container, setting role assignment and deleting the temp blob. The function app should run as system managed identity with (owner and storage blob data contributor) permissions to perform these operations. Note that the invocation logs may take up to five minutes before they show in the portal. When debugging use the logs tab to view live log stream.

https://docs.microsoft.com/azure/role-based-access-control/troubleshooting#role-assignment-changes-are-not-being-detected
