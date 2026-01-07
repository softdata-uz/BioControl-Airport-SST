import React from 'react';
import {useTranslation} from "react-i18next";
import {Table} from 'antd';
import {RiDeleteBin6Line,} from 'react-icons/ri'
import {Link,} from 'react-router-dom'


import word from '../../../../images/metroBiocontrol/word.svg';
import 'antd/dist/antd.css';
import "../../providingInformation/providing/provideingTable.css";

import styled from 'styled-components';
import {ip} from "../../../../ip";

export const TableStyles = styled(Table)`
  tbody {
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }

  thead tr th {
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }

  .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: ${({theme}) => theme.trhover};
  }

`;

const EmployeeChangePositionTable = (props) => {
    const {
        rowSelection,
        positionData,
        handleDelitePosition
    } = props;

    const {t} = useTranslation();


    const editStaff = (value, record) => {
        console.log(value)
        // setEmployeesInitialValue({
        //     ...value,
        //     edit: true
        // })
        // setOpenAddemployeesView(true)
    }

    const columnsUz = [
        {
            title: t('T/r'),
            dataIndex: 'key',
        },
        {
            title: t('F.I.SH'), dataIndex: 'fullname', render: (text, record) =>
                <span className="table_link_style">
            {text}
        </span>

        },
        {
            title: t("Oldingi lavozim"),
            dataIndex: 'position',
        },
        {
            title: t("Yangi lavozim"),
            dataIndex: 'position',
        },

        {
            title: t("O'tkazilgan sana"),
            dataIndex: 'change_rank_date',
        },
        {
            title: t('Buyruq raqami'),
            dataIndex: 'order_number',
        },
        {
            title: t('Fayllar'),
            dataIndex: 'fayl',
            render:(text, record )=>(
                <Link to={`${ip}/access-control-service/api/file/change_rank/${record.filename}`} className="table_file_download">
                    <img src={word} alt=""/>
                    {t("Yuklash")}
                </Link>
            )

        },
        {
            title: t('Amallar'), dataIndex: '', render: (text, record) => (<div className="amallar">
                <div onClick={() => handleDelitePosition()} className='amallar_button_delete'>
                    <RiDeleteBin6Line size={16}/>
                </div>
            </div>), align: 'center'
        },
    ];


    return (<TableStyles
        rowSelection={rowSelection}
        columns={columnsUz}
        dataSource={positionData}
        pagination={false}
    />);
}
export default EmployeeChangePositionTable;
