import { useState } from "react";

import api from "../../../../shared/api/api";
import { useAuthStore } from "../../../../shared/stores/authStore";

export function useSignUp() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { login, setLoading, isLoading } = useAuthStore();

  async function signUp(email, password, username, surname, selectedAvatar) {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let avatarData = selectedAvatar;

      if (selectedAvatar instanceof File || selectedAvatar instanceof Blob) {
        avatarData = await toBase64(selectedAvatar);
      } 
      const res = await api.post("/auth/sign-up", {
         login: username,
         fullName: surname,
         email: email, 
         password: password,
         repassword: password,
         avatar: avatarData, 
      });

      setSuccess(true);
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || "Registration error");
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function verify(code) {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await api.get(`/auth/verify-email?code=${code}`);
      setSuccess(true);
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || "Registration error");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { signUp, verify, loading: isLoading, error, success };
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

