import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELED: "danger" 
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELED: "Annulée"
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const itemsPerPage = 12
 
    // Get invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.getAll()
            setInvoices(data)
        } catch(error) {
            console.log(error)
        }
    }

    // Fetch invoices on load
    useEffect(() => {
        fetchInvoices()
    }, [])

    // Pagination
    const handleChangePage = (page) => setCurrentPage(page)

    // Handle user research
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }

    // Invoice deletion
    const handleDelete = async id => {
        const originalInvoices= [...invoices]
        setInvoices(invoices.filter(invoice => invoice.id !== id))
        try {
            await InvoicesAPI.delete(id)
        } catch(error) {
            setInvoices(originalInvoices)
            console.log(error.response) 
        }
    }

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase(  ))
    )

    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage
    )

    return ( 
        <>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input 
                    type="text" 
                    onChange={handleSearch} 
                    value={search} 
                    className="form-control" 
                    placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover table-dark">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Montant</th>
                        <th className="text-center">Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { paginatedInvoices.map(invoice => 
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>{invoice.customer.firstName} {invoice.customer.lastName}</td>
                        <td className="text-center">{formatDate(invoice.sendAt)}</td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td className="text-center">
                            <span className={"badge px-1 py-1 badge-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </td>
                        <td>
                            <button className="btn btn-sm btn-primary mr-3">Editer</button>
                            <button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>    
                    )}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChanged={handleChangePage}
                length={filteredInvoices.length}
            />
        </> 
    )
}

export default InvoicesPage