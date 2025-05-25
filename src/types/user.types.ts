export interface Members {
    "id": string,
    "name": string,
    "email": string,
    "shortName": string,
    "registeredAt": string,
    "projectMemberships": ProjectMemberships[]
}

export interface ProjectMemberships {
    "role": string,
    "project": Project[]
}

export interface Project {
    "id": string,
    "name": string,
    "description": string
}

export interface MemberListResponse {
    "success": boolean,
    "message": string,
    "data": Members[]
}