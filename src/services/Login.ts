import { fetcher } from "@/lib/utils/fetcher"
import { API_DOMAIN } from "@/constants";
import { LoginBody } from "@/types/api/login.type";

const API_LOGIN = `${API_DOMAIN}/auth/signin`;

interface LoginResult {
 data: { token: string }
}

const Login = async (values: LoginBody) => {
 return await fetcher<LoginResult>(API_LOGIN, {
  method: "POST",
  body: {
   ...values
  }
 })
}

export default Login