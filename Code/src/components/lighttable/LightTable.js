import React from "react";
import TableRow from "./TableRow";
import TableHeadItem from "./TableHead";

import './LightTable.css';

const LightTable = ({ theadData, tbodyData, customClass }) => {
    return (
        <table className='light-table'>
            <thead>
                <tr>
                    {theadData.map((h) => {
                        return <TableHeadItem key={h} item={h} />;
                    })}
                </tr>
            </thead>
            <tbody>
                {tbodyData.map((item) => {
                    return <TableRow key={item.id} data={item.items} />;
                })}
            </tbody>
        </table>
    );
};

export default LightTable;