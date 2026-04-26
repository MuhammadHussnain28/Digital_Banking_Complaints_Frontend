import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children , allowedRoles}) {

    const {isAuthenticated , reduxUser} = useSelector((state)=> state.auth)
    console.log("isAuthenticated from Protected Comp: " , isAuthenticated)
    console.log("reduxUser from Protected Comp: " , reduxUser)

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>      
    }
    else if(!allowedRoles.includes(reduxUser.role)){
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default ProtectedRoute