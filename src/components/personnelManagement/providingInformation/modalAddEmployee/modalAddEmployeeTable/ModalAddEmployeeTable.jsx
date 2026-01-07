import React from 'react';
import {useTranslation} from "react-i18next";
import { Table  } from 'antd';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import './modalAddemployeeTable.css';
export const TableStyles = styled(Table)`
  tbody {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  thead tr th {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: ${({ theme }) => theme.trhover};
  }
  
`;

const ModalAddEmployeeTable = (props) => {

    const {
        modalAddEmployeesData,
        setIsOpenModalAddEmployee,
        providingTableInitialVlue,
        setProvidingTableInitialVlue
    } = props;

    const {t} = useTranslation();



    const columnsUz = [
        {
            title: t('ID'),
            // dataIndex: 'key',
            dataIndex: 'id',
        },
        {
            title: t('F.I.SH'),
            dataIndex: 'fullname',
            render: (text, record) => (
                <a className="link_style">{record?.fullname}</a>
            )
        },
        {
            title: t('Lavozimi'),
            dataIndex: 'rank',
            render:(text, record)=>(
                <div>
                    {record?.rank?.full_name}
                </div>
            )
        },
    ];

    return (
            <TableStyles
                onRow={(record, rowIndex) => {

                    return {
                        onClick: event => {
                            setProvidingTableInitialVlue({
                                ...providingTableInitialVlue,
                                user_id: record?.id,
                                fullname: record?.fullname
                            })
                            setIsOpenModalAddEmployee(false)
                            // console.log(record, rowIndex)
                        }, // click row
                    };
                }}
                columns={columnsUz}
                dataSource={modalAddEmployeesData}
                pagination={false}
            />
    );
};

export default ModalAddEmployeeTable;