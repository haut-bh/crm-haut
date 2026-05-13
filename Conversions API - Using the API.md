# Using the API

**Updated:** 6 de fev de 2026

Once you have completed the prerequisites on the **Get Started** page, use this page to learn how to send events and use the **Test Events** tool.

Once you’ve sent an event, verify your setup.

The **Conversions API** is based on Facebook’s **Marketing API**, which was built on top of the **Graph API**.

Marketing and Graph APIs have different version deprecation schedules. Meta’s release cycle is aligned with the Graph API, so every version is supported for at least two years.

> **Note:** this exception is only valid for the Conversions API.

Web, app, and physical store events shared using the Conversions API require specific parameters.

By using the Conversions API, you agree that the `action_source` parameter is accurate to the best of your knowledge.

The list of required parameters is available here.

---

# Send Requests

To send new events, make a `POST` request to this API’s `/events` edge from this path:

```text
https://graph.facebook.com/{API_VERSION}/{PIXEL_ID}/events?access_token={TOKEN}
```

When you post to this edge, Facebook creates new server events.

```bash
curl -X POST \
  -F 'data=[
       {
         "event_name": "Purchase",
         "event_time": 1762902353,
         "user_data": {
           "em": [
             "309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd"
           ],
           "ph": [
             "254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4",
             "6f4fcb9deaeadc8f9746ae76d97ce1239e98b404efe5da3ee0b7149740f89ad6"
           ],
           "client_ip_address": "123.123.123.123",
           "client_user_agent": "$CLIENT_USER_AGENT",
           "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
           "fbp": "fb.1.1558571054389.1098115397"
         },
         "custom_data": {
           "currency": "usd",
           "value": 123.45,
           "contents": [
             {
               "id": "product123",
               "quantity": 1,
               "delivery_category": "home_delivery"
             }
           ]
         },
         "event_source_url": "http://jaspers-market.com/product/123",
         "action_source": "website"
       }
     ]' \
  -F 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/v25.0/<PIXEL_ID>/events
```

Attach your generated secure access token using the `access_token` query parameter to the request.

You can also use **Graph API Explorer** to `POST` to the:

```text
/<pixel_id>/events
```

endpoint.

---

# Example request body

An example request body looks like this:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1633552688,
      "event_id": "event.id.123",
      "event_source_url": "http://jaspers-market.com/product/123",
      "action_source": "website",
      "user_data": {
        "client_ip_address": "192.19.9.9",
        "client_user_agent": "test ua",
        "em": [
          "309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd"
        ],
        "ph": [
          "254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4",
          "6f4fcb9deaeadc8f9746ae76d97ce1239e98b404efe5da3ee0b7149740f89ad6"
        ],
        "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
        "fbp": "fb.1.1558571054389.1098115397"
      },
      "custom_data": {
        "value": 100.2,
        "currency": "USD",
        "content_ids": [
          "product.id.123"
        ],
        "content_type": "product"
      },
      "opt_out": false
    },
    {
      "event_name": "Purchase",
      "event_time": 1633552688,
      "user_data": {
        "client_ip_address": "192.88.9.9",
        "client_user_agent": "test ua2"
      },
      "custom_data": {
        "value": 50.5,
        "currency": "USD"
      },
      "opt_out": false
    }
  ]
}
```

---

# Upload Time versus Event Transaction Time

`event_time` is the event transaction time.

It should be sent as a Unix timestamp in seconds indicating when the actual event occurred.

The specified time may be earlier than the time you send the event to Facebook. This enables batch processing and server performance optimization.

The `event_time` can be up to **7 days before** you send an event to Meta.

If any `event_time` in `data` is greater than 7 days in the past, Meta returns an error for the entire request and processes no events.

For offline and physical store events with `physical_store` as `action_source`, you should upload transactions within **62 days** of the conversion.

By using the Conversions API, you agree that the `action_source` parameter is accurate to the best of your knowledge.

---

# Batch Requests

You can send up to **1,000 events** in `data`.

However, for optimal performance, Meta recommends that you send events as soon as they occur and ideally within **one hour** of the event occurring.

If any event you send in a batch is invalid, Meta rejects the entire batch.

---

# Hashing

Please check Meta’s customer information parameters page to see which parameters should be hashed before they are sent to Facebook.

If you are using one of Meta’s Business SDKs, the hashing is done for you by the SDK.

---

# Business SDK Features for Conversions API

Learn more about three specific Business SDK features designed especially for Conversions API users:

- Asynchronous Requests;
- Concurrent Batching;
- HTTP Service Interface.

## Minimum language version required

| Language | Minimum version |
|---|---|
| PHP | `>= 7.2` |
| Node.js | `>= 7.6.0` |
| Java | `>= 8` |
| Python | `>= 2.7` |
| Ruby | `>= 2` |

> **Note:** Business SDK support for PHP 5 has been deprecated since January 2019. Please upgrade to PHP 7 to use the Business SDK.

---

# Verify Events

After you send your events, confirm that Meta has received them in **Events Manager**.

## Step 1

On the **Data Sources** page, click on the Pixel corresponding to the `PIXEL_ID` in your `POST` request.

For more information, see **Business Help Center: Navigate Events Manager**.

## Step 2

Click **Overview**.

You will see the number of:

- Raw events;
- Matched events;
- Attributed events.

Under **Connection Method**, you can see the channel in which that event was sent.

![Verify Events - Overview](./verify-events-overview.png)

You can click on each event to get more specific information.

![Verify Events - Event Details](./verify-events-details.png)

After you start sending events, you should be able to verify them within **20 minutes**.

Now you can start sending events from your server.

---

# Test Events Tool

You can verify that your server events are received correctly by Facebook by using the **Test Events** feature in Events Manager.

To find the tool, go to:

```text
Events Manager > Data Sources > Your Pixel > Test Events
```

The Test Events tool generates a test ID.

Send the test ID as a `test_event_code` parameter to start seeing event activity appear in the Test Events window.

> **Note:** the `test_event_code` field should be used only for testing.  
> You need to remove it when sending your production payload.

Events sent with `test_event_code` are not dropped.

They flow into Events Manager and are used for targeting and ads measurement purposes.

---

# Test Events request example

Here’s an example of how the request should be structured:

```json
{
  "data": [
    {
      "event_name": "ViewContent",
      "event_time": 1764975551,
      "event_id": "event.id.123",
      "event_source_url": "http://jaspers-market.com",
      "user_data": {
        "client_ip_address": "1.2.3.4",
        "client_user_agent": "test user agent"
      }
    }
  ],
  "test_event_code": "TEST123"
}
```

Here’s an example of how the request appears in **Graph API Explorer**:

> You can generate this test payload using the Payload Helper tool.  
> Please note that the test event code is only for testing payload.

![Graph API Explorer - Test Event Request](./graph-api-explorer-test-event-request.png)

Your server events appear in the **Test Events** window once the request is sent.

![Test Events Window](./test-events-window.png)

---

# Data Processing Options for US Users

For these two APIs, implement data processing options by adding the following fields inside each event within the `data` parameter of your events:

- `data_processing_options`
- `data_processing_options_country`
- `data_processing_options_state`

> **Note:** the App Events and Offline Conversions APIs are no longer recommended for new integrations.  
> Instead, Meta recommends that you use the Conversions API, as it now supports web, app, and offline events.

See:

- Conversions API for App Events;
- Conversions API for Offline Events.

---

# Explicitly not enabling Limited Data Use

To explicitly not enable **Limited Data Use**, also known as `LDU`, specify an empty array for each event or simply remove the field in the payload:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": "<EVENT_TIME>",
      "user_data": {
        "em": "<EMAIL>"
      },
      "custom_data": {
        "currency": "<CURRENCY>",
        "value": "<VALUE>"
      },
      "data_processing_options": []
    }
  ]
}
```

---

# Enable LDU and have Meta perform geolocation

To enable `LDU` and have Meta perform geolocation:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": "<EVENT_TIME>",
      "user_data": {
        "em": "<EMAIL>",
        "client_ip_address": "256.256.256.256"
      },
      "custom_data": {
        "currency": "<CURRENCY>",
        "value": "<VALUE>"
      },
      "data_processing_options": ["LDU"],
      "data_processing_options_country": 0,
      "data_processing_options_state": 0
    }
  ]
}
```

---

# Enable LDU and manually specify the location

To enable `LDU` and manually specify the location, for example, California:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": "<EVENT_TIME>",
      "user_data": {
        "em": "<EMAIL>"
      },
      "custom_data": {
        "currency": "<CURRENCY>",
        "value": "<VALUE>"
      },
      "data_processing_options": ["LDU"],
      "data_processing_options_country": 1,
      "data_processing_options_state": 1000
    }
  ]
}
```

---

# Manual Upload UI

The **Offline Conversions API** offers the option to manually upload your events from a `.csv` file.

In this case, add the following columns inside your file:

- Data Processing Options;
- Data Processing Country;
- Data Processing State.

More information about this can be found in the upload user interface.

Learn more about **Data Processing Options**.

---

# API Limits

The Marketing API has its own rate-limiting logic and is excluded from all Graph API rate limitations.

So, if you make a Marketing API call, it won’t be calculated into the Graph API throttling.

There is no specific rate limit for the Conversions API.

Conversions API calls are counted as Marketing API calls.

The only limitation is that you can send up to **1,000 events at a time**.

See **Send Requests** for more information.

---

# Business SDK API Usage in the Conversions API Gateway

This guide helps you navigate Meta Business SDK advanced features designed especially for Conversions API Gateway users.

For basic Conversions API Gateway usage, refer to the Conversions API Gateway documentation.

---

# Send Events to Your Conversions API Gateway Instance

## Requirements

Before using any of the features listed below, you need to have the Meta Business SDK installed.

See **Get Started with the Meta Business SDK** or follow the README instructions listed here:

- PHP: `facebook-php-business-sdk`
- Node.js: `facebook-nodejs-business-sdk`
- Java: `facebook-java-business-sdk`
- Python: `facebook-python-business-sdk`
- Ruby: `facebook-ruby-business-sdk`

Currently, these features are only available on the PHP and Java Business SDK.

The other languages will be implemented by the end of 2023.

## Minimum language version required

| Language | Minimum version |
|---|---|
| PHP | `>= 7.2` |
| Java | `>= 8` |

> **Note:** to dedupe events to the Conversions API endpoint, please pass the `eventId` in your request.  
> This will help prevent duplicate events from showing up if Conversions API publishing is enabled.

---

# Formatting the `CAPIGatewayIngressRequest` Parameters

| Parameter | Type | Description |
|---|---|---|
| `endpointUrl` | string | The Conversions API Gateway endpoint that events get sent to. No prevalidation will be done on the parameter other than checking if it is a valid URL. Example: `https://test.example.com`. |
| `accessKey` | string | Conversions API Gateway access key that is needed to send events to the Conversions API Gateway events endpoint. |

---

# The `CAPIGatewayIngressRequest` Setters

| Parameter | Type | Description |
|---|---|---|
| `setSendToDestinationOnly` | Boolean | Boolean flag on whether the events get sent to the selected endpoint only. Default: `False`. |
| `setFilter` | `CustomEndpointRequest.Filter()` function | Filter function that processes each event. If the filtering logic returns `true`, the event gets passed through. Otherwise, the event gets dropped. You have to implement the `shouldSendEvent` function in the interface that has the parameter `Event`. Default: `Null`. |

---

# Migration Example: PHP

For systems that already use the Business SDK, you just need to reference the new `CAPIGatewayIngressRequest` and attach it to the event request’s `customEndpoint` object.

```php
// this is the standard event request that we attach events to
$event_request = new EventRequest($this->pixel_id);

$capiIngressRequest = new CAPIGatewayIngressRequest($this->cb_url, $this->access_key);

$event_request->setCustomEndpoint($capiIngressRequest);

// pass the events to this event Request object
$event_request->setEvents($events);

$event_request->execute();
```

---

# Migration Example: Java

For systems that already use the Business SDK, you just need to reference the new `CAPIGatewayIngressRequest` and attach it to the event request’s `customEndpoint` object.

```java
// this is the standard event request that we attach events to

EventRequest eventRequest = new EventRequest(PIXEL_ID, context);

CAPIGatewayIngressRequest capiSyncRequest = new CAPIGatewayIngressRequest(CB_URL, CAPIG_ACCESS_KEY);

eventRequest.setCustomEndpoint(capiSyncRequest);

eventRequest.addDataItem(testEvent);

eventRequest.execute();
```

---

# Synchronous option

## PHP Code Example

```php
$api = Api::init(null, null, $this->access_token);

$api->setLogger(new CurlLogger());

$event_request = new EventRequest($this->pixel_id);

$capiIngressRequest = new CAPIGatewayIngressRequest($this->cb_url, $this->access_key);

$event_request->setCustomEndpoint($capiIngressRequest);

$user_data = (new UserData())
   ->setEmails(array('joe@eg.com'))
   ->setPhones(array('12345678901', '14251234567'))
   ->setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890')
   ->setFbp('fb.1.1558571054389.1098115397');

$event1 = (new Event())
   ->setEventName('Purchase')
   ->setEventId('125')
   ->setEventTime(time())
   ->setEventSourceUrl('http://jaspers-market.com/product/123')
   ->setUserData($user_data);

$events = array($event1, $event2);

$event_request->setEvents($events);

$response = $event_request->execute();

print($response->__toString());
```

## Java Code Example

```java
EventRequest eventRequest = new EventRequest(PIXEL_ID, context);

UserData userData = new UserData()
       .email("abc@eg.com");

CAPIGatewayIngressRequest capiSyncRequest = new CAPIGatewayIngressRequest(CB_URL, CAPIG_ACCESS_KEY);

eventRequest.setCustomEndpoint(capiSyncRequest);

Event testEvent = new Event();

testEvent.eventId("125").eventName("Purchase")
       .eventTime(System.currentTimeMillis() / 1000L)
       .userData(userData)
       .dataProcessingOptions(new String[]{})
       .setEventId("134423232");

eventRequest.namespaceId("11")
       .uploadId("22222")
       .uploadTag("upload-tag-4")
       .uploadSource("upload-source-4")
       .testEventCode("test-event-code-5")
       .partnerAgent("partner-agent-6");

eventRequest.addDataItem(testEvent);

eventRequest.execute();
```

---

# Asynchronous option

## PHP Code Example

```php
$api = Api::init(null, null, $this->access_token);

$api->setLogger(new CurlLogger());

$event_request = new EventRequestAsync($this->pixel_id);

$capiIngressRequest = new CAPIGatewayIngressRequest($this->cb_url, $this->access_key);

$capiIngressRequest->setSendToDestinationOnly(true);

$event_request->setCustomEndpoint($capiIngressRequest);

$event1 = (new Event())
   ->setEventName('test Async Event')
   ->setEventId('134423232')
   ->setEventTime(time())
   ->setEventSourceUrl('http://jaspers-market.com/product/123');

$events = array($event1, $event2);

$event_request->setEvents($events);

$response = $event_request->execute()->wait();
```

## Java Code Example

```java
EventRequest eventRequest = new EventRequest(PIXEL_ID, context);

UserData userData = new UserData()
       .email("abc@eg.com");

CAPIGatewayIngressRequest capiSyncRequest = new CAPIGatewayIngressRequest(CB_URL, CAPIG_ACCESS_KEY);

capiSyncRequest.setSendToDestinationOnly(true);

eventRequest.setCustomEndpoint(capiSyncRequest);

Event testEvent = new Event();

testEvent.eventName("test Async Event")
       .eventTime(System.currentTimeMillis() / 1000L)
       .userData(userData)
       .dataProcessingOptions(new String[]{})
       .setEventId("134423232");

eventRequest.namespaceId("11222")
       .uploadId("22222")
       .uploadTag("upload-tag-4")
       .uploadSource("upload-source-4")
       .testEventCode("test-event-code-5")
       .partnerAgent("partner-agent-6");

eventRequest.addDataItem(testEvent);

eventRequest.executeAsync();
```

---

# Filter Functionality

## PHP Code Example

```php
class APIFilter implements Filter {
   public function shouldSendEvent(Event $event): bool
   {
       if ($event->getEventId() === '125') {
           return false;
       }

       return true;
   }
}

$capiIngressRequest = new CAPIGatewayIngressRequest($this->cb_url, $this->access_key);

$event_request->setCustomEndpoint($capiIngressRequest);

$capiIngressRequest->setFilter(new APIFilter());
```

## Java Code Example

```java
CAPIGatewayIngressRequest capiSyncRequest = new CAPIGatewayIngressRequest(CB_URL, CAPIG_ACCESS_KEY);

eventRequest.setCustomEndpoint(capiSyncRequest);

capiSyncRequest.setFilter(new CustomEndpointRequest.Filter() {
   @Override
   public boolean shouldSendEvent(Event event) {
      if (event.getEventId().equals("125")) {
         return true;
      }

      return false;
   }
});
```