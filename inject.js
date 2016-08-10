chrome.storage.sync.get('are-we-there-yet--patterns', (items) => {
  var patterns = (items['are-we-there-yet--patterns'] || '').split(',');
  if ([].find.call(patterns, pattern => `${location.href}`.includes(pattern))) {
    setInterval(() => {
      Notification.requestPermission(() => {
        var node = document.querySelector('.branch-action-body .status-heading');
        var text = node.innerText;
        var notified = node.getAttribute('notified');
        if (notified) {
          return;
        }
        if ((/all checks have passed/i).test(text)) {
          node.setAttribute('notified', true);
          new Notification('all green');
          return;
        }
        if ((/failed/i).test(text)) {
          node.setAttribute('notified', true);
          new Notification('o noes!');
          return;
        }
      });
    }, 5000);
  }
});
