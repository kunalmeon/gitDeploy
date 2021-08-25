import axios from "axios";

import { showAlert } from "./alert";
export const login = async (email, password) => {
  try {
    const response = await axios({
      method: "POST",
      /*If we host 127.0.0.1 does not make sense. So the solution is we can omit that part */
      // url: "http://127.0.0.1:4000/user/signin",
      url: "/user/signin",
      data: {
        email,
        password,
      },
    });
    if (response.data.status === "success") {
      showAlert("success", "Logged in Successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await axios({
      method: "GET",
      //hosting changing url
      // url:"http://127.0.0.1:4000/user/logout"
      url: "/user/logout",
    });

    if (response.data.status === "success") {
      location.reload(true);
    }
  } catch (error) {
    showAlert("error", "Error in logging out! Try again later");
  }
};
