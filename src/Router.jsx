import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./PrivateRoute"
import Navbar from "./components/Navbar"
import Chat from "./components/Chat"

const MainRouter = () => {
  return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen text-white flex flex-col items-center bg-black">
                    <Navbar />
                        <Routes>
                            <Route path='/login' element={<Login />} />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/' element={<PrivateRoute/>} >
                                <Route path='/' element={<Home />} />
                                <Route path='/chat' element={<Chat />} />
                            </Route>

                        </Routes>
                </div>
            </AuthProvider>
        </Router>

  )
}

export default MainRouter