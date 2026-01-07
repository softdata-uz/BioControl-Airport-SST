import React, {useState} from 'react';
import {DatePicker, Select, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import moment from "moment";
import {MdAdd} from "react-icons/md";
import {IoAddCircle} from "react-icons/io5";
import {IoMdClose} from "react-icons/io";


import './addRelativesTableView.css';


const AddRelativesTableView = ({setEmployeesInitialValue, employeesInitialValue}) => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);


    const [rows, setRows] = useState([])
    const [relativeValue, setRelativeValue] = useState({
        id: Date.now(),
        relation: "",
        date_of_birth: "",
        fullname: ""
    })

    // console.log(employeesInitialValue.relatives)
    const addRow = () => {

        if(
            !relativeValue.relation ||
            !relativeValue.fullname ||
            !relativeValue.date_of_birth
        ) return alert("Ma'lumotlarni to'ldiring!");

        setEmployeesInitialValue((initialValues) => ({
            ...initialValues,
            relatives:  [...initialValues.relatives, relativeValue]}))

        setRelativeValue({
            ...relativeValue,
            id: Date.now(),
            relation: "",
            date_of_birth: "",
            fullname: ""
        })
    };

    // console.log(employeesInitialValue.relatives.date_of_birth)
    const deleteRow = (index) => {
        const updatedRows = [...employeesInitialValue.relatives];
        console.log(updatedRows)
        updatedRows.splice(index, 1);
        // setRows(updatedRows);
        setEmployeesInitialValue.relatives(updatedRows);

    };

    const onChangeRelatives = (e) => {
        setRelativeValue({...relativeValue, relation: e});
    };

    const onChangeDateOfBrth = (date, dateString) => {
        setRelativeValue({...relativeValue, date_of_birth: moment(dateString).format('MM-DD-YYYY')});
    };

    const onChangeFullName=(e)=>{
        setRelativeValue({...relativeValue, fullname: e.target.value})
    }


    return (<div className="add_relatives_table">
        <Form name="basic"
              layout="vertical"
              requiredMark='optional'

              initialValues={relativeValue}
        >
        <table>
            <thead>
            <tr>
                {/*<th className="table_index">Qator</th>*/}
                <th>Qarindoshlik</th>
                <th>F.I.SH</th>
                <th>Tug’ilgan sana</th>
                <th className="table_action"></th>
            </tr>
            </thead>
            <tbody>
            {employeesInitialValue.relatives.map((row, index) => (

                <tr key={row.id}>
                    {/*<td className="relatives_table_add_icon">{index+1}</td>*/}
                    <td>{
                        row.relation==1 ? 'Otasi' :
                        row.relation==2 ? 'Onasi' :
                        row.relation==3 ? 'Akasi':
                        row.relation==4 ? 'Ukasi' :
                        row.relation==5 ? 'Opasi' :
                        row.relation==6 ? 'Singlisi':
                        row.relation==7 ? 'Ayoli':
                        row.relation==8 ? `O'g'li`:
                            row.relation==9 ?'Qizi' : ''
                    }
                    </td>
                    <td>{row.fullname}</td>
                    <td>{row.date_of_birth}</td>
                    <td className="action_delete">
                        <button className='table-delete-button ' onClick={() => deleteRow(index)}>
                            <IoMdClose size={16} color="white"/>
                            O’chirish
                        </button>
                    </td>
                </tr>))}
            <tr>
                <td className="relatives_table_add_icon">
                    <IoAddCircle size={20}/>
                </td>
                <td>
                    <Form.Item
                        label={t("")}
                        name="relation"
                        rules={[{
                            required: true, message: t(' kiriting'),
                        },]}
                    >
                    <Select
                        size="large"
                        style={{width: "100%"}}
                        placeholder={"Kiriting"}
                        onChange={onChangeRelatives}

                        // defaultValue={relatives}
                    >
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="1">{t("Otasi")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="2">{t("Onasi")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="3">{t("Akasi")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="4">{t("Ukasi")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="5">{t("Opasi")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="6">{t("Singlisi")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="7">{t("Ayoli")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="8">{t("O'g'li")}
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="9">{t("Qizi")}
                        </Select.Option>
                    </Select>
                    </Form.Item>
                </td>
                <td>
                    <Form.Item
                        // label={t("Ta’lim muassasasi nomi")}
                        name="fullname"
                        rules={[{
                            required: true, message: t(' kiriting'),
                        },]}
                    >
                    <Input
                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                        style={{width: "100%"}}
                        placeholder={t("Kiritish")}
                        onChange={onChangeFullName}

                    />
                    </Form.Item>
                </td>
                <td>
                    <DatePicker
                        placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                        onChange={onChangeDateOfBrth}
                        size="large"
                        style={{width: "100%", borderRadius: '5px'}}
                        // value={dateOfBirth}
                    />
                </td>

                <td onClick={addRow} className="action_delete">
                    <button type="button" className='table-add-button '>
                        <MdAdd size={18} color="white"/>
                        Qo’shish
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        </Form>
    </div>);
};

export default AddRelativesTableView;