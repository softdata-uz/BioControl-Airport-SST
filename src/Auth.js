import React, {useState} from 'react'
import App from './App'
import LoginPageNew from "./components/loginPage/loginNew/LoginPageNew";
import DoorControlGeneralNew from "./components/doorControlGeneralNew/DoorControlGeneralNew";

function Auth() {

    const [user, setUser] = useState(null)
    // if (user?.role) {
    //     return <App setUser={setUser} user = {user} />
    // }

    return (
        <DoorControlGeneralNew/>
        // <LoginPageNew user={user} setUser={setUser}/>
    )
}

export default Auth
