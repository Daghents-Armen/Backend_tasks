class Member{
    constructor(name, member_id){
        this.name = name;
        this.member_id = member_id;
        this.borrowed_books = [];
    }

    borrowbooks(book){
        if(book.borrow()){
            this.borrowed_books.push(book);
        }
    }

    returnbook(book){
        let index = this.borrowed_books.indexOf(book);

        if(index >= 0 && this.returnbook()){
            this.borrowed_books.splice(index, 1);
        }
    }
}

module.exports = Member;