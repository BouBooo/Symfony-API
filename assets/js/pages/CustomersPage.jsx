import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination'
import CustomersAPI from "../services/customersAPI"

const CustomersPage = props => {

    const [customers,setCustomers ] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")

    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.getAll()
            setCustomers(data)
        } catch(error) {
            console.log(error)
        }
    }

    // Get and display customers
    useEffect(() => {
        fetchCustomers()
    }, [])


    // Customer deletion
    const handleDelete = async id => {
        const originalCustomers= [...customers]
        setCustomers(customers.filter(customer => customer.id !== id))
        try {
            await CustomersAPI.delete(id)
        } catch(error) {
            setCustomers(originalCustomers)
            console.log(error.response) 
        }
    }


    // Pagination
    const handleChangePage = (page) => setCurrentPage(page)

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }

    const itemsPerPage = 8

    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) || 
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    )
    
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        itemsPerPage
    )

    return <>
        <h1>Liste des clients</h1>

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
        </div>

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
                { paginatedCustomers.map(customer =>
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

        {itemsPerPage < filteredCustomers.length && <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            length={filteredCustomers.length} 
            onPageChanged={handleChangePage}
        />}
    </>
}


export default CustomersPage;