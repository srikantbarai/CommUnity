import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";

const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const { mutate, isPending, error } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(["myInfo"], null);
            navigate("/login");
        }
    });
    return { mutate, isPending, error };
};

export default useLogout;
