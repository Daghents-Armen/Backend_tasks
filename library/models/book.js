class Book{
    constructor(title, author, year){
        this.title = title;
        this.author = author;
        this.year = year;
        this.isBorrowed = false;
    }

    borrow(){
        if(this.isBorrowed){
            console.log(`Book: ${this.title} is borrowed...`);
            return false;
        }
        this.isBorrowed = true;
        console.log(`you borrowed ${this.title} book`);
        return true;
        
    }

    return_Book(){
       if(!this.isBorrowed){
        console.log(`${this.title} is not borrowed...`);
        return false;
       }
       this.isBorrowed = false;
       console.log(`${this.title} is returned`);
       return true;
    }
}

module.exports = Book;