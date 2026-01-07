import React from 'react';
import {Table, Image} from 'antd';
import {useSelector} from "react-redux";
import {AiOutlineUser} from 'react-icons/ai'
import {ip} from '../../../../ip';
import {useTranslation} from "react-i18next";
import {RiEditLine} from "react-icons/ri";
import moment from 'moment';

import styled from 'styled-components';
import {storage} from "../../../../services";
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
const StaffTable = (props) => {
    const {
        staffData,
        rowSelection,
        setIsOpenAddStaff,
        setStaffTableIntialValues,
        setCard,
        setFingerPrint,
        setEditTitle,
    } = props;

    const user = storage.local.get("user");


    const {t} = useTranslation();

    const editAddStaff = (value, record) => {
        setEditTitle(true)
        setCard(value.cards)
        setFingerPrint(value.fingerprint)
        const newDoorIP = value.door_ip.map(item => ({
            label: item.door_name,
            value: item.ip_address,
            key: item.ip_address,
        }));
        setStaffTableIntialValues({
            ...value,
            door_ip: [...newDoorIP],
            rank: [value.rank.full_name , value.rank.id],
            department: [value.department.full_name , value.department.id],
            edit: true,
        })
        setIsOpenAddStaff(true);

    }

    const columns = [
        {
            title: t('T/r'),
            dataIndex: 'key',
        },
        {
            title: t('Ism'),
            dataIndex: 'fullname',
            render: (text, record) => (
                <div className='table_user_cell'>
                    <Image
                        className="table_user_cell_img"
                        src={`${ip}/access-control-service/${record.image}`}
                        preview={{
                            mask: (
                                <AiOutlineUser size={20}/>
                            ),
                            maskClassName: 'customize-mask',
                        }}
                    />
                    <p>{record.fullname}</p>
                </div>
            ),
        },
        {
            title: t("Bo'lim"),
            dataIndex: 'user_type',
            render:(text, record)=>(
                <div>
                    {record?.department?.short_name }
                </div>
            )
        },
        {
            title: t('Lavozimi'),
            dataIndex: 'rank',
            // align: 'center',
            render:(text, record)=>(
                <div>
                    {record?.rank?.short_name}
                </div>
            )
        },
        {
            title: t('Kirish eshiklari'),
            render: (text, record) => (
                <div className='door_ip_length'>
                    <p>
                        {record.door_ip.length}
                    </p>

                    <div className='door_ip_length_hover'>
                        {record.door_ip.map(door => door.door_name).join(', ')}
                        <div className='door_ip_length_hover_rectangel'>

                        </div>
                    </div>
                </div>
            )
        },
        {
            title: t('ID karta'),
            // dataIndex: 'cards',
            // align: 'center',
            render: (text, record) => (
                <div className='door_ip_length'>
                    {
                        record.cards.length > 0 ?
                            <>
                                <p>
                                    {record.cards.length}
                                </p>
                                <div className='door_ip_length_hover'>
                                    {record.cards.map(e => e.id).join(`, `)}
                                    <div className='door_ip_length_hover_rectangel'></div>
                                </div>
                            </> : '—'
                    }
                </div>
            )
        },
        {
            title: t('Barmoq izi'),
            // dataIndex: 'card_id',
            // align: 'center',
            render: (text, record) => (
                <div >
                    {record.fingerprint.length > 0 ?
                        <>
                            <p>
                                {record.fingerprint.length}
                            </p>
                        </>
                        : "—"
                    }
                </div>
            )
        },
        {
            title: t('Ruxsat etilgan muddat'),
            dataIndex: 'valid_from_time',
            render: (text, record) => {
                return `${moment(record.valid_from_time).format('DD.MM.YYYY')} - ${moment(record.valid_to_time).format('DD.MM.YYYY')}`
            },
        },
        {
            title: t('Tahrir'),
            dataIndex: '',
            render: (text, record) => {
                if (user?.role === "operator") return null;

                return (
                    <div onClick={() => editAddStaff(text, record)} className="edit_button">
                        <RiEditLine size={22} />
                    </div>
                );
            },
            align: 'center'
        }
    ];

    return (
        <TableStyles
            rowSelection={rowSelection}
            columns={columns}
            dataSource={staffData}
            pagination={false}
        />
    );
}
export default StaffTable
