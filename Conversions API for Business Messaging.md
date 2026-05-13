# Conversions API for Business Messaging: Onboarding Guide

**Updated:** 9 de fev de 2026

The **Conversions API** is a Meta Business Tool that lets Business Messaging Partners share their clients’ data, for which they have permissions, directly from their servers.

It is designed to automatically honor Meta’s user privacy controls.

This allows Business Messaging Partners to reliably send data about their clients’ valuable customer interactions in business chats to understand and improve performance for their clients’ ads that click to:

- WhatsApp;
- Messenger;
- Instagram.

This can help improve operational efficiency and grow their business.

This guide is designed to support Business Messaging Partners in completing the technical integration for the Conversions API for:

- WhatsApp;
- Messenger;
- Instagram.

It covers:

- Pre-integration requirements;
- Integration steps;
- Sending events via the Conversions API;
- Verifying events with Events Manager.

> **Note:** the Conversions API also enables advertisers to send website, app, offline, including physical store, and CRM events to Meta.  
> Currently, Business Messaging Partners that have integrated with the Conversions API for other use cases still need to go through the following steps for integration with the Conversions API for Business Messaging.

---

# Ads That Click to Messenger

## Pre-integration Requirements

Before getting started with any integration, it’s necessary to ensure the right technical foundations are established and relevant access is granted for specific assets and platforms.

### Create a Facebook developer app

If you don’t already have one, follow the instructions to create one.

### Integrate with the Messenger API

You must have advanced access to:

- `page_events` permission.

You will need to apply for advanced access for the `page_events` permission in the **Permissions and Features** section of the developer App Dashboard.

If you already have advanced access for the `pages_messaging` permission, your app should be automatically approved for the `page_events` permission after you apply.

You also need:

- **Ads Management Standard Access** feature.

To be eligible for the Advanced Access feature, you need to make a total of **1,500 successful Marketing API calls** with an error rate of less than **10%** in the past **15 days**.

This includes calls made through the Conversions API by a user with a role on the app.

---

## Integration Steps

### 1. Get Access Token

In order to call the Dataset API and the Conversions API, you need an access token with the necessary permission:

- `page_events`

Reuse the token generated from your Facebook Login for Business.

---

### 2. Get `page_id`

Make sure you know the Page ID for the Page you want to report events for.

---

### 3. Set Up Dataset

When sharing event data to Meta via the Conversions API, Meta needs to know the source that is associated with those events.

Datasets allow you to connect and manage event data from different sources in one place, such as:

- Website;
- Mobile app;
- Physical store location;
- Business chats.

Datasets are created either through a partner platform or directly on Events Manager.

The business owns the dataset, and if the business is working with a partner, access to the dataset will also be granted to the partner.

Use the `page_id` and `access_token` to create a dataset by making a `POST` call to the Dataset API.

If there is already an existing `dataset_id` associated with the Page, it will return that ID.

Sample call:

```text
https://graph.facebook.com/v16.0/{PAGE_ID}/dataset?access_token={TOKEN}
```

The response will be an ID, which represents the `dataset_id`.

Using this and the access token from Facebook Login for Business, you can now call the Conversions API to send messaging events to Meta.

> **Note:** if the Page is associated with a business account and the `business_management` permission is granted on the business account, the dataset will show up under the business account. Otherwise, it will be hidden from the advertiser.

---

### 4. Retrieve Page-Scoped ID

Page-scoped ID, also called **PSID**, is an identifier that represents the user in a user-business conversation.

This identifier is exposed via the Messages webhook and used throughout the send/receive API.

This is also used in the Conversions API when sending conversion events mapped to a particular user.

Make sure you know the PSID for the Page you want to report signals for.

---

## Send Events via the Conversions API

In the final stage of integration, it is now possible to send events via the Conversions API with all information obtained in the previous steps:

- `access_token`;
- `page_id`;
- `dataset_id`;
- `PSID`.

During the campaign period, as events happen in real time, notify Meta of these events via the Conversions API using the `dataset_id` and `access_token`.

Make a `POST` request to this API:

```text
https://graph.facebook.com/v16.0/{DATASET_ID}/events?access_token={TOKEN}
```

Below is a sample API call for a single purchase event.

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1675999999,
      "action_source": "business_messaging",
      "messaging_channel": "messenger",
      "user_data": {
        "page_id": "<PAGE_ID>",
        "page_scoped_user_id": "<PSID>"
      },
      "custom_data": {
        "currency": "USD",
        "value": 123
      }
    }
  ],
  "partner_agent": "<PARTNER_NAME>"
}
```

---

## Verifying Events with Events Manager

After an event has been sent to Meta over the Conversions API successfully, you should be able to see that event reflected in Events Manager for the particular dataset.

You can learn more about Events Manager and its usage here.

> **Note:** if you are a partner, you will need to instruct your advertiser on how to access their dataset in Events Manager in order to verify that the events are received.

---

# Ads That Click to WhatsApp

## Pre-integration Requirements

Before getting started with any integration, it’s necessary to ensure the right technical foundations are established and relevant access is granted for specific assets and platforms.

### Create a Facebook developer app

If you don’t already have one, follow the instructions to create one.

### Have advanced access to permissions

You must have advanced access to:

- `whatsapp_business_management`;
- `whatsapp_business_manage_events`.

You will need to apply for advanced access for the `whatsapp_business_manage_events` permission in the **Permissions and Features** section of the Developer App Dashboard.

If you already have advanced access for the `whatsapp_business_messaging` permission, your app should be automatically approved for the `whatsapp_business_manage_events` permission after you apply.

You also need:

- **Ads Management Standard Access** feature to allow your app to access the Marketing API.

To be eligible for the Advanced Access feature, you need to make a total of **1,500 successful Marketing API calls** with an error rate of less than **10%** in the past **15 days**.

This includes calls made through the Conversions API by a user with a role on the app.

---

### Be integrated with WhatsApp Business Platform

You need to be integrated with one of the two WhatsApp Business Platform integration options:

- **Cloud API**, hosted by Meta, recommended;
- **On-Premises API**, Biz API version `2.45.1`.

For On-Premises API, `ctwa_clid`, which is a required field for sending events over the Conversions API, is only available in the messages webhook on Biz API versions `2.45.1` and beyond.

> **Note:** WhatsApp Business Platform is fully transitioning to Meta’s next-generation Cloud API over the next 2 years.  
> The final supported version of the On-Premise API client will expire on **October 23, 2025**.

---

### Be integrated with a login solution

You must be integrated with a log-in solution for authentication and authorization, such as:

- Embedded Signup;
- Facebook Login for Business.

---

## Integration Steps

### 1. Get Access Token

In order to call Dataset API and the Conversions API, you need an access token with the necessary permissions:

- `whatsapp_business_management`;
- `whatsapp_business_manage_events`.

If you are integrated with Embedded Signup, Meta recommends that you reuse the token generated from the Embedded Signup flow.

Alternatively, you can use:

- Business Integration System User access token;
- System User access token;
- User access token.

As long as it contains the necessary permissions.

---

### 2. Retrieve WhatsApp Business Account ID

The WhatsApp Business Account ID, also called `waba_id`, can be obtained on completion of the Embedded Signup flow.

---

### 3. Set Up Dataset API

When sharing event data to Meta via the Conversions API, Meta needs to know the source that is associated with those events.

Datasets allow Meta Business Solutions Partners to connect and manage event data from different sources in one place, such as:

- Client’s website;
- Mobile app;
- Physical store location;
- Business chats.

Datasets are owned by the client and can be accessed by Meta Business Solutions Partners with the necessary permissions.

You can use the `whatsapp_business_account_id` and `access_token` to create a dataset by making a `POST` call to the Dataset API.

If there is already an existing `dataset_id` associated with the WhatsApp Business Account, it will return that ID.

Sample call:

```text
https://graph.facebook.com/v16.0/{WHATSAPP_BUSINESS_ACCOUNT_ID}/dataset?access_token={TOKEN}
```

In order to retrieve the `dataset_id`, you can make a `GET` call to the Dataset API with the `whatsapp_business_account_id` and `access_token`.

Sample call:

```text
https://graph.facebook.com/v16.0/{WHATSAPP_BUSINESS_ACCOUNT_ID}/dataset?access_token={TOKEN}
```

The response will be an ID, which represents the `dataset_id`.

At this point, the dataset is set up and ready for use.

Next, you will need to retrieve the `ctwa_clid` that’s required to make a Conversions API call to send an event.

---

### 4. Retrieve Click-to-WhatsApp Click ID

The Click-to-WhatsApp Click ID, also called `ctwa_clid`, is a personal identifier, unique per click, that is exposed to the business when the user entering the conversation originated from a click to WhatsApp ad.

This identifier needs to be sent back to Meta via the Conversions API call.

The `ctwa_clid` field is obtained from the `referral` object under the Messages webhook:

- Cloud API;
- On-Premise API.

Upon receiving the `ctwa_clid`, store it with the conversation.

When a conversion has happened within a conversation, send the corresponding `ctwa_clid` via the Conversions API.

Here’s a sample received message with a `referral` object containing a `ctwa_clid`:

```json
{
  "data": [
    {
      "contacts": [
        {
          "profile": {
            "name": "Kerry Fisher"
          },
          "wa_id": "16315551234"
        }
      ],
      "messages": [
        {
          "from": "12345678",
          "id": "ABGGFlA5FpafAgo6tHcNmNjXmuSf",
          "referral": {
            "body": "This is a great product",
            "ctwa_clid": "ARAkLkA8rmlFeiCktEJQ-QTwRiyYHAFDLMNDBH0CD3qpjd0HR4irJ6LEkR7JwFF4XvnO2E4Nx0-eM-GABDLOPaOdRMv-_zfUQ2a",
            "headline": "Our new product",
            "image": {
              "id": "e144be57-12b1-4035-a520-703fcc87ef45"
            },
            "source_id": "1234567890",
            "source_type": "ad",
            "source_url": "https://fb.me/AAAAA"
          },
          "text": {
            "body": "Can I learn more about your business?"
          },
          "timestamp": "1678189586",
          "type": "text"
        }
      ]
    }
  ]
}
```

---

## Send Events via the Conversions API

In the final stage of integration, it is now possible to send events via the Conversions API with all information obtained in the previous steps:

- `waba_id`;
- `dataset_id`;
- `ctwa_clid`.

During an advertiser’s campaign period, events happen in real time.

Notify Meta of these events via the Conversions API using `dataset_id` and access token.

Make a `POST` request to this API:

```text
https://graph.facebook.com/v16.0/{DATASET_ID}/events?access_token={TOKEN}
```

Below is a sample API call for a single purchase event.

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1675999999,
      "action_source": "business_messaging",
      "messaging_channel": "whatsapp",
      "user_data": {
        "whatsapp_business_account_id": "<WHATSAPP_BUSINESS_ACCOUNT_ID>",
        "ctwa_clid": "ARAkLkA8rmlFeiCktEJQ-QTwRiyYHAFDLMNDBH0CD3qpjd0HR4irJ6LEkR7JwFF4XvnO2E4Nx0-eM-GABDLOPaOdRMv-_zfUQ2a"
      },
      "custom_data": {
        "currency": "USD",
        "value": 123
      }
    }
  ],
  "partner_agent": "<PARTNER_NAME>"
}
```

---

## Verifying Events with Events Manager

After an event has been sent to Meta over the Conversions API successfully, you should be able to see that event reflected in Events Manager for the particular dataset.

You can learn more about Events Manager and its usage here.

> **Note:** if you are a partner, you will need to instruct your advertiser on how to access their dataset in their Events Manager in order to verify that the events are received.

---

# Ads That Click to Instagram Direct

## Pre-integration Requirements

Before getting started with any integration, it’s necessary to ensure the right technical foundations are established and relevant access is granted for specific assets and platforms.

### Create a Facebook developer app

If you don’t already have one, follow the instructions to create one.

### Integrate with the Messenger API

You must integrate with the Messenger API.

### Have advanced access to permissions

You must have advanced access to:

- `instagram_manage_events` permission.

You will need to apply for advanced access for the `instagram_manage_events` permission in the **Permissions and Features** section of the developer App Dashboard.

If you already have advanced access for the `instagram_manage_messages` permission, your app should be automatically approved for the `instagram_manage_events` permission after you apply.

You also need:

- **Ads Management Standard Access** feature.

To be eligible for the Advanced Access feature, you need to make a total of **1,500 successful Marketing API calls** with an error rate of less than **10%** in the past **15 days**.

This includes calls made through the Conversions API by a user with a role on the app.

---

## Integration Steps

### 1. Get Access Token

In order to call the Dataset API and the Conversions API, you need an access token with the necessary permission:

- `instagram_manage_events`

Reuse the token generated from your Facebook Login for Business.

---

### 2. Get `instagram_user_id`

Make sure you know the `instagram_user_id` for the Instagram account you want to report events for.

---

### 3. Set Up Dataset

When sharing event data to Meta via the Conversions API, Meta needs to know the source that is associated with those events.

Datasets allow you to connect and manage event data from different sources in one place, such as:

- Website;
- Mobile app;
- Physical store location;
- Business chats.

Datasets are created either through a partner platform or directly on Events Manager.

The business owns the dataset, and if the business is working with a partner, access to the dataset will also be granted to the partner.

Use the `instagram_user_id` and `access_token` to create a dataset by making a `POST` call to the Dataset API.

If there is already an existing `dataset_id` associated with the IG user, it will return that ID.

Sample call:

```text
https://graph.facebook.com/v16.0/{IG_USER_ID}/dataset?access_token={TOKEN}
```

The response will be an ID, which represents the `dataset_id`.

Using this and the access token from Facebook Login for Business, you can now call the Conversions API to send messaging events to Meta.

---

### 4. Retrieve Instagram-scoped ID

Instagram-scoped ID, also called **IGSID**, is an identifier that represents the user in a user-business conversation.

This identifier is exposed via the Messages webhook and used throughout the send/receive API.

This is also used in the Conversions API when sending conversion events mapped to a particular user.

Make sure you know the IGSID for the Instagram account you want to report events for.

---

## Send Events via the Conversions API

In the final stage of integration, you can now send events via the Conversions API with all information obtained in the previous steps:

- `dataset_id`;
- `access_token`;
- `instagram_user_id`;
- `IGSID`.

During the campaign period, as events happen in real time, notify Meta of these events via the Conversions API using `dataset_id` and access token.

Make a `POST` request to this API:

```text
https://graph.facebook.com/v16.0/{DATASET_ID}/events?access_token={TOKEN}
```

Below is a sample API call for a single purchase event.

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1675999999,
      "action_source": "business_messaging",
      "messaging_channel": "instagram",
      "user_data": {
        "instagram_business_account_id": "<INSTAGRAM_BUSINESS_ACCOUNT_ID>",
        "ig_sid": "<IGSID>"
      },
      "custom_data": {
        "currency": "USD",
        "value": 123
      }
    }
  ],
  "partner_agent": "<PARTNER_NAME>"
}
```

---

## Verifying Events with Events Manager

After an event has been sent to Meta over the Conversions API successfully, you should be able to see that event reflected in Events Manager for the particular dataset.

You can learn more about Events Manager and its usage here.

> **Note:** if you are a partner, you will need to instruct your advertiser on how to access their dataset in their Events Manager in order to verify that the events are received.

---

# Frequently Asked Questions

## What type of messaging events does the Conversions API for Business Messaging support?

The Conversions API for Business Messaging now supports the following types of events for business messaging:

- `Purchase`
- `LeadSubmitted`
- `InitiateCheckout`
- `AddToCart`
- `ViewContent`
- `OrderCreated`
- `OrderShipped`
- `OrderDelivered`
- `OrderCanceled`
- `OrderReturned`
- `CartAbandoned`
- `QualifiedLead`
- `RatingProvided`
- `ReviewProvided`

> **Note:** messaging events should only represent customer interactions that occur in the messaging thread, not conversions that occur on other channels like websites.  
> You can distinguish your events by choosing the corresponding action source during your integration process.

---

## Is there guidance from Meta to keep the same or use different apps for different Conversions API integrations?

It is a best practice that a partner should use one app, so that Meta can identify all the events sent from the partner.

If you are a partner who already has multiple apps, ensure the `partner_agent` is set to the partner agent name assigned to you.

Speak with your Meta representative if you are unsure.

---

## If a conversion occurs outside of the message thread, how do we pass the events to Meta?

If a conversion happens outside of the messaging thread, for example, on your website or app, you should still send that event back to Meta using the relevant Conversions API product.

For instance:

- If a conversion happens on your website, use the Conversions API for web;
- If a conversion happens on your app, use the Conversions API for app events.

The event will still be attributed to the click ID for the Conversions API for web.

The full list of parameters can be found here.

---

## Does the Conversions API enable optimization for ads that click to message?

The Conversions API enables access to purchase optimization for:

- Ads that click to Messenger;
- Ads that click to WhatsApp.

It is not available for Instagram ad optimization at this time.

For ads that click to Instagram, you can optimize your ad campaigns to drive more conversations.

---

## Can I reuse the existing dataset for the Conversions API for business messaging?

Yes.

Meta supports linking with an existing dataset.

You can refer to the available options to decide the right option for your business.

---

## If I’m using Conversions API for Website today, will adding business messaging to the same integration interfere with my existing integration?

No.

There is no risk to adding business messaging to your existing CAPI integration.

Attribution is based on the page/dataset ID and is not related to the app ID.

---

## How many datasets can be linked to a page?

You can only link **one dataset** to a page.

---

## Do I need to deduplicate events before sending them over Conversions API for Business Messaging?

Meta does not assist with deduplicating events for Conversions API for Business Messaging.

Meta highly encourages advertisers to perform deduplication before sending events over Conversions API for Business Messaging.