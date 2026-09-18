import { BASE_API_URL} from "../config/api.ts";

export type ResourceZone = 0 | 1 | 2;

export type ResourceType = {
    id: string;
    name: string;
    description: string;
};

export type Resource = {
    id: string;
    name: string;
    resourceType: ResourceType;
    zone: ResourceZone | null;
    capacity: number;
    isActive: boolean;
    createdAt: string;
};

export type CreateResourceRequest = {
    name: string;
    resourceTypeId: string;
    zone: ResourceZone;
    capacity: number;
};

export type UpdateResourceRequest = CreateResourceRequest & {
    isActive: boolean;
};

const RESOURCE_API_URL = `${BASE_API_URL}/api/Resource`;
const RESOURCE_TYPES_API_URL = `${BASE_API_URL}/api/ResourceTypes`;

//Hämta alla resurser
export async function getAllResources(): Promise<Resource[]> {
    const response = await fetch(RESOURCE_API_URL, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Kunde inte hämta resurser");
    }
    return response.json();
}

export async function getAllResourceTypes(): Promise<ResourceType[]> {
    const response = await fetch(RESOURCE_TYPES_API_URL, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Kunde inte hämta resurskategorier");
    }

    return response.json();
}

//Skapa resurs från redan befintliga resurser
export async function createResource(
    resource: CreateResourceRequest
): Promise<Resource> {
    const response = await fetch(RESOURCE_API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
    });

    if (!response.ok) {
        throw new Error("Kunde inte skapa resurs");
    }

    return response.json();
}

//Skapa helt ny resurs
export async function createResourceType(
    name: string,
    description = "",
): Promise<ResourceType> {
    const response = await fetch(RESOURCE_TYPES_API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify({name, description})
    });
    if (!response.ok) {
        throw new Error("Kunde inte skapa resurtyp")
    }
    return response.json()
}

export async function updateResource(
    id: string,
    resource: UpdateResourceRequest
): Promise<void> {
    const response = await fetch(`${RESOURCE_API_URL}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
    });

    if (!response.ok) {
        throw new Error("Kunde inte uppdatera resurs");
    }
}

export async function deleteResource(id: string): Promise<void> {
    const response = await fetch(`${RESOURCE_API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Kunde inte ta bort resurs");
    }
}