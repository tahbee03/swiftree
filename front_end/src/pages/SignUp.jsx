import "./SignUp.css";

export default function SignUp() {
    return (
        <main className="sign-up-main">
            <div>
                <h1>swiftree</h1>
                <h2>Sign Up</h2>
                <form className="sign-up-form">
                    <div className="form-item">
                        <p>Email</p>
                        <input type="email" name="email" required />
                    </div>

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

                    <button>Sign Up</button>
                </form>

                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </main>
    );
}