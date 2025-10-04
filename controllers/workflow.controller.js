import { createRequire } from "module";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import Subscription from "../models/subscription.model.js";

// Extend dayjs with necessary plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// We're using a CommonJS module here because @upstash/workflow/express doesn't fully support ESM yet
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

// Define the reminder intervals in days
const REMAINDER_DAYS = [7, 5, 2, 1];

/**
 * The main workflow function that schedules and triggers subscription reminders.
 */
export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);
  console.log(`Fetched subscription: ${subscriptionId}`);

  if (!subscription || subscription.status !== "active") {
    console.log("Subscription inactive or not found. Stopping workflow.");
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Subscription renewal date has passed for ${subscription._id}. Stopping workflow.`);
    return;
  }

  // Find the next reminder date that is today or in the future
  let nextReminderDate = null;
  let daysBeforeLabel = 0;

  for (const days of REMAINDER_DAYS) {
    const reminderDate = renewalDate.subtract(days, "day");
    if (reminderDate.isSameOrAfter(dayjs(), 'day')) {
      nextReminderDate = reminderDate;
      daysBeforeLabel = days;
    }
  }

  // If we found an upcoming reminder
  if (nextReminderDate) {
    // If the reminder is in the future, schedule a sleep and stop execution.
    // The workflow will wake up and run again on this date.
    if (nextReminderDate.isAfter(dayjs(), 'day')) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBeforeLabel} days before`,
        nextReminderDate
      );
      return; // Exit until the workflow wakes up
    }
    
    // If the reminder is for today, trigger it.
    if (nextReminderDate.isSame(dayjs(), 'day')) {
      await triggerReminder(context, `Reminder ${daysBeforeLabel} days before`, subscription);
    }
  } else {
    console.log("No upcoming reminders to schedule.");
  }
});

/**
 * Fetches subscription details within a traceable workflow step.
 */
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    console.log(`Fetching subscription ${subscriptionId}`);
    return await Subscription.findById(subscriptionId)
      .populate("user", "name email");
  });
};

/**
 * Schedules the workflow to sleep until the next reminder date.
 */
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until next reminder: ${label} on ${date.format('YYYY-MM-DD')}`);
  await context.sleepUntil(label, date.toDate());
};

/**
 * Triggers the reminder notification within a traceable workflow step.
 */
const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder for user: ${subscription.user.email}`);
    // --> This is where you would call your email-sending function <--
    // Example: await sendReminderEmail({ to: subscription.user.email, ... });
  });
};