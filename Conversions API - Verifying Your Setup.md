# Verifying Your Setup

**Updated:** 24 de nov de 2025

This page details ways to verify that your setup is working correctly and is intended to help you improve ad performance.

The process of verifying your setup consists of:

- Verifying that events are received correctly;
- Verifying that events are being sent as close to real-time as possible;
- Verifying that events are deduplicated correctly;
- Verifying that events are matched to users with high accuracy.

---

# Verifying that events are received correctly

## Monitoring events received

After you send your events, confirm that Meta has received them in **Events Manager**.

You should be able to verify them within **20 minutes** after they were sent.

Meta Blueprint Course:

```text
Set Up, Implement and Verify the Conversions API
```

To monitor events received in Events Manager:

1. On the **Data Sources** page, click on the Pixel corresponding to the `PIXEL_ID` in your `POST` request.
2. For more information, see **Business Help Center: Navigate Events Manager**.
3. Click **Overview**.

In this section, you will see the number of events Meta received before they are:

- Deduplicated;
- Discarded due to consent controls and other policies;
- Processed.

Under **Connection Method**, you can see the channel in which that event was sent.

You can click on each event type to get more specific information.

---

# Monitoring event freshness

To help Facebook optimize your ads, Meta recommends that you minimize the time between:

- When an event occurs, represented by the `event_time` parameter;
- When it is shared with Facebook.

The goal is to send events as close to real-time as possible.

You can use **Events Manager** to monitor event freshness.

In the **Overview** page for a given Pixel:

1. Click the **Event Details** button for an event.
2. Navigate to the **Event Freshness** tab.

In this tab, you can see the average event delay time on a scale from:

- Real Time;
- Daily;
- Weekly.

---

# Verifying that events are deduplicated correctly

For optimal ad performance, Meta recommends that advertisers implement the **Conversions API** alongside their **Meta Pixel**.

When advertisers do so, they must set up a deduplication method to help ensure that the ad delivery system is able to differentiate between:

- Distinct events;
- Overlapping events.

Learn more about deduplication.

You can use **Events Manager** to monitor the percentage of events that were deduplicated.

In the **Overview** page for a given Pixel:

1. Click the **Event Details** button for an event type.
2. Navigate to the **Event Deduplication** tab.

## Information shown in the Event Deduplication tab

### Rate of Events Deduplicated

This is the percentage of events that have been deduplicated from each event source.

Higher percentages are better, and a warning will appear when your deduplication rate is too low.

You may be able to improve deduplication rates by adding more deduplication parameters to the event.

### Rate of Deduplication Key Usage

This is the percentage of events from each source that contained each dedupe key.

**Overlap** is the percentage of events with a given dedupe key received from both sources, calculated as a percentage of the source with the fewest events received.

Having low **Overlap** means that the implementation is either:

- Sending non-unique dedupe keys from one source or both sources;
- Sending events with a dedupe key from only one source.

---

# Verifying that events are matched to users with high accuracy

When your events are matched to people with a Facebook account, your events can be better utilized for:

- Ad attribution;
- Optimization.

In **Events Manager**, you can monitor **Event Match Quality**.

Event Match Quality is a measure of how effective your server event’s customer information parameters may be at matching events to a Facebook account.

Event Match Quality is scored from **1 to 10**.

You can monitor Event Match Quality in two ways:

- Navigate to the **Overview** page for a given Meta Pixel with the Conversions API;
- Use the **Setup Quality API**.

Having a high Event Match Quality score can help decrease your cost per action.

Where possible, Meta typically recommends that you aim for an **Event Match Quality score of 6.0 or higher**.

You can click on the **Event Match Quality** score to view additional details and recommendations for improving Event Match Quality.

Learn more about additional best practices for Event Match Quality.