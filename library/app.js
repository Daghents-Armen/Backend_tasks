let Book = require('./models/book');
let Member = require('./models/member');
let library = require('./services/libservice');

const b1 = new Book("shoe dog", "phil knight", 1937);
const b2 = new Book("1984", "george orwell", 1949);

let m1 = new Member("james", 1);
let m2 = new Member("jon", 2);

library.add_book(b1);
library.add_book(b2);
library.add_member(m1);
library.add_member(m2);

library.borrow("1984", 1);

library.borrow("1984", 2);

library.return("1984", 1);

library.borrow("1984", 2);