export const registerSW = () => {
  navigator.serviceWorker.register("service-worker.js");

  navigator.serviceWorker.ready
    .then(function (registration) {
      // Use the PushManager to get the user's subscription to the push service.
      return registration.pushManager
        .getSubscription()
        .then(async function (subscription) {
          // If a subscription was found, return it.
          if (subscription) {
            return subscription;
          }

          // TODO: get from env variable ?
          const convertedVapidKey =
            "BCVpfz60YH7RZJBcUXs2M58_ArINR9qtvMg0UvJ_v-q7OdO8Ysdou0vEzcsaCu1NnUnctZIvxHg6Buy-m4Ctvg4";

          // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
          // send notifications that don't have a visible effect for the user).
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
        });
    })
    .then(function (subscription) {
      console.log(subscription);
    });
};
