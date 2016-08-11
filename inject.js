function anybody() {
  var url = `${location.href}`;
  var branch = document.querySelector('.commit-ref.current-branch.head-ref').innerText;
  var lastsha = document.querySelector('tr.commit:last-of-type .commit-meta').innerText;
  return `url: ${url}\nbranch: ${branch}\nlastsha: ${lastsha}`;
}
function signalSuccess() {
  document.body.setAttribute('grumpy-notified', 'success');
  new Notification('w00t \\o/', {
    icon: chrome.extension.getURL('green-grumpy.png'),
    body: anybody()
  });
}
function signalError() {
  document.body.setAttribute('grumpy-notified', 'error');
  new Notification('o noes /o\\', {
    icon: chrome.extension.getURL('artsy-grumpy.png'),
    body: anybody()
  });
}
function signalProgress() {
  document.body.setAttribute('grumpy-notified', 'progress');
  new Notification('waiting...', {
    icon: chrome.extension.getURL('blue-grumpy.png'),
    body: anybody()
  });
}
chrome.storage.sync.get('are-we-there-yet--interval', (items) => {
  var interval = +items['are-we-there-yet--interval'] || 2000;
  setInterval(() => {
    Notification.requestPermission(() => {
      chrome.storage.sync.get('are-we-there-yet--patterns', (items) => {
        var patterns = (items['are-we-there-yet--patterns'] || '').split(',');
        var url = `${location.href}`;
        var lastUrl = document.body.getAttribute('grumpy-url');
        document.body.setAttribute('grumpy-url', url);
        if (![].find.call(patterns, pattern => ((new RegExp(pattern)).test(url)))) {
          if (lastUrl !== url) {
            console.debug(
              lastUrl, '=>', url,
              'this url does not match any patterns,',
              'include it in the extension options if necessary.',
              'of course, it uses regular expressions'
            );
          }
          return;
        }
        if (lastUrl !== url) {
          console.debug(lastUrl, '=>', url, 'starting notifications, you can customize these with regular expressions');
          document.body.setAttribute('grumpy-notified', '');
        }
        var element = document.querySelector('.branch-action-item-icon.completeness-indicator');
        if (!element) {
          console.warn('could not find branch status element, is this a PR page?');
        }
        var lastNotified = document.body.getAttribute('grumpy-notified');
        var currentStatus = (element.classList.contains('completeness-indicator-success') && 'success') ||
          (element.classList.contains('completeness-indicator-error') && 'error') ||
          'progress';
        console.debug(lastNotified, '=>', currentStatus);
        var action = { success: signalSuccess, error: signalError, progress: signalProgress }[currentStatus];
        (lastNotified !== currentStatus) && action && action();
      });
    });
  }, interval);
});
