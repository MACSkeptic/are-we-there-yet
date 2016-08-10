chrome.storage.sync.get('are-we-there-yet--patterns', (items) => {
  document.querySelector('[name="patterns"]').value = items['are-we-there-yet--patterns'];
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    chrome.storage.sync.set({
      'are-we-there-yet--patterns': document.querySelector('[name="patterns"]').value || ''
    }, () => {
      Notification.requestPermission(() => {
        new Notification(`saved!`);
      });
    });
  });
});
