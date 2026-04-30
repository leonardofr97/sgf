const API_URL = "http://localhost:4000/api";

type ApiPayload = Record<string, unknown>;

export const api = {
  register: async (data: ApiPayload) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (data: ApiPayload) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getTasks: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.json();
  },

  getUsers: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.json();
  },

  createTask: async (data: ApiPayload) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    return res.json();
  },

  updateTask: async (id: number, data: ApiPayload) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    return res.json();
  },

  getNotifications: async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.json();
  },

  markNotificationAsRead: async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.json();
  }
};
