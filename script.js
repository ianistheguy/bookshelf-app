// Book class
class Book {
    constructor(title, author, pageNum, read = true) {
        this.title = title;
        this.author = author;
        this.pageNum = pageNum;
        this.read = read ? 'Yes' : 'No';
    }
}

// DOM strings object with corresponding HTML/CSS IDs
const DOMstrings = {
    form: '#form',
    newBook: '#new-book',
    idTitle: '#book-title',
    idAuthor: '#book-author',
    idPages: '#book-pages',
    idRead: '#read',
    submitType: '#submit',
    cancelType: '#cancel'
}

// UI class
class UI {
    // Show form when "Add a New Book" button is clicked
    static showForm() {
        document.querySelector(DOMstrings.newBook).addEventListener('click', () => {
            let form = document.querySelector(DOMstrings.form);
            form.style.display = 'block';
            document.querySelector(DOMstrings.newBook).style.display = 'none';
        })
    }
   
    // Hide form after submitting book info
    static hideAfterSubmit() {
        document.querySelector(DOMstrings.form).style.display = 'none';
        document.querySelector(DOMstrings.newBook).style.display = 'block';
    }

    // Hide form by clicking "Cancel" button
    static cancelForm() {
        document.querySelector(DOMstrings.cancelType).addEventListener('click', () => {
            let form = document.querySelector(DOMstrings.form);
            form.style.display = 'none';
            document.querySelector(DOMstrings.newBook).style.display = 'block';
        })
    }
    
    // Display books in UI
    static render() {
        const library = Store.storeBooks();

        library.forEach((book) => UI.addBooksToTable(book));
    }

    // Add books to UI table
    static addBooksToTable(bookObj) {
        const list = document.querySelector('.book-list');

        let row = document.createElement('tr');

        row.innerHTML = `
            <td><em>${bookObj.title}</em></td>
            <td>${bookObj.author}</td>
            <td>${bookObj.pageNum}</td>
            <td><button class="change-status">${bookObj.read}</button></td>
            <td><button class="remove-book">Remove</button></td>
        `
        list.appendChild(row);
    }

    // Delete books from UI table
    static deleteBooks(el) {
        if (el.classList.contains('remove-book')) {
            el.parentElement.parentElement.remove();
        }
    }

    // Clear input fields
    static clearFields() {
        document.querySelector(DOMstrings.idTitle).value = '';
        document.querySelector(DOMstrings.idAuthor).value = '';
        document.querySelector(DOMstrings.idPages).value = '';
        document.querySelector(DOMstrings.idRead).checked === false;

        document.querySelector(DOMstrings.idTitle).focus();
    }
}

// Storage class
class Store {
    static storeBooks() {
        let bookShelf;
        if(localStorage.getItem('bookShelf') === null) {
            bookShelf = []; 
        } else {
            bookShelf = JSON.parse(localStorage.getItem('bookShelf'));
        }
        return bookShelf;
    }

    static addBookToLibrary(bookObj) {
        const books = Store.storeBooks();

        books.push(bookObj);

        localStorage.setItem('bookShelf', JSON.stringify(books));
    }

    static removeBook(read) {
        const books = Store.storeBooks();

        books.forEach((bookObj, index) => {
            if (bookObj.read === read) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem('bookShelf', JSON.stringify(books));
    }

    static changeReadStatus(read, title) {
        const books = JSON.parse(localStorage.getItem('bookShelf'));
        
        books.forEach(book => {
            if (book.title === title) {
                book.read = read;
            }
        })

        localStorage.setItem('bookShelf', JSON.stringify(books));
    }
}

UI.showForm();
UI.cancelForm();

// Event to display books in UI table
document.addEventListener('DOMContentLoaded', UI.render);

// Event to add Book
document.querySelector(DOMstrings.form).addEventListener('submit', (e) => {

    // Get input values from form
    const title = document.querySelector(DOMstrings.idTitle).value;
    const author = document.querySelector(DOMstrings.idAuthor).value;
    const pageNum = document.querySelector(DOMstrings.idPages).value;
    const read = document.querySelector(DOMstrings.idRead).checked;

    // Validate form input values
    if (title === '' || author === '' || pageNum === '') {
        alert('Please fill in all the fields!')
    } else {
        // Instantiate Books
        const book = new Book(title, author, pageNum, read);

        // Add books to UI
        UI.addBooksToTable(book);

        // Add books to local storage
        Store.addBookToLibrary(book);

        // Clear fields
        UI.clearFields();

        /*
        // Form will close
        UI.hideAfterSubmit();
        */
    }

    // Prevent actual default
    e.preventDefault();
})

// Event to remove Book
document.querySelector('.book-list').addEventListener('click', (e) => {
    if (e.target.className === 'remove-book') {
        // Remove book from UI
        UI.deleteBooks(e.target);

        // Remove book from storage
        Store.removeBook(e.target.parentElement.parentElement.textContent);
    }
})

// Event to change Read Status
document.querySelector('.book-list').addEventListener('click', (e) => {
    if (e.target.className === 'change-status') {
        if (e.target.textContent === 'Yes') {
            e.target.textContent = 'No';
            Store.changeReadStatus(e.target.textContent, e.target.parentElement.parentElement.children[0].textContent);
        } else {
            e.target.textContent = 'Yes';
            Store.changeReadStatus(e.target.textContent, e.target.parentElement.parentElement.children[0].textContent);
        }
    }
})
