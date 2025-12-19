from flask import Flask, jsonify, request  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingImports, reportMissingModuleSource]
import numpy as np  # pyright: ignore[reportMissingImports]
import pandas as pd  # pyright: ignore[reportMissingImports]
import joblib  # pyright: ignore[reportMissingImports]
import os  # pyright: ignore[reportMissingImports]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


model_path = os.path.join(os.path.dirname(__file__), 'final_lasso_attack_score_model.pkl')
model = joblib.load(model_path)

FEATURES = ['Mac', 'Dakika', 'xG', 'Sut/90', 'Isabetli_Sut/90']

@app.route("/")
def home():
    return "Attack Score API is running"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        
        if not data:
            return jsonify({"error": "Request body boş"}), 400

      
        required_fields = ["Mac", "Dakika", "xG", "Sut/90", "Isabetli_Sut/90"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Eksik alanlar: {', '.join(missing_fields)}"}), 400

        input_data = [data["Mac"], data["Dakika"], data["xG"], data["Sut/90"], data["Isabetli_Sut/90"]]

        df = pd.DataFrame([input_data], columns=FEATURES)
        prediction = model.predict(df)[0]
        return jsonify({"attack_score": round(float(prediction), 2)})
   
    except KeyError as e:
        return jsonify({"error": f"Eksik parametre: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Hata: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)