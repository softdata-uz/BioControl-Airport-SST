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

const EmployeeChangePositonPagination = (props) => {

    const {
        employeeChangePositionPaginationLimit,
        employeeChangePositionPaginationCurrent,
        employeeChangePositionPaginationOnChange,
        employeeChangePositionTotal,

    } = props;

    const {t} = useTranslation();

    return <PaginationStyles
        dropdownRender = {false}
        defaultPageSize = {employeeChangePositionPaginationLimit}
        current={employeeChangePositionPaginationCurrent}
        onChange={employeeChangePositionPaginationOnChange}
        total = {employeeChangePositionTotal}
        showSizeChanger={true}
        pageSize={employeeChangePositionPaginationLimit}
        pageSizeOptions={[15, 30, 60]}
        locale={{ items_per_page: t('sahifa') }}
    />;
}

export default EmployeeChangePositonPagination;