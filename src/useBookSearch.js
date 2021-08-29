import { useEffect, useState } from 'react';
import axios from 'axios';

export const useBookSearch = (query, pageNumber) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        // set back to a new array for every new query (search)
        setBooks([]);
    }, [query]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber }, // in the docs
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBooks(prevBooks => {
                // Set -> remove duplicates
                // ...res -> makes every res its own -> gets a line of their own
                return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])];
            })
            setHasMore(res.data.docs.length > 0);
            setLoading(false);
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true);
        })
        return () => cancel();
    }, [query, pageNumber]);
    return { loading, error, books, hasMore }
}
