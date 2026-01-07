import React from 'react';
import {Image, Table} from 'antd';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {AiOutlineUser} from 'react-icons/ai'

import {ip} from "../../../ip";
import 'antd/dist/antd.css';
import "./working.css";


import styled from 'styled-components';

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

const StaffTable = (props) => {


    const lang = localStorage.getItem('i18nextLng');
    // console.log(lang)
    const {
        staffData,
        setIsOpenAddStaff,
        setStaffTableIntialValues,
        value_check
    } = props;

    const {t} = useTranslation()

    const editAddStaff = (value, record) => {
        // console.log(value);

        setStaffTableIntialValues({
            ...value,
            edit: true
        })
        setIsOpenAddStaff(true)
    }

    const columns = [
        {
            title: t('T/r'),
            dataIndex: 'key',
            align: 'center'
        },
        {
            title: t('Ism'),
            dataIndex: 'fullname',
            render: (text, record) => (
                <div className='table_user_cell'>
                    <div className="user_img">
                        <Image
                            className="working_table_user_cell_img"
                            src={`${ip}/access-control-service/${record.image}`}
                            preview={{
                                mask: (
                                    <AiOutlineUser size={20}/>
                                ),
                                maskClassName: 'customize-mask',
                            }}
                        >
                        </Image>

                        <span className={"imgNeActiveIcon"}>

                        </span>
                    </div>

                    <p>{record.fullname}</p>
                </div>
            ),
        },
        {
            title: t('Toifasi'),
            align: "center",
            render: (text, record) => (
                <div className='door_ip_length'>
                    <p>
                        {record.user_type === 1 ? t("Xodim") : (record.user_type === 2 ? t("Mehmon") : t("Begona"))}
                        {/*// user_type: item.user_type === 1 ? t('Xodim') : (item.user_type === 2 ? t('Mehmon') : t('Begona')),*/}

                    </p>
                </div>
            )
            // dataIndex: 'user_type',
            // align: 'center'
        },
        {
            title: t('Lavozimi'),
            render: (text, record) => (
                <div className='door_ip_length'>
                    <p>
                        {record.rank === 1 ? t("Oddiy xodim") : (record.rank === 2 ? t("Direktor") : (record.rank === 3 ? t("VIP") : ""))}
                        {/*rank: item.rank == 1 ? t('Oddiy xodim') : (item.rank == 2 ? t('Direktor') : (item.rank == 3 ? t('VIP') : '')),*/}
                    </p>
                </div>
            )
            // dataIndex: 'rank',
            // align: 'center'
        },
        {
            title: t('Kechikdi'),
            align: "center",
            render: (text, record) => (
                <div className='door_ip_length'>
                    <p>
                        {/*{record.door_ip.length}*/}
                        {/*{record.late_time}*/}
                        {/*{record.late_time.uz}*/}
                        {lang === "uz" ? record.late_time.uz : (lang === "en" ? record.late_time.en : record.late_time.ru)}
                        {/*{console.log(record.late_time.ru)}*/}
                    </p>
                    <div className='door_ip_length_hover'>
                        {/*{record.door_ip.join(' ')}*/}
                        <div className='door_ip_length_hover_rectangel'>

                        </div>
                    </div>
                </div>
            )
        },
        {
            title: t('Barvaqt ketdi'),
            // dataIndex: 'cards',
            align: 'center',
            render: (text, record) => (
                <div className='door_ip_length'>
                    <p>
                        {lang === "uz" ? record.early_go_time.uz : (lang === "en" ? record.early_go_time.en : record.early_go_time.ru)}
                    </p>
                    <div className='door_ip_length_hover'>
                        <div className='door_ip_length_hover_rectangel'>

                        </div>
                    </div>
                </div>
            )
        },
        {
            title: t('Umumiy jarima'),
            align: "center",
            render: (text, record) => (
                <div className='door_ip_length'>
                    <p>
                        {lang === "uz" ? record.all_fine_time.uz : (lang === "en" ? record.all_fine_time.en : record.all_fine_time.ru)}
                    </p>
                    <div className='door_ip_length_hover'>
                        <div className='door_ip_length_hover_rectangel'>

                        </div>
                    </div>
                </div>
            )
        },
        value_check === "all" ? {
            title: t('Kelmagan kunlari'),
            dataIndex: 'valid_from_time',
            align: "center",
            render: (text, record) =>
                (
                    <div className='door_ip_length'>
                        <p>
                            {/*{record.door_ip.length}*/}
                            {record.absence_count}
                        </p>
                        <div className='door_ip_length_hover'>
                            {/*{record.door_ip.join(' ')}*/}
                            <div className='door_ip_length_hover_rectangel'>

                            </div>
                        </div>
                    </div>
                )
        } : {},

    ];


    return (
        <div className="">
            <div className="tableAll">
                <TableStyles
                    columns={columns}
                    dataSource={staffData}
                    pagination={false}
                />
            </div>
        </div>
    );
}
export default StaffTable
