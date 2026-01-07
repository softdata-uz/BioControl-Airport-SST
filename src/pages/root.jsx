import {Routes, Route, useNavigate} from 'react-router-dom'
import AccessControlTable from "../components/accessControl/accessControlSearch/AccessControlTable";

import AccessControlSetting from "../components/accessControl/settings/AccessControlSetting";
import WorkingHoursReport from "../components/accessControl/WorkingHoursReport/workingHoursReport";

import FaceControlSearch from "../components/faceControl/faceControlSearch/FaceControlSearch";
import FaceControlSetting from "../components/faceControl/FaceSetting/FaceControlSetting";

import NotFound from "../components/notFound/NotFound";
import OnlineManagement from "../components/accessControl/Online-doors/OnlineManagement";
import AccessDashboard from "../components/accessControl/dashboard/AccessDashboard";
import Information from "../components/personnelManagement/providingInformation/Information";

import HiringAnEmployee from "../components/personnelManagement/hiringAnEmployee/HiringAnEmployee";

import EmployessList from "../components/personnelManagement/employeesList/EmployessList";

import DismissalAnEmployee from "../components/personnelManagement/dismissalAnEmployee/DismissalAnEmployee";

import ChangePositionEmployee from "../components/personnelManagement/changePositionEmployee/ChangePositionEmployee";
import WorkingContract from "../components/personnelManagement/workingContract/WorkingContract";

import EmployeesInfo from "../components/personnelManagement/employeesList/employeeInformation/EmployeesInfo";
import AddEmployees from "../components/personnelManagement/employeesList/addEmployees/AddEmployees";
import WorkingHoliday from "../components/personnelManagement/workingHoliday/WorkingHoliday";
import Enterprise from "../components/organizationalStructure/organizationEnterprise/Enterprise";
import Network from "../components/organizationalStructure/network/Network";
import Category from "../components/organizationalStructure/categoryAndPositions/Category";
import DepartmentNetwork from "../components/organizationalStructure/departmentNetwork/DepartmentNetwork";
import AddJobAcceptance from "../components/personnelManagement/hiringAnEmployee/addJobAcceptance/AddJobAcceptance";
import Report from "../components/accessControl/reportNew/Report";
import WorkTimeSchedule from "../components/organizationalStructure/workingTimeTable/WorkTimeSchedule";
import Admin from "../components/admins/Admin";
import {Navigate} from 'react-router-dom';

const RootPage = () => {

    return (
        <Routes>
            {/*<Route path='*' element={<AccessDashboard/>}/>*/}
            {/*<Route path='*' element={<Navigate to="/access-control-dashboard"/>}/>*/}
            <Route path='*' element={<Navigate to="/access-control-search"/>}/>
            <Route path='/access-control-dashboard' element={<AccessDashboard/>}/>
            <Route path='/access-control-search' element={<AccessControlTable/>}/>
            <Route path='/access-control-online-doors' element={<OnlineManagement/>}/>
            {/*<Route path='/access-control-online-doors' element={<OnlineDoorsNew/>}/>*/}

            <Route path='/access-control-setting' element={<AccessControlSetting/>}/>
            <Route path='/access-control-working-report' element={<WorkingHoursReport/>}/>
            <Route path='/access-control-report' element={<Report/>}/>

            <Route path='/employees_list' element={<EmployessList/>}/>
            <Route path='/employees_info' element={<EmployeesInfo/>}/>
            <Route path='/add_employees' element={<AddEmployees/>}/>

            <Route path='/providing_information' element={<Information/>}/>
            <Route path='/hiring-an-employee' element={<HiringAnEmployee/>}/>

            <Route path='/dismissal-an-employee' element={<DismissalAnEmployee/>}/>
            <Route path='/change-position-employee' element={<ChangePositionEmployee/>}/>
            <Route path='/working-contract' element={<WorkingContract/>}/>
            <Route path='/working-holiday' element={<WorkingHoliday/>}/>

            <Route path='/organization-enterprise' element={<Enterprise/>}/>
            <Route path='/department-network' element={<DepartmentNetwork/>}/>
            <Route path='/category-and-position' element={<Category/>}/>
            <Route path='/working-time-table' element={<WorkTimeSchedule/>}/>
            <Route path='/network' element={<Network/>}/>

            <Route path='/admins' element={<Admin/>}/>

            <Route path='/not_found' element={<NotFound/>}/>
        </Routes>)
}

export default RootPage;
