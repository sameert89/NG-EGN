# NG-EGN: Direct Communication Between Angular SPAs and Azure Event Grid Namespace

This article describes a method to allow Angular web apps to directly
authenticate against Azure Event Grid namespace and publish and subscribe to
events. This is enabled by EGN's MQTT Broker which supports MQTT over WSS
(Websockets Secure).

EGN offers two methods to authenticate MQTT clients:

1. Using Certificates/CA trust chain.
2. Using Microsoft Entra with JWT (only on MQTTv5.0).

The first one is more appropriate for IOT devices or devices where developer has
the control over OS/browser certificate store and the first method allows for
all MQTT protocols to be used for communication `mqtt, mqtts, ws, wss`. The
latter is better for our usecase, since JavaScript does not have access to
certificates in any way.

**Note:** _MQTT for web-browsers can only be done by using_ `ws` or `wss`
_protocols_, _it is an inherent restriction_. _Also ws in my testing has not worked, Entra based Auth requires you to use_ `wss`.

## Prerequisites

- Angular Frontend Application.
- Microsoft Azure Portal Access.
- A backend to fetch JWT tokens, or use postman or curl.

## Steps to Be Taken on Azure Portal

### Creating an Event Grid Namespace

- Firstly we are going to need an [Event Grid Namespace](https://learn.microsoft.com/en-us/azure/event-grid/create-view-manage-namespaces#:~:text=A%20namespace%20in,your%20Azure%20subscription.).
- Sign in to the [Azure Portal](https://portal.azure.com).
- Search For **Event Grid Namespaces**. Select the appropriate resource and click on
  **Create**.
- Fill in the appropriate details, nothing needs to be configured right now,
  click on **Review+Create**.

### Enabling the MQTT broker

- Once the resource has been created, go the namespace and from the left pane
  under the settings tab select **Configuration**.
- Enable the MQTT broker feature there.

**Note:** _Once the MQTT Broker feature is enabled, it cannot be disabled for
the Namespace_

### Registering our Application

- In order to get a JWT token from entra for authentication, we [must](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/api/register-app-for-token?tabs=portal) have an
  **App Registration** in azure, which will be used as identifier against which
  the JWT will be issued.
- In the Azure Portal search for **App Registrations**.
- Click on **New Regsitration**.
- Put in a name for your application (this is just an identifier).
- In the supported account types, select _Accounts in any organizational
  directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft
  accounts (e.g. Skype, Xbox)_. This ensures widest range of access for clients.
- In the Redirect URI, select a platform as **Single Page Application**, and put
  the redirect URL to the url of where your SPA is hosted, for our case its
  going to be `http://localhost:4200` which is the default address of local
  angular apps.
- Once the app registration is done, head over to it and from the left hand pane
  under _Manage_, select API permissions.
- API permissions define how this app registration can access various APIs, in
  our case we need access to _Microsoft Graph_ as this is the one issuing a
  token to us.
- Click on **Add a permission**, select Microsoft Graph.
- Go to Delegated Permissions, and search for `User.Read`. Click the associated
  checkbox and add the permission. Again add permission but this time select Application Permissions and search for `User.ReadAll`. ~~Then add `offline_access` in a similar way (This allows us to fetch
  refresh tokens from the Graph API).~~
- Click on Add permission and complete the process.
- One the permissions are added, select the permissions one by one and click on **Grant Admin
  Consent For Default Directory**.
- Before you exit this resource there are a couple of things you need to note
  down from the overview section of this app registration:-
  1. Application (client) ID
  2. Directory (tenant) ID
- Last but not the least you need to create a **client secret**.
- Head over to the App registration, under Manage header from left pane, select
  **Certificates and Secrets**. Click on New Client Secret.
- Copy it down and save it somewhere.

**Note:** _The client secret can only be viewed/copied once then it will be
lost, so keep it safe_.

### Creating a EGN Topic Space

- Now we need to create a [Topic Space](https://learn.microsoft.com/en-us/azure/event-grid/mqtt-topic-spaces)
- Head Back to our Event Grid Namespace.
- From the left pane, under the MQTT Broker, select **Topic Spaces**.
- Click on **+Topic Space**.
- Provide a Name (Must be unique). Then click on Add topic template.
- These are actual topics that clients will publish/subscribe to, they support
  all kinds of filters, wild cards and Azure variables. A recommended format is
  `domain/topic`. Add as many templates you require and click **Create**.
- Now your topic space is ready, click on the newly created topic space.
- From the left pane select **Access Control (IAM)**. Go to **Role Assignments Tab**.
- Click on Add => Add Role Assignment.
- Depending on your requirement we need two things here:
  1. EventGrid TopicSpaces Publisher
  2. EventGrid TopicSpaces Subscriber
- Select one of the above as per requirement (If you need both, the whole
  process needs to be done twice one for Subscriber and Then for Publisher).
- Click on Next to be taken to members tab.
- Select Assign Access to **User, group, or service principal**, since our App
  Registration is a service principle.
- Click on Select Members.
- The App registration would not appear on the list (This is a known bug in
  Azure), instead search for the name of your app registration and then it will
  appear.
- Select it, then Review and Assign the Role.

## Getting JWT from the Graph API

Now its time to test things and try to get a bearer token from the API. For this
step we will need the following:

1. A backend server or postman or curl.
2. Application ID and Directory ID of the app registration that was created
   earlier.
   Head over to Postman, and create a new post request. The url for post should be:

```txt
https://login.microsoftonline.com:443/<Directory ID>/oauth2/v2.0/token
```

And the body of the POST message should have type `x-www-form-encoded`. The
following parameters need to be passed in the body.

```javascript
{
    client_id: "your application ID",
    client_secret: "your client secret",
    scope: "https//eventgrid.azure.net/.default", // This is required to set 'aud' claim to eventgrid for the token, you can verify this by decompiling the JWT token at jwt.io
    grant_type: "client_credentials"
}
```

Click on post and the Graph API should return a response with an `access_token`,
copy it down.

**Issues with JWT tokens:**
The access token is only valid for 60 minutes to 90 minutes and needs to be regenerated
afterwards, it would not have been a problem since the broker allows you to
set **Authentication Reason Code** in the AUTH packet of MQTT v5. The refresh
token needs to be send in the AUTH Packet for reauthentication. But getting the
refresh token is [not
possible](<https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/identity-platform/v2-oauth2-client-creds-grant-flow.md#:~:text=As%20a%20side%20note%2C%20refresh%20tokens%20will%20never%20be%20granted%20with%20this%20flow%20as%20client_id%20and%20client_secret%20(which%20would%20be%20required%20to%20obtain%20a%20refresh%20token)%20can%20be%20used%20to%20obtain%20an%20access%20token%20instead.>)
in our server-server usecase. But the token is only required at the start of the
connection for authentication, so frontend can get it from the backend everytime
it is loaded. Also from my investigation, these graph oath calls do not incur
any charges against your azure billing account.

There is
a way to use MSAL.js to directly use frontend to fetch the JWT, but this
requires you to have a microsoft account and use it to access the app
registration, and it requires you to store client
credentials on the frontend which is never recommended.

## Integrating MQTT client in your Angular app.

We will be using [MQTT.js](https://github.com/mqttjs/MQTT.js) for this purpose,
although not written for Angular Exclusively like **ngx-mqtt**, this is the one
and only and most maintained mqtt client for the browser, for benefits of
observables and rxjs you can easily write your own wrapper on top of it.

1. Start by getting the library.

```bash
npm install mqtt
```

2. Import mqtt to your component.

```js
import mqtt from "mqtt";
```

1. Define the connection options. The connection obey `IClientOptions` contract from the library, which can be imported for safe
   type checking.

   ```typescript
   public MQTT_OPTIONS: IClientOptions = {
    hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
    port: 443,
    path: '/mqtt',
    protocol: 'wss',
    username: 'angularapp',
    protocolVersion: 5,
    properties: {
      authenticationMethod: 'OAUTH2-JWT',
      authenticationData: Buffer.from("Your JWT Token"),
    },
    authPacket: {
      reasonCode: 25,
      properties: {
        authenticationMethod: 'OAUTH2-JWT',
        authenticationData: Buffer.from("Your Refresh Token"),
      },
    },
   };
   ```

2. Solving the certificate issue with browsers: chromium(V8) based browsers would not allow you to establish a wss connection to EGN's MQTT broker (Works fine in firefox(SPIDERMONKEY), NOT TESTED ON SAFARI(WEBKIT)), because the MQTT server is configured to have client certificates CA chain to be trusted. This issue is notoriously hard to debug like any ssl related errors because of them being not verbose at all. One of the fixes is mentioned [here](https://github.com/MicrosoftDocs/azure-docs/issues/121843#issuecomment-2074073800). Following this we can create a hidden iframe which calls the specific url of the wss but using https `https://<event_grid_mqtt_host>/mqtt `. This will result in a 4xx error in the console but it is expected, this is only for the browser to select a default certificate and allow mqtt over wss for the session.

**Note:** _On some windows devices, browsers will prompt the user to select a certificate, if the user cancels the popup it will try to match a default certificate and if one exists it will connect. One most windows devices with proper certs this should not cause any issues and the default routing should be automatic with no popups. On linux and android however, the browsers use their own certificate store separate from the OS (unlike on windows where browsers share the certificate store), they will work by default._

3. Establish a connection using `connectAsync`, this returns a client, which should be stored and publishing and subscription can be performed accrodingly. This repo contains the code for publishing and subscribing inside `display-mqtt-message.component.ts`. This is just a POC, ideally you should do this with the help of angular services.

4. For any questions [contact](mailto:sameertrivedi1234@gmail.com).
