import os
import google.generativeai as genai
from flask import Flask, render_template, redirect, url_for, session, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# --- CONFIGURATION ---
app.secret_key = os.environ.get("SECRET_KEY", "dr_mitambo_super_secret_key_2026")
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "mitambo.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# --- GEMINI AI CONFIGURATION ---
genai.configure(api_key="AIzaSyCt3qnEOM3CXBIbtd5aIW_p-qS4iFShh7Q")

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = "login"

# --- MODELS ---
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    machines = db.relationship('Machine', backref='owner', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Machine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    serial = db.Column(db.String(50), unique=True)
    current_hours = db.Column(db.Integer, default=0)
    next_service_hours = db.Column(db.Integer, default=250)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- AUTH ROUTES ---
@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated: return redirect(url_for('index'))
    if request.method == "POST":
        u, p = request.form.get("username"), request.form.get("password")
        if User.query.filter_by(username=u).first():
            flash("User tayari yupo", "danger")
            return redirect(url_for("register"))
        user = User(username=u); user.set_password(p)
        db.session.add(user); db.session.commit()
        return redirect(url_for("login"))
    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated: return redirect(url_for('index'))
    if request.method == "POST":
        user = User.query.filter_by(username=request.form.get("username")).first()
        if user and user.check_password(request.form.get("password")):
            login_user(user)
            return redirect(url_for("index"))
        flash("Login imekataa", "danger")
    return render_template("login.html")

@app.route("/logout")
def logout():
    logout_user(); return redirect(url_for("login"))

# --- AI DIAGNOSIS (HALISI) ---
@app.route("/diagnosis", methods=["GET", "POST"])
@login_required
def diagnosis():
    result = None
    if request.method == "POST":
        user_input = request.form.get("error_code", "").strip()
        try:
            # Tunatengeneza akili ya fundi hapa
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (f"Wewe ni mfumo wa AI unaitwa DR-MITAMBO PRO, mtaalamu wa ufundi wa mitambo mizito (Caterpillar, Komatsu, Sinotruk, n.k). "
                      f"Mteja ana shida hii: '{user_input}'. "
                      f"Toa maelezo ya kitaalamu, vyanzo vya tatizo, na hatua za kurekebisha kwa Kiswahili fasaha na rahisi.")
            
            response = model.generate_content(prompt)
            result = response.text
        except Exception as e:
            result = "Error: AI imeshindwa kujibu. Hakikisha API Key iko sawa na una internet."
            
    return render_template("diagnosis.html", result=result)

# --- ROUTES NYINGINE ---
@app.route("/")
@app.route("/index")
@login_required
def index():
    fleet = Machine.query.filter_by(owner_id=current_user.id).count()
    return render_template("index.html", user=current_user.username, fleet_count=fleet)

@app.route("/electrical")
@login_required
def electrical(): return render_template("placeholder.html", title="Electrical System")

@app.route("/maintenance")
@login_required
def maintenance():
    data = Machine.query.filter_by(owner_id=current_user.id).all()
    return render_template("placeholder.html", title="Maintenance Schedule", machines=data)

# Ongeza hapa route nyingine kama zilivyokuwa awali...

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))

