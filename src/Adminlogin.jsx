import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        
       
        if (username === "admin" && password === "123") {
            try {
                localStorage.setItem('tb_is_admin', 'true');
                localStorage.setItem('admin_username', username);
                
                navigate("/dashboard");
            } catch (err) {
                console.error("Error saving to localStorage:", err);
               
            }
        } else {
            console.log(alert("Invalid user/pass"));
        }
        
    
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Admin Login
                    </h2>
                    <p className="text-gray-600">
                        Enter your credentials to access the admin dashboard
                    </p>
                </div>

                
                <form onSubmit={handleLogin} className="space-y-6">

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label  className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    



                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" >Login </button>
                </form>

            
            </div>
        </div>
    );
}

export default AdminLogin;