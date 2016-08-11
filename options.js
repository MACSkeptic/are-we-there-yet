chrome.storage.sync.get(['are-we-there-yet--patterns', 'are-we-there-yet--interval'], (items) => {
  document.querySelector('[name="patterns"]').value = items['are-we-there-yet--patterns'] || 'pull/';
  document.querySelector('[name="interval"]').value = items['are-we-there-yet--interval'] || 2000;
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    var interval = document.querySelector('[name="interval"]').value || '';
    var patterns = document.querySelector('[name="patterns"]').value || '';
    chrome.storage.sync.set({
      'are-we-there-yet--interval': `${interval}`,
      'are-we-there-yet--patterns': `${patterns}`
    }, () => {
      Notification.requestPermission(() => {
        new Notification(`saved!`, {
          icon: chrome.extension.getURL('happy-grumpy.png'),
          body: `using:\n - interval: ${interval}\n - patterns:\n   - ${patterns.split(',').join('\n   - ')}`
        });
      });
    });
  });
});
