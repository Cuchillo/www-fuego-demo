export const CuchilloWorker = {
  init: function () {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(function() {} );
    }
  },
};
