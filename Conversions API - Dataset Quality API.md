# Dataset Quality API

**Updated:** 8 de dez de 2025

Advertisers that share server events using the **Conversions API** can see the event match quality score in **Meta Events Manager**.

However, this only works on an individual basis and is difficult to scale in cases where a Tech Provider partner, agency partner or advertiser is managing hundreds or thousands of Meta Pixels for their businesses.

The **Dataset Quality API**, formerly known as **Integration Quality API**, can help solve this problem by consolidating dataset quality metrics programmatically at scale.

---

# What’s New

As of **May 28th, 2025**, the following additional metrics have been added to the API for querying:

- Additional Conversions Reported;
- Additional Conversions Reported per parameter;
- Additional Conversions Reported per event;
- Additional Conversions Reported for event coverage;
- Event Coverage;
- Event Deduplication;
- Data Freshness;
- Event Match Quality Diagnostics.

Also, the **Dataset Quality API for Offline Events**, currently under beta, and new metrics are now available.

---

# Common Use Cases

Partners and agencies may use the Dataset Quality API to:

- Provide a quality dashboard and insights;
- Help advertisers enhance and optimize their integrations;
- Monitor the stability of their Conversions API integration.

Advertisers may use this endpoint to aggregate dataset quality data and incorporate it into their monitoring.

---

# Setup Requirements

## Ownership and Access

### Advertiser Authentication Using Meta Business Manager

In **Business Manager**:

1. Go to the **Users** section.
2. Select the **System User** tab.
3. Click on the specific system user you are using for the Conversions API.
4. Go to the **Assign Asset** dialog.
5. Choose **Pixels**.
6. Select the pixels you want to send events on behalf of.
7. For each pixel, select the **Manage Pixel** permission.
8. Click **Save Changes**.
9. Go back to your system user’s details page.
10. Verify that the selected pixels are visible there.

To generate the access token, follow the instructions here.

---

# Partner Platform Authentication

You must first request authorization to send events on behalf of your clients.

You have the following authentication options:

## Facebook Login for Business

**Recommended**

Facebook Login for Business is the preferred authentication and authorization solution for Tech Providers and business app developers who need access to their business clients’ assets.

It allows you to specify:

- The access token type;
- Types of assets;
- Permissions your app needs.

You can save this as a set, also called a configuration.

Then, you can present the set to your business clients so they can complete the flow and grant your app access to their business assets.

---

## Meta Business Extension

**Recommended**

With this option, **Meta Business Extension**, also called **MBE**, returns all the necessary information needed to send events on behalf of the client.

MBE provides an endpoint to retrieve system user access tokens created in the client’s Business Manager.

This process includes permissions to send server events and is done automatically and securely.

> **Note:** MBE is currently under beta. Please contact your Meta representative for access.

The endpoint requires a user access token as an input parameter.

If you are a new MBE user, call this endpoint to fetch the system user access token after you have finished setting up MBE.

Existing users need to ask for re-authentication before calling the new API endpoint.

---

## Client Shares Meta Pixel to Partner’s Business Manager

With this option, the client shares their Meta Pixel to the partner using:

- Business Manager settings;
- API.

Then, the partner can assign the partner system user to the client pixel and generate an access token to send server events.

---

## Client Generates Token Manually Using Events Manager

Advertisers can generate access tokens in **Events Manager** to:

- Set up the Conversions API;
- Access the Dataset Quality API.

You can configure a direct integration or share the generated access token with your partners to send events to Meta.

You can copy and save this new token.

> **Note:** Meta will not store these tokens.

The generated token will be able to:

- Fetch quality data;
- Send events using the Conversions API.

---

# User Permission

The user or system user used to make the API call requires, at minimum, the following user permission:

```text
Partial access -> Use events dataset
```

User access may be granted in bulk by using the instructions provided here.

---

# App Permission

## Basic

If you manage a small number of Meta datasets and/or wish to test the Dataset Quality API, the following app permissions are required:

- `ads_read`;
- `ads_management` or `business_management`.

## Advanced

If you manage a high number of Meta datasets on behalf of other businesses and/or require higher rate limits, then the following are required:

- Advanced level of the `ads_management` app permission;
- App feature **Ads Management Standard Access**.

Advanced level app permissions and features require app review.

---

# Retrieving Dataset Quality Information

## Endpoint

```text
https://graph.facebook.com/v25.0/dataset_quality
```

---

# Parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `dataset_id` | integer | Yes | The ID of the dataset, or Pixel, to retrieve quality data. |
| `access_token` | string | Yes | Valid, unexpired access token for the given dataset, or Pixel ID. Meta recommends setting up a long-lived system user access token. |
| `agent_name` | string | No | The normalized value of the `partner_agent` field. Used to filter only events sent with the `partner_agent` parameter in the `/{pixel_id}/events` POST request. |

## About `agent_name`

For example, if your `partner_agent` value is:

```text
[partner_name]_[majorversion]_[minorVersion]
```

Your normalized agent string value will be:

```text
partner_name
```

in lowercase.

The `agent_name` allows you to set your own platform identifier when sending events on behalf of a client.

If you are a managed partner or agency, work with your Meta representative to agree on an identifier for your platform.

If you are an advertiser, most of the time you should not worry about `agent_name` attribution.

If you do not provide an `agent_name`, all events, regardless of whether they were sent by an agent or not, will be included in the EMQ calculation.

---

# Fields

| Field | Type | Description |
|---|---|---|
| `web` | array | Structured set of data related to website events. The filter is an array containing `event_name` and its metrics. This field is required by default in this API. |
| `event_name` | string | A standard event or custom event name. |
| `event_match_quality` | `AdsPixelCAPIEMQ` | Event Match Quality indicates how effective the customer information sent from your server may be at matching event instances to a Facebook account. |
| `event_potential_aly_acr_increase` | `AdsPixelCAPIEventALYACR` | Additional Conversions Reported, or ACR, for Conversions API Event. Estimates how many conversions are measured as a result of an advertiser’s Conversions API setup. |
| `acr` | `AdsDatasetCAPIACR` | Additional Conversions Reported. Helps you understand how much your business benefits from using the Conversions API alongside the Meta Pixel. |
| `event_coverage` | `AdsDatasetEventCoverage` | Event coverage is the 7-day average percent of Pixel events that are covered by the Conversions API and share deduplication keys with events from the Conversions API. |
| `dedup_key_feedback` | `AdsDatasetDedupKeyFeedback` | Helps identify active issues with deduplication. |
| `data_freshness` | `AdsDatasetDataFreshness` | Shows how current your data is by measuring the delay between when the event occurred and when Meta received it. |

> **Tip:** look inside each node, following the hyperlink to the separate developers page, to find all fields and child nodes for the fields listed above.

---

# EMQ

## About Event Match Quality

**Event Match Quality**, or **EMQ**, is a score out of 10 that indicates how effective the customer information sent from your server may be at matching event instances to a Meta account.

High quality event matching may improve ads attribution and performance.

---

## How It’s Calculated

Event Match Quality is calculated by looking at:

- Which customer information parameters are received from your server using a Conversions API integration;
- The quality of the information received;
- The percent of event instances that are matched to a Meta account.

---

## How It’s Used

Event Match Quality is used to assess whether:

- You are sending the right customer information through the Conversions API;
- Your events can be matched to a Meta account;
- Your customer information parameters are set up correctly.

Customer information parameters help match your events to a Meta account so you can:

- Attribute conversions to your ads;
- Deliver ads to people who are most likely to convert.

Event Match Quality is calculated in real time.

Learn more about EMQ best practices here.

> **Note:** EMQ is currently available only for web events.  
> For other event types, such as offline and physical store events, app events, conversion leads or any integration under alpha or beta stages, contact your Meta representative for guidance on improving match quality.

---

## Use Case

Monitor Event Match Quality score per event, along with match keys being sent.

You can use this to:

- Build an EMQ trendline;
- Create historical extracts;
- Set up alerts or detectors for EMQ score drops;
- Set up alerts or detectors for match key drops.

## Documentation

All fields available for EMQ diagnostics can be found on the developer’s page.

---

# Example: Event Match Quality

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&agent_name=<AGENT_NAME>&access_token=<ACCESS_TOKEN>&fields=web{event_match_quality,event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{event_match_quality,event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'agent_name=<AGENT_NAME>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "event_match_quality": {
        "composite_score": 6.2,
        "match_key_feedback": [
          {
            "identifier": "user_agent",
            "coverage": {
              "percentage": 100
            }
          },
          {
            "identifier": "external_id",
            "coverage": {
              "percentage": 100
            }
          }
        ]
      },
      "event_name": "pLTVPurchase"
    },
    {
      "event_match_quality": {
        "composite_score": 7.2,
        "match_key_feedback": [
          {
            "identifier": "email",
            "coverage": {
              "percentage": 100
            }
          },
          {
            "identifier": "ip_address",
            "coverage": {
              "percentage": 99.9
            }
          }
        ]
      },
      "event_name": "CompleteRegistration"
    }
  ]
}
```

---

# Additional Conversions Reported for Event Match Quality Parameters

**Additional Conversions Reported**, or **ACR**, is a metric that estimates how many conversions, such as purchases or link clicks, are measured as a result of an advertiser’s Conversions API setup.

To learn more about this metric, see the **About ACR** article and the **Learn More** section.

---

## Use Case

For events connected to the Conversions API that have an EMQ score, monitor the uplift in additional conversions that the Conversions API can add when sending more and/or higher quality match keys.

## Documentation

All fields available for ACR EMQ parameters can be found in the developer documentation.

---

# Example: ACR for EMQ Parameters

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&agent_name=<AGENT_NAME>&access_token=<ACCESS_TOKEN>&fields=web{event_match_quality{match_key_feedback{identifier,potential_aly_acr_increase{percentage,description}}},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{event_match_quality{match_key_feedback{identifier,potential_aly_acr_increase{percentage,description}}},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'agent_name=<AGENT_NAME>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "event_match_quality": {
        "match_key_feedback": [
          {
            "identifier": "email",
            "potential_aly_acr_increase": {
              "percentage": 58.96,
              "description": "Similar advertisers who sent valid Email for Purchase saw a 58.96% median increase in their existing additional conversions reported."
            }
          },
          {
            "identifier": "ip_address",
            "potential_aly_acr_increase": {
              "percentage": 20.65,
              "description": "Similar advertisers who sent valid Ip Address for Purchase saw a 20.65% median increase in their existing additional conversions reported."
            }
          }
        ]
      },
      "event_name": "Purchase"
    }
  ]
}
```

---

# EMQ Diagnostics

Event match quality diagnostics are issues Meta identified with your Conversions API integration.

Follow the provided recommendations to:

- Send higher quality match keys;
- Optimize your ad performance;
- Improve your EMQ score.

---

## Use Case

Extract and store EMQ diagnostics in your environment.

Then, set up notifications using channels such as:

- Email;
- Messenger;
- In-app notifications.

This allows you to resolve issues reactively.

## Documentation

All fields available for EMQ diagnostics can be found in the developer documentation.

---

# Example: EMQ Diagnostics

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&agent_name=<AGENT_NAME>&access_token=<ACCESS_TOKEN>&fields=web{event_match_quality{diagnostics},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{event_match_quality{diagnostics},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'agent_name=<AGENT_NAME>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "event_match_quality": {
        "diagnostics": [
          {
            "name": "Update your IPv4 IP addresses to IPv6 IP addresses",
            "description": "Your server is sending IPV4 IP addresses through the Conversions API. We recommend updating to IPV6 IP addresses because this is the industry standard and offers better durability for this integration.",
            "solution": "You can update your web server and DNS provider configuration to support IPv6. In your server payload, send the client_ip_address retrieved from customer interactions. Use the payload helper to see how this value should be structured when it's sent to Meta. If this issue is not applicable or actionable, you can ignore it.",
            "percentage": 59.5,
            "affected_event_count": 18930,
            "total_event_count": 31830
          },
          {
            "name": "Server sending mismatched IP addresses",
            "description": "Your server is sending client IP addresses that do not match those from Meta Pixel. This may impact the attribution and optimization of your ad campaigns.",
            "solution": "In your server payload, send the client_ip_address retrieved from customer interactions. Use the payload helper to see how this value should be structured when it's sent to Meta.",
            "percentage": 61.5,
            "affected_event_count": 19567,
            "total_event_count": 31830
          }
        ]
      },
      "event_name": "Purchase"
    }
  ]
}
```

---

# Event Coverage

Event coverage is the 7-day average percentage of Meta Pixel events that are covered by the Conversions API and share deduplication keys with events from the Conversions API.

Learn more about event coverage best practices by reading the Business Help Center article.

---

## Use Case

Evaluate the events that are connected by server versus those that are not.

For example, if an advertiser has three events:

- `ViewContent`;
- `AddToCart`;
- `Purchase`.

But only `Purchase` is sent by server, the event coverage will be:

```text
33%
```

## Documentation

All fields available for event coverage can be found in the developer documentation.

---

# Example: Event Coverage

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&access_token=<ACCESS_TOKEN>&fields=web{event_coverage{percentage,goal_percentage,description},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{event_coverage{percentage,goal_percentage,description},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "event_coverage": {
        "percentage": 34.1,
        "goal_percentage": 75,
        "description": "The percentage of events received from your Conversions API compared to unique browser events from the Meta Pixel."
      },
      "event_name": "B2B Purchase"
    }
  ]
}
```

---

# Additional Conversions Reported for Event Coverage

**Additional Conversions Reported**, or **ACR**, for Event Coverage helps you understand how much your business benefits from using the Conversions API alongside the Meta Pixel.

For event coverage, you can see the potential improvement in additional conversions reported if both:

- Event coverage;
- Deduplication.

meet best practices.

To learn more about additional conversions reported, see the **About ACR** article and the **Learn More** section.

---

## Use Case

For events connected to the Conversions API that have event coverage below the **75% threshold**, monitor the uplift in additional conversions that the Conversions API can add when covering more events, increasing the server versus browser ratio.

## Documentation

All fields available for ACR for Event Coverage can be found in the developer documentation.

---

# Example: ACR for Event Coverage

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&access_token=<ACCESS_TOKEN>&fields=web{event_coverage{potential_aly_acr_increase{percentage,description}},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{event_coverage{potential_aly_acr_increase{percentage,description}},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "event_coverage": {
        "potential_aly_acr_increase": {
          "percentage": 35.8,
          "description": "Similar advertisers who send the same AddToCart pixel events with matching deduplication keys through Conversions API saw a median of 35.8% additional conversions reported versus those that only used Meta Pixel."
        }
      },
      "event_name": "AddToCart"
    }
  ]
}
```

---

# Event Deduplication

The Meta Pixel and the Conversions API enable you to share standard and custom events with Meta so you can measure and optimize ad performance.

The Pixel enables you to share web events from a web browser.

The Conversions API enables you to share web events directly from your server.

If you connect website activity using both the Pixel and the Conversions API, Meta may receive the same events from the browser and the server.

If Meta knows that the events are the same and therefore redundant, Meta can keep one and discard the rest.

This process is called **deduplication**.

The deduplication key feedback shows the percentages of events from the Pixel and the Conversions API that were received with each deduplication key.

Meta recommends sharing deduplication keys for all of your events.

The higher the percentage, the better.

To learn more about deduplication best practices, see the Business Help Center article.

---

## Use Case

Monitor the rate of deduplication between browser and server events to help increase the event coverage rate for your Conversions API-connected events.

## Documentation

All fields available for dedupe key feedback can be found in the developer documentation.

---

# Example: Event Deduplication

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&agent_name=<AGENT_NAME>&access_token=<ACCESS_TOKEN>&fields=web{dedupe_key_feedback{dedupe_key,browser_events_with_dedupe_key{percentage,description},server_events_with_dedupe_key{percentage,description},overall_browser_coverage_from_dedupe_key{percentage,description}},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{dedupe_key_feedback{dedupe_key,browser_events_with_dedupe_key{percentage,description},server_events_with_dedupe_key{percentage,description},overall_browser_coverage_from_dedupe_key{percentage,description}},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'agent_name=<AGENT_NAME>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "dedupe_key_feedback": [
        {
          "dedupe_key": "event_id",
          "browser_events_with_dedupe_key": {
            "percentage": 100,
            "description": "The percentage of browser events that contain this dedupe key."
          },
          "server_events_with_dedupe_key": {
            "percentage": 100,
            "description": "The percentage of server events that contain this dedupe key."
          },
          "overall_browser_coverage_from_dedupe_key": {
            "percentage": 14.8,
            "description": "The overall percentage of browser events that are deduped with Conversions API events using this key. This percentage is incremental for each dedupe key."
          }
        },
        {
          "dedupe_key": "external_id",
          "browser_events_with_dedupe_key": {
            "percentage": 100,
            "description": "The percentage of browser events that contain this dedupe key."
          },
          "server_events_with_dedupe_key": {
            "percentage": 100,
            "description": "The percentage of server events that contain this dedupe key."
          },
          "overall_browser_coverage_from_dedupe_key": {
            "percentage": 15.96,
            "description": "The overall percentage of browser events that are deduped with Conversions API events using this key. This percentage is incremental for each dedupe key."
          }
        },
        {
          "dedupe_key": "fbp",
          "browser_events_with_dedupe_key": {
            "percentage": 0,
            "description": "The percentage of browser events that contain this dedupe key."
          },
          "server_events_with_dedupe_key": {
            "percentage": 0,
            "description": "The percentage of server events that contain this dedupe key."
          },
          "overall_browser_coverage_from_dedupe_key": {
            "percentage": 0,
            "description": "The overall percentage of browser events that are deduped with Conversions API events using this key. This percentage is incremental for each dedupe key."
          }
        }
      ],
      "event_name": "AddToCart"
    }
  ]
}
```

---

# Data Freshness

Data freshness indicates the delay between the time the event occurred and when Meta received it.

Best practice is to share your events in real time, or as close to real time as possible.

The Meta Pixel defaults to sending web browser events in real time.

To get the most value from your events, Meta recommends that you send them in real time, or as close to real time as possible.

Events sent with a delay may impact how effectively your ads can be delivered to the right audiences.

To learn more about data freshness best practices, see the Business Help Center article.

---

## Use Case

Evaluate how quickly events are received from server versus browser.

Improve frequency to `real_time` when possible to get the most value from your event data.

## Documentation

All fields available for data freshness can be found in the developer documentation.

---

# Example: Data Freshness

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&agent_name=<AGENT_NAME>&access_token=<ACCESS_TOKEN>&fields=web{data_freshness{upload_frequency,description},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{data_freshness{upload_frequency,description},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'agent_name=<AGENT_NAME>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "data_freshness": {
        "upload_frequency": "real_time",
        "description": "The average frequency with which instances of this event are received through the Conversions API."
      },
      "event_name": "ViewContent"
    },
    {
      "data_freshness": {
        "upload_frequency": "hourly",
        "description": "The average frequency with which instances of this event are received through the Conversions API."
      },
      "event_name": "Lead"
    }
  ]
}
```

---

# Additional Conversions Reported for Conversions API Event

**Additional Conversions Reported**, or **ACR**, for Conversions API Event is a metric that estimates how many conversions, for example purchases or link clicks, are measured as a result of an advertiser’s Conversions API setup.

To learn more about additional conversions reported, see the **About ACR** article and the **Learn More** section.

---

## Use Case

For Meta Pixels not connected to the Conversions API, extract the additional conversions reported metric to estimate the impact a Conversions API integration may have.

## Documentation

All fields available for ACR for Conversion API event can be found in the developer documentation.

---

# Example: ACR for Conversions API Event

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&access_token=<ACCESS_TOKEN>&fields=web{event_potential_aly_acr_increase{description,percentage},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{event_potential_aly_acr_increase{description,percentage},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "event_potential_aly_acr_increase": {
        "description": "Similar advertisers who set up Conversions API for Search events saw a median of 32.9% additional conversions reported versus those that only used Meta Pixel.",
        "percentage": 32.9
      },
      "event_name": "Search"
    },
    {
      "event_potential_aly_acr_increase": {
        "description": "Similar advertisers who set up Conversions API for PageView events saw a median of 30.1% additional conversions reported versus those that only used Meta Pixel.",
        "percentage": 30.1
      },
      "event_name": "PageView"
    }
  ]
}
```

---

# Additional Conversions Reported

**Additional Conversions Reported**, or **ACR**, is a metric that helps you understand how much your business benefits from using the Conversions API alongside the Meta Pixel.

It can also help you determine whether you can improve your Conversions API setup to measure more reported conversions.

More reported conversions can help you:

- Decrease your cost per result;
- Show your ads to people who find them relevant.

To learn more about additional conversions reported, see the **About ACR** article and the **Learn More** section.

---

## Use Case

For events connected to the Conversions API that have an EMQ score, monitor the uplift in additional conversions that the Conversions API is able to drive.

## Documentation

All fields available for ACR can be found in the developer documentation.

---

# Example: Additional Conversions Reported

## Graph API Explorer

```http
GET /v25.0/dataset_quality?dataset_id=<DATASET_ID>&access_token=<ACCESS_TOKEN>&fields=web{acr{description,percentage},event_name}
```

## cURL

```bash
curl -X GET -G \
  -d 'fields=web{acr{description,percentage},event_name}' \
  -d 'dataset_id=<DATASET_ID>' \
  -d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/<LATEST_VERSION>/dataset_quality
```

## API Response

```json
{
  "web": [
    {
      "acr": {
        "description": "In the last 7 days, you saw about 37.9% more conversions reported for Search events by using the Conversions API alongside the Meta Pixel.",
        "percentage": 37.9
      },
      "event_name": "Search"
    },
    {
      "acr": {
        "description": "In the last 7 days, you saw about 45.5% more conversions reported for Page View events by using the Conversions API alongside the Meta Pixel..",
        "percentage": 45.5
      },
      "event_name": "PageView"
    }
  ]
}
```

---

# FAQs

## What Is the Dataset Quality API?

Advertisers that share server events using the Conversions API can see the Event Match Quality score in Events Manager.

However, this only works on an individual basis and is difficult to scale in cases where a tech provider partner, agency partner or advertiser is managing hundreds or thousands of Meta Pixels for their businesses.

The **Dataset Quality API**, formerly known as **Integration Quality API**, can help solve this problem by consolidating dataset quality metrics programmatically at scale.

---

## What is the access token used for?

The access token is used when partners:

- Send signal events;
- Access the Setup Quality API on behalf of advertisers.

The client system user access token onboarding method is not compatible with the EMQ API at the moment.

---

## How should the `partner_agent` field be formatted?

The `partner_agent` value in your API GET request should be in a normalized lowercase format.

This field is now optional.

---

## Can an Access Token Generated Using Events Manager Prior to July 2025 Access the Dataset Quality API Directly?

The advertiser will need to go to Events Manager to accept by using the instructions in the **Client Generates Token Manually Using Events Manager** section explained above.

Once the advertiser completes the opt-in process, both the new token and existing generated tokens by the same user will be able to:

- Send events;
- Access the Dataset Quality API.