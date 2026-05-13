# Get Started

**Updated:** 5 de dez de 2025

This page describes the process of implementing the **Conversions API** and details implementation prerequisites.

If you are a third-party partner offering Conversions API functionalities for advertisers, there are different requirements to get started.

If your business has a firewall for outbound requests, see **Crawler IPs and User Agents** to get Facebook’s IP addresses.

> **Note:** the list of addresses changes often.

Web, app, and physical store events shared using the Conversions API require specific parameters.

The list of required parameters is available here.

---

# Process Overview

The process of setting up a Conversions API integration consists of the following high-level steps:

1. Choosing the integration method that is right for you.
2. Completing the necessary prerequisites for that implementation method.
3. Implementing using that integration method.
4. Verifying your setup and adhering to best practices that help improve ad performance.

---

# Integration Methods

There are several methods for integrating with the Conversions API, and they vary by:

- Level of effort;
- Cost;
- Features they enable.

See this article for an overview of Conversions API setup options.

The primary focus of this developer documentation is building direct integrations.

---

# Requirements

## Pixel ID

You must obtain a **Pixel ID** to use the Conversions API.

If you’ve already set up a Pixel for your website, Meta recommends that you use the same Pixel ID for your browser and server events.

---

## Business Manager

You also need a **Business Manager** to use the API.

Business Manager helps advertisers integrate Facebook marketing efforts across their business and with external partners.

If you don’t have a Business Manager yet, see the Help Center article on how to create a Business Manager.

---

## Access Token

To use the Conversions API, you need an access token.

There are two ways of getting your access token:

- Using Events Manager, recommended;
- Using your own app.

---

# Using Events Manager

**Recommended**

To use the Conversions API, you need to generate an access token, which is passed as a parameter in each API call.

Inside Events Manager, follow these steps:

## Step 1

Choose the Pixel you want to implement.

## Step 2

Select the **Settings** tab.

## Step 3

Find the **Conversions API** section and click on the **Generate access token** link under **Set up manually**.

Then, follow the instructions in the pop-up.

> **Note:** the **Generate access token** link is only visible to users with developer privileges for the business.  
> The link is hidden from other users.

Once you have your token, click on the **Manage Integrations** button in the **Overview** tab in Events Manager.

In the pop-up screen, click the **Manage** button next to **Conversions API**.

This will automatically create:

- A Conversions API app;
- A Conversions API system user.

There is no need to go through App Review or request any permissions.

---

# Using Your Own App

If you already have your own app and your own system user, you can generate your token inside Business Manager.

To do that:

## Step 1

Go to your Business’ **Settings**.

## Step 2

Assign a Pixel to your system user.

You also have an option to create a new system user at this stage.

## Step 3

Select the assigned system user and click **Generate Token**.

Your app does not need to go through App Review.

You do not need to request any permissions.

---

# Access token compatibility

Access tokens generated under the Conversions API settings tab in Events Manager are no longer restricted to using the newest Graph API version that was available at the time of token generation.

Starting with `v12.0`, newly created access tokens can be used with all available Graph API versions.