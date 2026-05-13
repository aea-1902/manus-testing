import React, { Component } from "react"
import { useEffect } from "react"
// Table from react-bootstrap
import { Table } from "react-bootstrap"
export default function Sample() {
    useEffect(() => {
        require("bootstrap/js/src/collapse.js")
    //  require("bootstrap/dist/css/bootstrap.min.css");
    },[])
    function onClickHandler(e) {
        const hiddenElement = e.currentTarget.nextSibling;
        hiddenElement.className.indexOf("collapse show") > -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show");
    };
  return (
    <>
    <Table>
    <thead>
    <tr>
        <th>#</th>
        <th>Date</th>
        <th>Description</th>
        <th>Credit</th>
        <th>Debit</th>
        <th>Balance</th>
    </tr>
    </thead>
    <tbody>
    <tr onClick={(e) => onClickHandler(e)}>
        <td>1</td>
        <td>05 May 2013</td>
        <td>Credit Account</td>
        <td className="text-success">$150.00</td>
        <td className="text-error" />
        <td className="text-success">$150.00</td>
    </tr>
    <tr className="collapse">
    <td>1</td>
        <td>05 May 2013</td>
        <td>Credit Account</td>
        <td className="text-success">$150.00</td>
        <td className="text-error" />
        <td className="text-success">$150.00</td>
    </tr>
    </tbody>
</Table>
            </>
  )
}
