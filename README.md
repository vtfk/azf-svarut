[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# azf-svarut

Durable Azure function that sends letters to [KS SvarUT](https://svarut.ks.no/public/ks-svarut.html).

## :blue_book: Table of contents

* [API Endpoints](#v-api)
  * [Send new letter - ``/api/SendLetter``](#incoming_envelope-send-new-letter---apisendletter)
  * [Get letter status - ``/api/status/{instanceId}``](#white_check_mark-get-letter-status---apistatusinstanceid)
* [Local Development](#computer-local-development)
* [Publish function app to Azure](#rocket-publish-azure-function)
  * [Create Azure resources](#hammer-create-azure-resources)
  * [Deploy function app](#package-deploy-the-function-app-to-azure)
* [License](#page_with_curl-license)

***

## :v: API

### :incoming_envelope: Send new letter - ``/api/SendLetter``

Starts the letter orchestrator that sends the provided letter.

#### Example

Please send the letter as described in the schema as the request body. The letter schema can be found [here](https://github.com/vtfk/svarut/blob/master/src/schemas/forsendelse.json).

> More examples can be found [here](https://github.com/vtfk/svarut#sendforsendelse-simple).

**POST** ``http://localhost:7071/api/SendLetter?code=appKey``:

```json
{
  "id": "9e313a3f53b64375a6a661b171d18095",
  "statusQueryGetUri": "http://localhost:7071/api/status/9e313a3f53b64375a6a661b171d18095?code=appKey",
  "sendEventPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/9e313a3f53b64375a6a661b171d18095/raiseEvent/{eventName}?code=someKey",
  "terminatePostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/9e313a3f53b64375a6a661b171d18095/terminate?reason={text}&code=someKey",
  "rewindPostUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/9e313a3f53b64375a6a661b171d18095/rewind?reason={text}&code=someKey",
  "purgeHistoryDeleteUri": "http://localhost:7071/runtime/webhooks/durabletask/instances/9e313a3f53b64375a6a661b171d18095?code=someKey"
}
```

Headers:

```yml
Location: "http://localhost:7071/api/status/9e313a3f53b64375a6a661b171d18095?code=appKey"
Retry-After: 10
```

### :white_check_mark: Get letter status - ``/api/status/{instanceId}``

Gets the letters orchestrator status and SvarUt reponse.

Returns ``201 Accepted`` (with `Location` and `Retry-After` headers) if the  activity isn't finished yet, but just keep on asking on this endpoint for the status until we return `200 OK` (as well as the result)

#### Example

**GET** ``http://localhost:7071/api/status/{instanceId}?code=appKey``:

```json
{
  "name": "SendLetterOrchestrator",
  "instanceId": "9e313a3f53b64375a6a661b171d18095",
  "runtimeStatus": "Completed",
  "customStatus": "Sent",
  "output": [
    {
      "id": "d32f0eb2-e33b-44e0-8d13-b98ea5e651d5"
    }
  ],
  "createdTime": "2020-06-09T15:49:08Z",
  "lastUpdatedTime": "2020-06-09T15:49:24Z",
  "historyEvents": [
    {
      "EventType": "ExecutionStarted",
      "Timestamp": "2020-06-09T15:49:08.018581Z",
      "FunctionName": "SendLetterOrchestrator"
    },
    {
      "EventType": "TaskCompleted",
      "Timestamp": "2020-06-09T15:49:24.176951Z",
      "ScheduledTime": "2020-06-09T15:49:08.556741Z",
      "FunctionName": "SendLetterActivity"
    },
    {
      "EventType": "ExecutionCompleted",
      "OrchestrationStatus": "Completed",
      "Timestamp": "2020-06-09T15:49:24.469119Z"
    }
  ]
}
```

## :computer: Local development

Make sure you have a node version compatible with Azure functions (active LTS), as well as [Azure Functions Core Tools ](https://www.npmjs.com/package/azure-functions-core-tools) to let you run the function.

To setup local development, please clone this repository, and install the depencencies.

1. 
    ```shell
    $ git clone https://github.com/vtfk/azf-svarut.git 
    ```

2. 
    ```shell
   $ cd azf-svarut 
   ```

3. 
    ```shell
   $ npm install
   ```

4. Then, you need to add a file to your project root containing all your secrets. Create a `local.settings.json`, and add this content to it (replace with your own secrets):

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        "AzureWebJobsStorage": "Azure Table Storage connection string",
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "SVARUT_USERNAME": "svarut-username",
        "SVARUT_PASSWORD": "svarut-password",
        "SVARUT_URL": "https://svarut.ks.no",
        "RETRY_ATTEMPTS": 5,
        "RETRY_WAIT": 10000
      }
    }
    ```

5. When you have all your secrets correctly registered in the `local.settings.json` file, you are ready to start the function for the first time.. Godspeed!

    ```shell
    $ func start
   ```

6. Profit :money_with_wings:

## :rocket: Publish Azure function

When you are ready to publish the function to Azure, first make sure that you have the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed on your device.

### :hammer: Create Azure resources

If you haven't created a Function App in Azure yet, you can run these commands to get you started ASAP! Each command provides JSON output upon completion.

[:point_down: Jump down to deploy the Function App if you already have the resources created!](#package-deploy-the-function-app-to-azure)

#### Logging in to the Azure CLI

If you haven't done so already, sign in to Azure with the following command:

```shell
$ az login
```

#### Create Resoure Group

Now we are ready to really get started - first, let's create a resource group!

The following command creates a resource group named ``prod-rg-svarut`` in the ``norwayeast`` region (to list available regions, run: ``az functionapp list-consumption-locations``)

```shell
$ az group create --name prod-rg-svarut --location norwayeast --subscription prod

> {
    "id": "/subscriptions/ce57158d47d5-944c-9993-ae8f-6ba1352c/resourceGroups/prod-rg-svarut",
    "location": "norwayeast",
    "managedBy": null,
    "name": "prod-rg-svarut",
    "properties": {
      "provisioningState": "Succeeded"
    },
    "tags": null,
    "type": "Microsoft.Resources/resourceGroups"
  }
```

#### Create Storage Account

To store the state of our letter queue, we need a Storage Account to associate with the function.

The storage account is normally created as a general-purpose storage account for the region, but for now, we associate it with the ``svarut`` resource group. Please note that storage account names must contain three to 24 characters numbers and lowercase letters only (no dashes :anguished:)! ``Standard_LRS`` specifies a general-purpose account, which is [supported by Functions](https://docs.microsoft.com/en-us/azure/azure-functions/storage-considerations#storage-account-requirements).

```shell
$ az storage account create --name prod-st-svarut --location norwayeast --resource-group prod-rg-svarut --sku Standard_LRS --subscription prod

> {
    "id": "/subscriptions/ce57158d47d5-944c-9993-ae8f-6ba1352c/resourceGroups/prod-rg-svarut/providers/Microsoft.Storage/storageAccounts/prodstsvarut",
    "kind": "StorageV2",
    "location": "norwayeast",
    "name": "prodstsvarut",
    "networkRuleSet": {
      "bypass": "AzureServices",
      "defaultAction": "Allow",
      "ipRules": [],
      "virtualNetworkRules": []
    },
    "primaryEndpoints": {
      [...]
    },
    "primaryLocation": "norwayeast",
    "provisioningState": "Succeeded",
    "resourceGroup": "prod-rg-svarut",
    "sku": {
      "name": "Standard_LRS",
      "tier": "Standard"
    },
    "statusOfPrimary": "available",
    "type": "Microsoft.Storage/storageAccounts",
    [...]
  }
```

#### Create Function App

Now that we have both a place to store our data, and our function, we are ready to create the actual function!

Remember to replace the name of the resource group and storage account, if you used different names on these.. Please note that whatever you have as your function name becomes the default DNS domain for the function app, hence this field must be unique Azure-wide.

```shell
$ az functionapp create --name prod-func-svarut --resource-group prod-rg-svarut --storage-account prodstsvarut --consumption-plan-location norwayeast --runtime node --functions-version 3

> {
    "id": "/subscriptions/ce57158d47d5-944c-9993-ae8f-6ba1352c/resourceGroups/prod-rg-svarut/providers/Microsoft.Web/sites/prod-func-svarut",
    "name": "prod-func-svarut",
    "defaultHostName": "prod-func-svarut.azurewebsites.net",
    "resourceGroup": "prod-rg-svarut",
    "siteConfig": {
      [...]
    },
    "state": "Running",
    "type": "Microsoft.Web/sites",
    "usageState": "Normal",
    [...]
  }
```

If the state of the function app is ``Running``, you are ready to publish the function!

### :package: Deploy the Function App to Azure

With all the necessary resources in place, we are now ready to deploy the functions to the function app in Azure.

***Pro tip!*** If you want to sync your [local settings](#computer-local-development), add the flag ``--publish-local-settings`` at the end of the command!

```shell
$ func azure functionapp publish prod-func-svarut

> Getting site publishing info...
  Creating archive for current directory...
  Uploading [...]

  Functions in prod-func-svarut:
    [...]
```

<img align="right" width="170" src="https://media.giphy.com/media/3imL7OcAU0awo/giphy.gif" />

The function returns a couple of URLs you can use to test your function, so go a head and do that - can't wait to hear how it went! :tada:

Remember to replace the functionname in the ``HttpStart`` function to ``SendLetter`` as described [here](#incoming_envelope-send-new-letter---apisendletter)!


## :page_with_curl: License

[MIT](https://github.com/vtfk/azf-svarut/blob/master/LICENSE)
