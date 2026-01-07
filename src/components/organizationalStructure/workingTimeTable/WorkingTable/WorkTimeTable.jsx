import React from 'react';
import {useTranslation} from "react-i18next";
import {Table} from 'antd';
import {GoPencil} from "react-icons/go";


import 'antd/dist/antd.css';
import "./workTimeTable.css";

import styled from 'styled-components';
import moment from "moment/moment";

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

const WorkTimeTable = (props) => {
    const {
        rowSelection,
        categoryData,
        setInitialValuesCategory,
        setIsOpencategory
    } = props;

    const {t} = useTranslation();


    const editTerminal = (value, record) => {
        setInitialValuesCategory({
            ...value,
            edit: true
        })
        setIsOpencategory(true)
    }


    const columnsUz = [
        {
            title: t('T/r'),
            // dataIndex: 'key',
            dataIndex: 'key',
        },
        {
            title: t('Nomlanishi'),
            dataIndex: 'name',
            render: (text, record) => (
                <span>{record?.name}</span>
            )
        },
        {
            title: t('Boshlanish vaqti'),
            dataIndex: 'from_time',
            render: (text, record) => {
                return `${moment(record.from_time).format('HH:mm')} `
            }
        },
        {
            title: t("Tugash vaqti"),
            dataIndex: 'to_time',
            render: (text, record) => {
                return `${moment(record.to_time).format('HH:mm')} `
            }
        },
        // {
        //     title: t("Kritilgan vaqti"),
        //     dataIndex: 'created_time',
        //     render: (text, record) => (
        //         <div>{record?.created_time}</div>
        //     )
        // },

        {
            title: t('Amallar'),
            dataIndex: '',
            render: (text, record) => (
                <div className="amallar">
                    <div onClick={()=> editTerminal(text, record)} className='amallar_button'>
                        <GoPencil size = {16}/>
                    </div>
                </div>
            ),
            align: 'center'
        },
    ];

    return (
        <TableStyles
            rowSelection={rowSelection}
            columns={columnsUz}
            dataSource={categoryData}
            pagination={false}
        />
    );
}
export default WorkTimeTable;
