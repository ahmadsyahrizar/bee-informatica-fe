import Login from "@/services/Login"
import { LoginBody } from "@/types/api/login.type"
import { useMutation } from "@tanstack/react-query"

const useLogin = () => {
 return useMutation({
  mutationFn: (param: LoginBody) => Login(param)
 })
}

export default useLogin