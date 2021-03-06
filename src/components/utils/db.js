const db = {
    get: async (endpoint) => {
        const res = await fetch(endpoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await res.json();
    },
    post: async (endpoint, data) => {
        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          },
          body: data
        });

        return await res.json();
    },
    put: async (endpoint, data) => {
        const res = await fetch(endpoint, {
          method: 'PUT',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          },
          body: data
        });

        return await res.json();
    },
    delete: async (endpoint, data) => {
        const res = await fetch(endpoint, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          },
          body: data
        });

        return await res.json();
    }
};

export default db;
