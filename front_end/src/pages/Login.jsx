import "./Login.css";

export default function Login() {
    return (
        <main className="login-main">
            <div>
                <h1>swiftree</h1>
                <h2>Login</h2>
                <form className="login-form">
                    <div className="form-item">
                        <p>Username</p>
                        <input
                            type="text"
                            name="username"
                            required
                        />
                    </div>

                    <div className="form-item">
                        <p>Password</p>
                        <input
                            type="password"
                            name="password"
                            required
                        />
                    </div>

                    <button>Login</button>
                </form>

                <p>
                    Don't have an account? <a href="/sign-up">Sign Up</a>
                </p>
            </div>
        </main>
    );
}