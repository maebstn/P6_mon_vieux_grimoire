import axios from 'axios';
import { API_ROUTES } from '../utils/constants';

function formatBooks(bookArray) {
  return bookArray.map((book) => {
    const newBook = { ...book };
    // eslint-disable-next-line no-underscore-dangle
    newBook.id = newBook._id;
    return newBook;
  });
}

export function storeInLocalStorage(token, userId) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
}

export function getFromLocalStorage(item) {
  return localStorage.getItem(item);
}

export async function getAuthenticatedUser() {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = getFromLocalStorage('token');
    const userId = getFromLocalStorage('userId');
    if (!token) {
      return defaultReturnObject;
    }
    return { authenticated: true, user: { userId, token } };
  } catch (err) {
    console.error('getAuthenticatedUser, Something Went Wrong', err);
    return defaultReturnObject;
  }
}

export async function getBooks() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}`,
    });
    // eslint-disable-next-line array-callback-return
    const books = formatBooks(response.data);
    return books;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getBook(id) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BOOKS}/${id}`,
    });
    const book = response.data;
    // eslint-disable-next-line no-underscore-dangle
    book.id = book._id;
    return book;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getBestRatedBooks() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_ROUTES.BEST_RATED}`,
    });
    return formatBooks(response.data);
  } catch (e) {
    console.error(e);
    return [];
  }
}
export async function deleteBook(id) {
  try {
    await axios.delete(`${API_ROUTES.BOOKS}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function rateBook(id, userId, rating) {
  const data = {
    userId,
    rating: parseInt(rating, 10),
  };

  try {
    const response = await axios.post(`${API_ROUTES.BOOKS}/${id}/rating`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const book = response.data;
    // eslint-disable-next-line no-underscore-dangle
    book.id = book._id;
    return book;
  } catch (e) {
    console.error(e);
    return e.message;
  }
}

export async function addBook(data) {
  const userId = localStorage.getItem('userId');

  // Validation basique
  if (!data.title || !data.author || !data.year || !data.genre) {
    return { error: true, message: 'Tous les champs sont requis' };
  }

  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: parseInt(data.year, 10),
    genre: data.genre,
    ratings: data.rating
      ? [
          {
            userId,
            grade: parseInt(data.rating, 10),
          },
        ]
      : [],
    averageRating: data.rating ? parseInt(data.rating, 10) : 0,
  };

  const bodyFormData = new FormData();
  bodyFormData.append('book', JSON.stringify(book));

  if (data.file && data.file[0]) {
    bodyFormData.append('image', data.file[0]);
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${API_ROUTES.BOOKS}`,
      data: bodyFormData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    console.error("Erreur lors de l'ajout du livre:", err);
    return {
      error: true,
      message: err.response?.data?.error || err.message || "Une erreur est survenue lors de l'ajout du livre",
      details: err.response?.data,
    };
  }
}

export async function updateBook(data, id) {
  const userId = localStorage.getItem('userId');
  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: data.year,
    genre: data.genre,
  };

  const formData = new FormData();
  formData.append('book', JSON.stringify(book));
  if (data.file[0]) {
    formData.append('image', data.file[0]);
  }

  try {
    const response = await axios({
      method: 'put',
      url: `${API_ROUTES.BOOKS}/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    return {
      error: true,
      message: err.response?.data?.error || err.message || 'Une erreur est survenue lors de la mise à jour du livre',
    };
  }
}
