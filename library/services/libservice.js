let books = [];
let members = [];

function add_book(book){
    books.push(book);
}

function add_member(member){
    members.push(member);
}

function find_book(title){
    return books.forEach(b => b.title === title);
}

function find_member(id){
    return members.forEach(m => m.id === id);
}

function borrow(title, memberid){
    let book = find_book(title);
    let member = find_member(memberid);

    if(!book) return 'has not found';
    if(!member) return 'has not found';

    member.borrowbooks(book);
}

function returnBook(title, memberId) {
    let book = find_book(title);
    let member = find_member(memberId);

    if (!book) return 'has not found';
    if (!member) return 'has not found';

    member.returnBook(book);
}

module.exports = {
    add_book,
    add_member,
    find_book,
    find_member,
    borrow,
    return: returnBook
};