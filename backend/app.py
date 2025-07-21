from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import requests
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import sqlite3
import hashlib
import jwt
import datetime
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT Secret Key
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here-make-it-secure")

# GitHub API Configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_API_URL = "https://models.inference.ai.azure.com/chat/completions"

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('aibuddy.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            prompts_used INTEGER DEFAULT 0,
            prompts_limit INTEGER DEFAULT 5,
            is_superuser BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Check if super user exists, if not create it
    cursor.execute('SELECT id FROM users WHERE email = ?', ('teamaibuddy@gmail.com',))
    if not cursor.fetchone():
        super_password_hash = hashlib.sha256('teamaibuddy'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, prompts_limit, is_superuser)
            VALUES (?, ?, ?, ?, ?)
        ''', ('Super User', 'teamaibuddy@gmail.com', super_password_hash, 999999, True))
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# JWT token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
            current_user_id = data['user_id']
            
            # Get user from database
            conn = sqlite3.connect('aibuddy.db')
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (current_user_id,))
            user = cursor.fetchone()
            conn.close()
            
            if not user:
                return jsonify({'error': 'User not found!'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid!'}), 401
        
        return f(user, *args, **kwargs)
    return decorated

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "AI Buddy Backend is running!"})

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    # Hash password
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = sqlite3.connect('aibuddy.db')
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists!'}), 400

        # Create new user
        cursor.execute('''
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        ''', (name, email, password_hash))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()

        # Generate JWT token
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, JWT_SECRET_KEY, algorithm='HS256')

        return jsonify({
            "message": "User registered successfully", 
            "token": token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "prompts_used": 0,
                "prompts_limit": 5,
                "is_superuser": False
            }
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    # Hash password to compare
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        conn = sqlite3.connect('aibuddy.db')
        cursor = conn.cursor()
        
        # Check user credentials
        cursor.execute('SELECT * FROM users WHERE email = ? AND password_hash = ?', (email, password_hash))
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT token
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, JWT_SECRET_KEY, algorithm='HS256')

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "prompts_used": user[4],
                "prompts_limit": user[5],
                "is_superuser": bool(user[6])
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/google-auth", methods=["POST"])
def google_auth():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    google_id = data.get("google_id")

    if not all([email, name, google_id]):
        return jsonify({"error": "Google authentication data incomplete"}), 400

    try:
        conn = sqlite3.connect('aibuddy.db')
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        if user:
            # User exists, update login
            user_id = user[0]
        else:
            # Create new user with Google auth
            # Use google_id as password hash for Google users
            password_hash = hashlib.sha256(f"google_{google_id}".encode()).hexdigest()
            cursor.execute('''
                INSERT INTO users (name, email, password_hash)
                VALUES (?, ?, ?)
            ''', (name, email, password_hash))
            user_id = cursor.lastrowid
            conn.commit()

        conn.close()

        # Generate JWT token
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, JWT_SECRET_KEY, algorithm='HS256')

        # Get user data
        conn = sqlite3.connect('aibuddy.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user_data = cursor.fetchone()
        conn.close()

        return jsonify({
            "message": "Google authentication successful",
            "token": token,
            "user": {
                "id": user_data[0],
                "name": user_data[1],
                "email": user_data[2],
                "prompts_used": user_data[4],
                "prompts_limit": user_data[5],
                "is_superuser": bool(user_data[6])
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/profile", methods=["GET"])
@token_required
def get_profile(user):
    return jsonify({
        "user": {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "prompts_used": user[4],
            "prompts_limit": user[5],
            "is_superuser": bool(user[6]),
            "created_at": user[7]
        }
    })

@app.route("/ask", methods=["POST"])
@token_required
def ask(user):
    data = request.get_json()
    prompt = data.get("prompt")
    document_content = data.get("document_content", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Check if user has prompts remaining (unless superuser)
    if not user[6] and user[4] >= user[5]:  # not superuser and used >= limit
        return jsonify({
            "error": "You have reached your prompt limit. Please contact support at LinkedIn: jitesh-kumar05 for more prompts."
        }), 403

    try:
        # Enhanced prompt for document analysis
        if document_content:
            enhanced_prompt = f"""
            You are a helpful AI assistant. A user has uploaded a document and asked a question about it.
            
            Document Content:
            {document_content}
            
            User Question: {prompt}
            
            Please provide a clear, concise response that:
            - Directly answers the user's question
            - Is well-structured but brief (under 300 words)
            - Uses simple formatting (avoid excessive headers or bullet points)
            - Is conversational and easy to understand
            - References specific parts of the document when relevant
            """
        else:
            enhanced_prompt = f"""
            You are a helpful AI assistant. Please provide a clear, concise response to this question:
            
            {prompt}
            
            Keep your response:
            - Direct and helpful
            - Under 200 words unless detailed explanation is needed
            - Conversational and friendly
            - Easy to understand
            """

        headers = {
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4o",
            "messages": [
                {"role": "user", "content": enhanced_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 400,  # Reduced for more concise responses
            "stream": False
        }
        
        response = requests.post(GITHUB_API_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            answer = result["choices"][0]["message"]["content"].strip()
            
            # Update user's prompt count (only if not superuser)
            if not user[6]:  # not superuser
                conn = sqlite3.connect('aibuddy.db')
                cursor = conn.cursor()
                cursor.execute('UPDATE users SET prompts_used = prompts_used + 1 WHERE id = ?', (user[0],))
                conn.commit()
                conn.close()
                
                # Get updated user info
                conn = sqlite3.connect('aibuddy.db')
                cursor = conn.cursor()
                cursor.execute('SELECT prompts_used, prompts_limit FROM users WHERE id = ?', (user[0],))
                updated_user = cursor.fetchone()
                conn.close()
                
                remaining_prompts = updated_user[1] - updated_user[0]
            else:
                remaining_prompts = "Unlimited (Super User)"
            
            return jsonify({
                "response": answer,
                "prompts_remaining": remaining_prompts
            })
        else:
            return jsonify({"error": f"GitHub API error: {response.status_code} - {response.text}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/send-email", methods=["POST"])
@token_required
def send_email(user):
    data = request.get_json()
    to_email = data.get("to")
    question = data.get("prompt")
    answer = data.get("response")

    if not (to_email and question and answer):
        return jsonify({"error": "Missing fields"}), 400

    subject = "Your AI Study Buddy Response"
    body = f"Your Question:\n{question}\n\nAI Response:\n{answer}"

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = os.getenv("SMTP_SENDER")
    msg['To'] = to_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(os.getenv("SMTP_SENDER"), os.getenv("SMTP_PASSWORD"))
            server.send_message(msg)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
