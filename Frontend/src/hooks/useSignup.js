import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signup } from "../lib/api";

const useSignup = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {mutate, isPending, error} = useMutation({
        mutationFn: signup,
        onSuccess: () => navigate("/login")
    });
    return {signupMutation: mutate, isPending, error}
}

export default useSignup;