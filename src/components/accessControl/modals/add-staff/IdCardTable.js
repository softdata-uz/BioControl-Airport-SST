import React from 'react';
import {useTranslation} from "react-i18next";
import { Table } from 'antd';

import './staffMiddle.css';


import styled from 'styled-components';
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
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: ${({ theme }) => theme.trhover};
  }
`;

const IdCardTable = ({card, setSelectedItems }) => {

    const {t} = useTranslation()
    const [state, setState] = React.useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setState({ selectedRowKeys })
        setSelectedItems(a)
    };

    const { selectedRowKeys } = state;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const columns = [
        {
            title: t('T/r'),
            dataIndex: 'key',
            width: 60,
            align: 'center'
        },
        {
            title: t('Turi'),
            dataIndex: 'type',
            align: 'center'
        },
        {
            title: t('Karta raqami'),
            dataIndex: 'id',
            align: 'center'
        },
    ];

    return (
        <TableStyles
          columns={columns}
          rowSelection={rowSelection}
          dataSource={card}
          pagination={false}
          style={{minHeight: '170px'}}
          scroll={{ y: 129 }}
        />
    )
}

export default IdCardTable