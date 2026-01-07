import React from 'react';
import { Table, Image  } from 'antd';
import { useSelector } from "react-redux";
import { AiOutlineUser } from 'react-icons/ai';
import {useTranslation} from "react-i18next";
import {ip} from '../../../ip';

import './acsessControl.css';
import 'antd/dist/antd.css';


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
`;

const AcsessTable = (props) => {

    const { accessTableData } = props;
    const {t} = useTranslation();

    const isDarkMode = useSelector(state => state.theme.theme_data)

    const columns = [
        {
            title: t('T/r'),
            dataIndex: 'key',
            // align: 'center'
        },
        {
            title: t('Ism'),
            dataIndex: 'fullname',
            render: (text, record) => (
                <div className='table_user_cell'>
                    <Image
                        className="table_user_cell_img"
                        src= {record?.image ? `${ip}/access-control-service/${record.image}`
                            :
                            `${ip}/access-control-service/default.jpg`
                        }
                        preview = {{
                            src: `${ip}/access-control-service/api/get_history/${record.id}/image`,
                            mask: (
                                <AiOutlineUser size={20} />
                            ),
                            maskClassName: 'customize-mask',
                        }}
                    />
                    <p>{record.fullname}</p>
                </div>
            ),
        },

        {
            title: t('Toifasi'),
            dataIndex: 'user_type',
            // align: 'center',
            render:(text, record)=>(
                <div>
                    {record?.user_type == 1 ? t("Xodim") :  t("Begona")}
                </div>
            )
        },
        {
            title: t("Bo'lim"),
            dataIndex: 'department',
            // align: 'center',
            render:(text, record)=>(
                <div>
                    {
                        record.department || '-'
                    }
                </div>
            )
        },
        {
            title: t('Lavozimi'),
            dataIndex: 'rank',
            // align: 'center',
            render:(text, record)=>(
                <div>
                    {
                        record.rank || '-'
                    }

                </div>
            )
        },

        {
            title: t('Tasdiq turi'),
            dataIndex: 'auth_type',
            // align: 'center',
            render:(text, record) =>(
                <div>
                    {record?.auth_type === 1 ? t("Yuz") :
                        record.auth_type === 2 ? t("Barmoq izi") :
                            record.auth_type === 3 ? t("ID karta") :
                                record.auth_type === 4 ? t("Yuz va Barmoq izi") :
                                    record.auth_type === 6 ? t("Yuz va ID karta") :
                                        record.auth_type === 8 ? t("Barmoq izi va ID karta") : ''
                    }
                </div>
            )
        },
        {
            title: t('Eshik'),
            dataIndex: 'door_name',
            // align: 'center'
        },
        {
            title: t("Yo'nalishi"),
            dataIndex: 'direction',
            // align: 'center',
            render: (text, record) => (
                <div>
                    {/*{console.log(record)}*/}
                    {record?.direction == 'Exit' ? t("Chiqdi") : t("Kirdi")}
                </div>
            )
        },
        {
            title: t('Vaqt'),
            dataIndex: 'created_time',
            // align: 'center'
        },
    ];



        return (
            <TableStyles
               className={` ${isDarkMode && 'darkModeBackground'}`}
                rowSelection={false}
                columns={columns}
                dataSource={accessTableData}
                pagination={false}
            />
        );
}
export default AcsessTable
