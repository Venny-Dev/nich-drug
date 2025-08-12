import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/constants";
import Cookies from "js-cookie";
// import { authStorage } from "../utils/authStorage";

interface ApiResponse<T = any> {
  data: T;
  message: string;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  getHeader() {
    const token = Cookies.get("token");
    return token ? `Bearer ${token}` : "";
  }

  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const header = this.getHeader();

    const config: RequestOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(header && { Authorization: header }),
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    if (config.body instanceof FormData) {
      delete config.headers!["Content-Type"];
    } else if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const res = await fetch(url, config);
      if (res.status === 401) {
        Cookies.remove("token");
        // window.location.href = "/auth";
        toast.error("Session expired. Please login again.");
      }
      // console.log(res);

      const data = await res.json();

      if (!res.ok) {
        // Create error with status information
        const error = new Error(
          data.errors[0] || "Something went wrong"
        ) as Error & { status: number };
        error.status = res.status;
        throw error;
      }

      if (data.token) {
        Cookies.set("token", data.token);
      }
      return { data: data.data, message: data.message };
    } catch (err) {
      // console.log(err);
      // return Promise.reject(err);
      if (err instanceof Error && "status" in err) {
        throw err;
      }
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  get<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  patch<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }
  put<T = any>(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }
  delete<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

const api = new ApiClient();
export default api;
