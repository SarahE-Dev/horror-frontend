import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./PrivateRoute"
import Navbar from "./components/Navbar"
import Chat from "./components/Chat"
import Movies from "./components/Movies"
import Watchlist from "./components/Watchlist"
import { ChatProvider } from "./context/ChatContext"

const MainRouter = () => {
  return (
        <Router>
            <AuthProvider>
                <ChatProvider>
                <div className="min-h-screen overflow-auto text-white flex flex-col items-center bg-black">
                    <Navbar />
                        <Routes>
                            <Route path='/login' element={<Login />} />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/' element={<PrivateRoute/>} >
                                <Route path='/' element={<Home />} />
                                <Route path='/chat' element={<Chat />} />
                                <Route path='/movies' element={<Movies/>}/>
                                <Route path='/watchlist' element={<Watchlist/>} />
                            </Route>

                        </Routes>
                </div>
                </ChatProvider>
            </AuthProvider>
        </Router>

  )
}

export default MainRouter