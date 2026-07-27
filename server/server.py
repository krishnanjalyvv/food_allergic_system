from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
import chat
import requests
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- DATABASE SETUP ---
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    # Create a simple table for users
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Run this once when the server starts
init_db()

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    req_json = request.get_json()
    data = req_json.get('image')
    user_profile = req_json.get('userProfile', {})
    
    if data.startswith("data:image"):
        base64_image_data = data.split(',')[1]
    else:
        base64_image_data = data

    response = chat.get_response_image(base64_image_data, user_profile)
    
    # Parse the JSON response from Gemini
    import json
    import re
    
    try:
        # Use regex to find the first JSON object {}
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            result_json = json.loads(json_str)
        else:
            # Fallback if no JSON found (unexpected)
            raise ValueError("No JSON object found in response")
        
        # Combine safety assessment and description for the chat
        full_description = f"{result_json.get('safety_assessment', '')}\n\n{result_json.get('description', '')}"
        
        return jsonify({
            "food": result_json.get('food'),
            "ingredients": result_json.get('ingredients', []),
            "allergens": result_json.get('allergens', []),
            "result": full_description
        })
    except Exception as e:
        print(f"Error parsing AI response: {e}")
        # print(f"Raw Response: {response.text}") # Debug log removed because emojis crash Windows terminals
        return jsonify({"result": response.text})

@app.route('/talk', methods=['POST'])
def talk():
    req_data = request.get_json()
    question = req_data.get('question')
    user_profile = req_data.get('userProfile', {})
    
    response = chat.get_response_text(question, user_profile)
    # print(response.text) # Removed because emojis crash Windows terminals!
    return jsonify({"result": response.text})

@app.route('/profile', methods=['POST'])
def profile():
    data = request.get_json()['data']
    print(data)
    response = chat.get_response_text("These are the preferences and allergens that i am aware of: " + str(data) + ". Keeping this in mind answer my questions")
    # print(response.text) # Removed because emojis crash Windows terminals!
    return jsonify("")

@app.route('/login', methods=['POST'])
def login():
    req_data = request.get_json()
    email = req_data.get('email')
    password = req_data.get('password')
    
    # Connect to database and check user
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login successful", "token": "real_user_token_123"}), 200
    else:
        return jsonify({"message": "Incorrect email or password."}), 401

@app.route('/upload_medical_report', methods=['POST'])
def upload_medical_report():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    if file and file.filename.lower().endswith('.pdf'):
        import tempfile
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, secure_filename(file.filename))
        file.save(temp_path)
        
        try:
            # Use the unused pdf_to_text function from chat.py!
            extracted_text = chat.pdf_to_text(temp_path)
            os.remove(temp_path)
            return jsonify({"text": extracted_text}), 200
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

@app.route('/register', methods=['POST'])
def register():
    req_data = request.get_json()
    email = req_data.get('email')
    password = req_data.get('password')

    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()
        conn.close()
        return jsonify({"message": "Account created successfully"}), 201
    except sqlite3.IntegrityError:
        # IntegrityError happens when the email already exists in the table (UNIQUE constraint)
        return jsonify({"message": "That email is already registered."}), 400

if __name__ == '__main__':
    app.run(debug=True)