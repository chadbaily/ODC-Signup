var casper = require('casper').create();
var subject = 'ME, PLEASEIGNORE';

casper.start();
casper.thenOpen(
  '/{{ http://www.outdoorsatuva.org/members/membership/list_all }}'
);

casper.then(function() {
  // Select all the subject IDs in the table
  var id = this.getElementsInfo('div div:nth-child(3) form:nth-child(2) table tbody tr:nth-child(3)').map(function(
    value,
    index,
    array
  ) {
    return array[index].text();
  });

  // Select all the data-crdid in the table
  var data = this.getElementsInfo('table tr td input', 'data-crdid');

  var selected = data[id.indexOf(subject)];

  this.thenEvaluate(function(selected) {
    document.querySelector('input[data-crdid="' + selected + '"]').click();
  }, selected);
});

casper.run();
