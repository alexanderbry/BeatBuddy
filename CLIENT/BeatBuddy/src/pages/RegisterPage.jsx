import { Button, Label, TextInput, Flowbite } from "flowbite-react";
import { api } from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterPage() {
let [username, setUsername] = useState("");
let [email, setEmail] = useState("");
let [password, setPassword] = useState("");
const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await api.post("/users/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        title: error.response?.data.error,
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });
    }
  };
  return (
    <Flowbite
      theme={{
        theme: {
          button: {
            color: {
              primary: "bg-gray-600 hover:bg-gray-700 text-gray-50",
            },
          },
          textInput: {
            field: {
              input: {
                colors: {
                  gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500",
                },
              },
            },
          },
        },
      }}
    >
      <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Left Side - Form Section */}
        <div className="w-full md:w-1/2 bg-gray-800 bg-opacity-50 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-gray-100 mb-6 text-center">
              Join us
            </h2>
            <form className="space-y-6" onSubmit={(e) => handleRegister(e)}>
              <div>
                <Label
                  htmlFor="username"
                  className="text-gray-300 mb-2 block"
                  value="Username"
                />
                <TextInput
                  id="username"
                  type="username"
                  placeholder="john_doe"
                  color="gray"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-gray-300 mb-2 block"
                  value="Email"
                />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  color="gray"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="text-gray-300 mb-2 block"
                  value="Password"
                />
                <TextInput
                  id="password"
                  type="password"
                  placeholder="********"
                  color="gray"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" color="primary" className="w-full">
                Register
              </Button>

              <h1 className="text-sm text-gray-100 text-center font-bold mb-4">Already have Account ? <span className="text-blue-500 hover:text-red"><a href="/login">Log in instead</a></span></h1>
            </form>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
          <img
            className="object-cover w-full h-full"
            src="https://i.pinimg.com/564x/3b/4f/6c/3b4f6c8e44816090421ffb0419e1c3c3.jpg"
            alt="Background"
          />
        </div>
      </div>
    </Flowbite>
  );
}
