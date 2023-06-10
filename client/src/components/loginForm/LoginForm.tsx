import React from "react";
import './loginForm.css';

export function LoginForm({login}: any) {
  return (
    <div>
      <form className="login-form" onSubmit={(e) => { e.preventDefault(); login(e); }}>
        <label>Input your name</label>
        <input type="text" name="name" />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
