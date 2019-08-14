import axios from 'axios'

function getAll() {
    return axios
        .get("http://127.0.0.1:8000/api/customers")
        .then(response => response.data['hydra:member'])
}

function deleteCustomer(id) {
    return axios
        .delete("http://127.0.0.1:8000/api/customers/" +id)
}



export default {
    getAll,
    delete: deleteCustomer
}