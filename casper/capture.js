var casper = require('casper').create();

casper.start('http://www.outdoorsatuva.org/members/join/', function() {
  //   listItems = this.evaluate(function() {
  //     var nodes = document.querySelectorAll('form');
  //     return [].map.call(nodes, function(node) {
  //       return node.id;
  //     });
  //   });

  //   this.echo(listItems);
  //   // this.fill('form', {q: 'plop'}, false);
  //   this.echo(this.getFormValues('form')); // 'plop'

  this.fillSelectors(
    '#theform',
    {
      'input[name="firstName"]': 'Chad',
      'input[name="lastName"]': 'Baily',
      'input[id="student1"]': '1',

    },
    true
  );
    this.capture('test.png');
});

casper.run();
