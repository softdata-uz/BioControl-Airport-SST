import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import EmployessTable from "./table/EmployessTable";
import EmployeesInfo from "./employeeInformation/EmployeesInfo";

const EmployessList = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [openAddemployees, setOpenAddemployees] = useState(false)
    const [openAddemployeesView, setOpenAddemployeesView] = useState(false)
    const [openEmployeesInfo, setOpenEmployeesInfo] = useState(false)

    const openTablePage=()=>{
        setOpenAddemployees(true)
    }



    return (
        <div className="information_content">
            <div className='content_header'>
                <div className="content_top_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Xodimlar")}
                    </p>
                </div>
            </div>

            <div className="information_content_inner">
                <EmployessTable
                    openAddemployees={openAddemployees}
                    setOpenAddemployees={setOpenAddemployees}
                    setOpenAddemployeesView={setOpenAddemployeesView}
                    openAddemployeesView={openAddemployeesView}
                    openEmployeesInfo={openEmployeesInfo}
                    setOpenEmployeesInfo={setOpenEmployeesInfo}
                />
            </div>

            {/*<div className="information_inner_content">*/}
            {/*    <EmployeesInfo/>*/}
            {/*</div>*/}

        </div>
    );
};

export default EmployessList;