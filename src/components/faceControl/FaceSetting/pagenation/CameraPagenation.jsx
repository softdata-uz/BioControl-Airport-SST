import {Pagination} from 'antd';
import {useTranslation} from "react-i18next";

import styled from "styled-components";
export const PaginationStyles = styled(Pagination)`
  .ant-pagination-item, .ant-pagination-item-link, .ant-select-single:not(.ant-select-customize-input) .ant-select-selector  {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;

const TerminalPagination = (props) => {

    const {
        faceTablePaginationLimit,
        faceTablePaginationCurrent,
        faceTablePaginationOnChange,
        faceTableTotal
    } = props;

    const {t} = useTranslation();

    return <PaginationStyles
        dropdownRender={false}
        defaultPageSize={faceTablePaginationLimit}
        current={faceTablePaginationCurrent}
        onChange={faceTablePaginationOnChange}
        total={faceTableTotal}
        // showSizeChanger={true}
        pageSize={faceTablePaginationLimit}
        pageSizeOptions={[10, 20, 50]}
        locale={{ items_per_page: t('sahifa') }}
    />;
}

export default TerminalPagination