import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/api";

const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const {mutate, isPending, error} = useMutation({
        mutationFn: login,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ["myInfo"] });
            navigate("/");
        } 
    });
    return {loginMutation: mutate, isPending, error}
}

export default useLogin;