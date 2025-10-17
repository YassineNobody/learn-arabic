import axios, { type AxiosInstance } from "axios";
import type { SuccessResponse } from "../interfaces/common/common";
import type {
  AuthUser,
  User,
  CreateUser,
  ForgotPassword,
  ResetPassword,
} from "../interfaces/user/user";
import constantUrl from "../constants/constantUrl";

export const ContentType = {
  CATEGORY: "category",
  DOCUMENT: "document",
  PROGRESSIONS: "progressions",
};
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export type QueryParams = {
  page?: string;
  size?: string;
  slug?: string;
  progess?: string;
  complete?: string;
  favorite?: string;
  limit?: string;
};

class Api {
  private request: AxiosInstance;
  private token?: string;
  constructor(baseURL: string) {
    this.request = axios.create({ baseURL });
    this.token = undefined;
    // Request Interceptor
    this.request.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.request.interceptors.response.use(
      (resp) => resp.data,
      (error) => {
        console.log(error);
        return Promise.reject(error.response.data);
      }
    );
  }

  async forgotPassword(data: ForgotPassword) {
    return this.request
      .post<ForgotPassword, SuccessResponse<string>>(
        "/api/auth/forgot-password",
        data
      )
      .catch((error) => {
        throw error;
      });
  }

  async resetPassword(data: ResetPassword) {
    return this.request
      .post<ResetPassword, SuccessResponse<string>>(
        "/api/auth/reset-password",
        data
      )
      .catch((error) => {
        throw error;
      });
  }

  async updateCurrentUser(username: string) {
    return this.request
      .put<{ username: string }, SuccessResponse<User>>("/api/user", {
        username,
      })
      .catch((error) => {
        throw error;
      });
  }

  async currentUser(token: string) {
    this.token = token;
    return this.request
      .get<void, SuccessResponse<AuthUser>>("/api/auth/me")
      .catch((error) => {
        throw error;
      });
  }

  async logout() {
    this.token = undefined;
  }

  async login({
    password,
    username,
    email,
  }: {
    password: string;
    email?: string;
    username?: string;
  }) {
    return this.request
      .post<
        { password: string; email?: string; username?: string },
        SuccessResponse<AuthUser>
      >("/api/auth/login", { username, email, password })
      .catch((error) => {
        throw error;
      });
  }

  async register(data: CreateUser) {
    return this.request
      .post<CreateUser, SuccessResponse<User>>("/api/auth/register", data)
      .catch((error) => {
        throw error;
      });
  }

  async verifyMail(token: string) {
    return this.request
      .get<void, SuccessResponse<AuthUser>>(
        `/api/auth/verify-email?token=${token}`
      )
      .catch((error) => {
        throw error;
      });
  }

  async resendVerification(
    email: string,
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET"
  ) {
    return this.request
      .post<
        { email: string; type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" },
        SuccessResponse<string>
      >("/api/auth/resend-verification", { email, type })
      .catch((error) => {
        throw error;
      });
  }

  async get<R>(
    contentType: ContentType,
    endPoint?: string,
    params?: QueryParams
  ): Promise<SuccessResponse<R>> {
    return this.request
      .get<void, SuccessResponse<R>>(
        `/api/${contentType}${endPoint ? endPoint : ""}`,
        { params }
      )
      .catch((error) => {
        throw error;
      });
  }

  async post<T, R>(
    contentType: ContentType,
    data: T,
    endPoint?: string,
    config?: { headers?: Record<string, string> } // ✅ option supplémentaire
  ): Promise<SuccessResponse<R>> {
    return this.request
      .post<T, SuccessResponse<R>>(
        `/api/${contentType}${endPoint ? endPoint : ""}`,
        data,
        config // ✅ ajouté ici
      )
      .catch((error) => {
        throw error;
      });
  }
  async delete<T>(
    contentType: ContentType,
    slug: string,
    params?: QueryParams
  ): Promise<SuccessResponse<T>> {
    return this.request
      .delete<void, SuccessResponse<T>>(`/api/${contentType}/${slug}`, {
        params,
      })
      .catch((error) => {
        throw error;
      });
  }
  async update<T, R>(
    contentType: ContentType,
    slug: string,
    data: T,
    config?: { headers?: Record<string, string>; params?: QueryParams }
  ): Promise<SuccessResponse<R>> {
    return this.request
      .put<T, SuccessResponse<R>>(`/api/${contentType}/${slug}`, data, config)
      .catch((error) => {
        throw error;
      });
  }

  async updateProgression<R>(
    contentType: ContentType,
    params?: QueryParams
  ): Promise<SuccessResponse<R>> {
    return this.request
      .put<void, SuccessResponse<R>>(`/api/${contentType}`, undefined, {
        params,
      })
      .catch((error) => {
        throw error;
      });
  }

  async deleteProgression<T>(
    contentType: ContentType,
    params?: QueryParams
  ): Promise<SuccessResponse<T>> {
    return this.request
      .delete<void, SuccessResponse<T>>(`/api/${contentType}`, {
        params,
      })
      .catch((error) => {
        throw error;
      });
  }
}

export const api = new Api(constantUrl.API_URL);
