const createMiddleware = () => {
    return {
      load: async () => {
        const response = await fetch("/accidents");
        const json = await response.json();
        return json;
      },
      delete: async (id) => {
        const response = await fetch("/delete/" + id, {
          method: 'DELETE',
        });
        const json = await response.json();
        return json;
      },
      add: async (accident) => {
        const response = await fetch("/insert", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                accident: accident
            })
        });
        const json = await response.json();
        return json;        
      }
    }
  }

  export default createMiddleware;



