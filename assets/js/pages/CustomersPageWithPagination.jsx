import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination'

const CustomersPageWithPagination = props => {

    const [customers,setCustomers ] = useState([])
    const [totalItems, setTotalItems] = useState(0) 
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const itemsPerPage = 8 

    // Get and display customers
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data['hydra:member'])
                setTotalItems(response.data['hydra:totalItems'])
                setLoading(false)
            })
            .catch(error => console.log(error.response))
    }, [currentPage])


    // Customer deletion
    const handleDelete = id => {
        console.log(id)

        const originalCustomers= [...customers]

        setCustomers(customers.filter(customer => customer.id !== id))

        axios
            .delete("http://127.0.0.1:8000/api/customers/" +id)
            .then(response => console.log("DELETE Order OK"))
            .catch(error => { 
                setCustomers(originalCustomers)
                console.log(error.response)
            })
    }


    // Pagination

    const handleChangePage = (page) => {
        setCurrentPage(page)
        setLoading(true)
    }
    
    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage)

    return <>
        <h1>Liste des clients auto paginate</h1>

        <table className="table table-hover table-dark">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
            </thead>
            <tbody>
                { loading && 
                <tr>
                    <td>Chargement...</td>
                </tr>}

                { !loading && customers.map(customer =>
                    <tr key={customer.id}>
                        <td>
                            {customer.id}
                        </td>
                        <td>
                            <a href="#">{customer.firstName} {customer.lastName}</a>
                        </td>
                        <td>
                            {customer.email}
                        </td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            {customer.invoices.length}
                        </td>
                        <td className="text-center">
                            {customer.totalAmount.toLocaleString()} €
                        </td>
                        <td>
                            <button disabled={customer.invoices.length > 0} 
                            onClick={() => handleDelete(customer.id)}
                            className="btn btn-sm btn-danger">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
        <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            length={totalItems} 
            onPageChanged={handleChangePage}
        />
    </>
}


export default CustomersPageWithPagination;