# Parameters

**Updated:** 13 de dez de 2025

These parameters consist of all required event data parameters and any additional data parameters the **Conversions API** needs to use for:

- Ads attribution;
- Ads delivery optimization.

The **Conversions API** now supports:

- Web events;
- App events;
- Offline events;
- Business messaging events.

Website events shared using the Conversions API require the following parameters:

- `client_user_agent`
- `action_source`
- `event_source_url`

Non-web events require only:

- `action_source`

These parameters contribute to improving the quality of events used for ad delivery and may improve campaign performance.

> **Note:** by using the Conversions API, you agree that the `action_source` parameter is accurate to the best of your knowledge.

---

# Main Body Parameters

- `data`
- `test_event_code`

---

# Customer Information Parameters

| Parameter | Description | Hashing |
|---|---|---|
| `em` | Email | Hashing required |
| `ph` | Phone Number | Hashing required |
| `fn` | First Name | Hashing required |
| `ln` | Last Name | Hashing required |
| `ge` | Gender | Hashing required |
| `db` | Date of Birth | Hashing required |
| `ct` | City | Hashing required |
| `st` | State | Hashing required |
| `zp` | Zip Code | Hashing required |
| `country` | Country | Hashing required |
| `external_id` | External ID | Hashing recommended |
| `client_ip_address` | Client IP Address | Do not hash |
| `client_user_agent` | Client User Agent | Do not hash |
| `fbc` | Click ID | Do not hash |
| `fbp` | Browser ID | Do not hash |
| `subscription_id` | Subscription ID | Do not hash |
| `fb_login_id` | Facebook Login ID | Do not hash |
| `lead_id` | Lead ID | Do not hash |
| `anon_id` | Install ID | Do not hash |
| `madid` | Mobile Advertiser ID | Do not hash |
| `page_id` | Page ID | Do not hash |
| `page_scoped_user_id` | Page scoped user ID | Do not hash |
| `ctwa_clid` | Click to WhatsApp ID | Do not hash |
| `ig_account_id` | IG account ID | Do not hash |
| `ig_sid` | Click to Instagram ID | Do not hash |

> **Note:** `anon_id` and `madid` are for app events only.

---

# Server Event Parameters

- `event_name`
- `event_time`
- `user_data`
- `custom_data`
- `event_source_url`
- `opt_out`
- `event_id`
- `action_source`
- `data_processing_options`
- `data_processing_options_country`
- `data_processing_options_state`
- `referrer_url`
- `customer_segmentation`

---

# App Data Parameters

- `advertiser_tracking_enabled`
- `application_tracking_enabled`
- `extinfo`
- `campaign_ids`
- `install_referrer`
- `installer_package`
- `url_schemes`
- `windows_attribution_id`
- `anon_id`
- `madid`
- `vendor_id`

> **Note:** see the **Conversions API for App Events** documentation for guidance on integrating app events.

---

# Standard Parameters

See a list of all standard parameters users can send to Meta.

---

# Original Event Data Parameters

- `event_name`
- `event_time`
- `order_id`
- `event_id`

---

# Conversions API for Lead Optimization

If you integrate your CRM system with the **Conversions API** for lead events, refer to the **CRM Integration guide** for the required fields.