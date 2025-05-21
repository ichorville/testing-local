type BookState = {
  books: Book[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: BookState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const BookStore = signalStore(withState(initialState));
