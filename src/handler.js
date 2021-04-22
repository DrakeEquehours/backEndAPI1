const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;
  if(pageCount === readPage){
    finished = true;
  }
  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished
  };
  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if(name == undefined || name == ""){
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {books.splice(index, 1)};
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku', 
    });
    response.code(400);
    return response;
  }
  else if(readPage>pageCount){
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {books.splice(index, 1)};
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 
    });
    response.code(400);
    return response;
  }
  else if(isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;
  if (reading == undefined && finished == undefined){
    if (name==undefined){
       var response = h.response({
        status: 'success',
        data: {
          books: books.map((book) =>({
            id:book.id,
            name:book.name,
            publisher:book.publisher,
          }))
        },
      })
      response.code(200)
      return response;
    }
  }
  else if(reading == 0 || reading == false){
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((n) => n.reading == false).map((n) => ({id:n.id, name:n.name, publisher:n.publisher}))
      }, 
    });
    return response;
  }
  else if(reading == 1 || reading == true){
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((n) => n.reading == true).map((n) => ({id:n.id, name:n.name, publisher:n.publisher}))
      }, 
    })
    return response;
  }
  else if(finished == 0 || finished == false){
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((n) => n.finished == false).map((n) => ({id:n.id, name:n.name, publisher:n.publisher}))
      }, 
    });
    return response
  }
  else if(finished == 1 || reading == true){
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((n) => n.finished == true).map((n) => ({id:n.id, name:n.name, publisher:n.publisher}))
      }, 
    })
    return response;
  }
  else if(name != undefined){
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((n) => n.name.toLowerCase().include(name.toLowerCase())).map(() => ({id:n.id, name:n.name, publisher:n.publisher}))
      }, 
    })
    return response;
  };
  response.code(200);
  return response
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((n) => n.id === bookId)[0];
   
    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
   
    const index = books.findIndex((book) => book.id == bookId);
    if(name == undefined || name == ""){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku', 
        });
        response.code(400);
        return response;
    }
    else if(readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 
        });
        response.code(400);
        return response;
    }
    else if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
   
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };
   
  const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const index = books.findIndex((book) => book.id === bookId);
   
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  const getReadingBookHandler = (request,h) => {
    const { reading } = request.query;
    if(reading == 0 || reading == false){
      const response = h.response({
        status: 'success',
        data: books.filter((n) => n.reading == false), 
      });
      return response;
    }
    else if(reading == 1 || reading == true){
      const response = h.response({
        status: 'success',
        data: books.filter((n) => n.reading == true), 
      })
      return response;
    };
    response.code(400);
    return response;
  };
  const getFinishedBookHandler = (request,h) => {
    const { finished } = request.query;
    if(finished == 0 || finished == false){
      const response = h.response({
        status: 'success',
        data: books.filter((n) => n.finished == false), 
      });
      return response
    }
    else if(reading == 1 || reading == true){
      const response = h.response({
        status: 'success',
        data: books.filter((n) => n.reading == true), 
      })
      return response;
    };
    response.code(400);
    return response;
  };
  module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
    getReadingBookHandler,
    getFinishedBookHandler,
  };