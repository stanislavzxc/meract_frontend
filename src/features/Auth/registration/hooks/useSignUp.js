import { useState } from "react";
import api from "../../../../shared/api/api";
import { useAuthStore } from "../../../../shared/stores/authStore";

export function useSignUp() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { login, setLoading, isLoading } = useAuthStore();

  async function signUp(login, email, password, repassword, fullName, avatarFile) {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Конвертируем аватар в base64, если он есть
      let avatarBase64 = null;
      if (avatarFile) {
        avatarBase64 = await toBase64(avatarFile);
      }

      // Отправляем как JSON
      const res = await api.post("/auth/sign-up", {
        login: login,
        email: email,
        password: password,
        repassword: repassword,
        fullName: fullName || '',
      });

      console.log('Sign up response:', res.data);
      setSuccess(true);
      return true;
    } catch (e) {
      console.error('Sign up error:', e.response?.data || e.message);
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
      console.log('Verify response:', res.data);
      setSuccess(true);
      return true;
    } catch (e) {
      console.error('Verify error:', e.response?.data || e.message);
      setError(e?.response?.data?.message || "Verification error");
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
  reader.onload = () => {
    // Убираем префикс "data:image/png;base64," если он есть
    const base64String = reader.result.split(',')[1] || reader.result;
    resolve(base64String);
  };
  reader.onerror = error => reject(error);
});