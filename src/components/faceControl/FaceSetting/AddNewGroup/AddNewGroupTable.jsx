import React, {useState} from "react";
import {Table} from "antd";
import ReactDragListView from "react-drag-listview";
import {useTranslation} from "react-i18next";
import {RiEditLine} from "react-icons/ri";


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


const AddNewGroupTable = (props) => {

    const {
        languageGroup,
        setLanguageGroup,
        setDeleteGroup,
        setGroupInitialValues,
        setShow,
    } = props;



    const {t} = useTranslation()
    const lang = localStorage.getItem('i18nextLng');

    languageGroup.forEach(e => {
        e.name = e[`name_${lang}`];
    })

    const [state, setState] = useState({selectedRowKeys: []})

    const onSelectChange = (selectedRowKeys, a) => {
        setState({selectedRowKeys})
        setDeleteGroup(a.map(item => item.id));
    };

    const {selectedRowKeys} = state;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }
    const editGroup = (value, record) => {
        setGroupInitialValues({
            ...value,
            edit: true
        })
        setShow(true)
    }

    const columns = [
        {
            title: t('Guruh'),
            dataIndex: [`name_${lang}`],
            align: 'start',
        },
        {
            // title: t('Amal'),
            dataIndex: '',
            render: (text, record) => (
                <div onClick={() => editGroup(text, record)} className='edit_button'>
                    <RiEditLine size={22}/>
                </div>
            ),
            align: 'center'
        },
    ];

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            // console.log({fromIndex,  toIndex})
            // console.log(`dragged from ${fromIndex} to ${toIndex}`);
            const newData = [...languageGroup];
            const item = newData.splice(fromIndex, 1)[0];
            newData.splice(toIndex, 0, item);
            setLanguageGroup(newData);
        },
        nodeSelector: "tr"
    };

    return (
        <div style={{margin: 20}}>
            <ReactDragListView.DragColumn {...dragProps}>
                <TableStyles
                    columns={columns}
                    pagination={false}
                    dataSource={languageGroup}
                    rowSelection={rowSelection}
                    // bordered
                />
            </ReactDragListView.DragColumn>
        </div>
    );
}


// import React, {useState} from 'react';
// import { Table  } from 'antd';
// import { useSelector } from "react-redux";
// import {RiEditLine} from "react-icons/ri";
// import {useTranslation} from "react-i18next";
// import 'antd/dist/antd.css';
//
// import styled from 'styled-components';
// export const TableStyles = styled(Table)`
//   tbody {
//     background: ${({ theme }) => theme.body};
//     color: ${({ theme }) => theme.text};
//     transition: background 0.2s ease-in, color 0.2s ease-in;
//   }
//   thead tr th {
//     background: ${({ theme }) => theme.body};
//     color: ${({ theme }) => theme.text};
//     transition: background 0.2s ease-in, color 0.2s ease-in;
//   }
//   .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover {
//     background: ${({ theme }) => theme.trhover};
//   }
// `;
//
// const ReactDragListView = window["react-drag-listview"];
//
// const AddNewGroupTable = (props) => {
//     const {
//         languageGroup,
//         setLanguageGroup,
//         setDeleteGroup,
//         setGroupInitialValues,
//         setShow,
//     } = props;
//
//     const {t} = useTranslation()
//     const lang = localStorage.getItem('i18nextLng');
//
//     languageGroup.forEach(e => {
//         e.name = e[`name_${lang}`];
//     })
//
//     const [state, setState] = useState({selectedRowKeys: []})
//
//     const onSelectChange = (selectedRowKeys, a) => {
//         setState({ selectedRowKeys })
//         setDeleteGroup(a.map(item => item.id));
//     };
//
//     const { selectedRowKeys } = state;
//
//     const rowSelection = {
//         selectedRowKeys,
//         onChange: onSelectChange,
//     }
//
//     const editGroup = (value, record) => {
//         setGroupInitialValues({
//             ...value,
//             edit: true
//         })
//         setShow(true)
//     }
//
//
//     const columns = [
//         {
//             title: t('Guruh'),
//             dataIndex: [`name_${lang}`],
//             align: 'start',
//         },
//
//         {
//             // title: t('Amal'),
//             dataIndex: '',
//             render: (text, record) => (
//                 <div onClick={() => editGroup(text, record)} className='edit_button'>
//                     <RiEditLine size = {22} />
//                 </div>
//             ),
//             align: 'center'
//         },
//     ];
//
//
//     const dragProps = {
//         onDragEnd(fromIndex, toIndex) {
//             const newData = [...languageGroup];
//             const item = newData.splice(fromIndex, 1)[0];
//             newData.splice(toIndex, 0, item);
//             setLanguageGroup(newData);
//         },
//         nodeSelector: "tr"
//     };
//
//     return (
//
//         <ReactDragListView {...dragProps}>
//             <TableStyles
//                 rowSelection={rowSelection}
//                 columns={columns}
//                 dataSource={languageGroup}
//                 pagination={false}
//             />
//          </ReactDragListView>
//
//     );
// }
//
//
export default AddNewGroupTable;
