import { apiClient } from "@/lib/api/config";
import { MemberListResponse } from "@/types/user.types";

class UserRepo {
    constructor() {}

    async getAllMembers ({
        onSuccess,
        onError
    } : {
        onSuccess: (data: MemberListResponse) => void;
        onError: (message: string) => void
    }) {
        try {
            const { data } = await apiClient.get<MemberListResponse>("/user/get-all-members");
            onSuccess(data);
            return data;
        } catch (error) {
            const errorMessage = (error as ErrorEvent).message || "Members list retrieval failed";
            onError(errorMessage);
        }
    }
}

export const UserRepository = new UserRepo();