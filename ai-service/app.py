from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import io
from analyzer import analyze_resume

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({'message': 'AI Service is running'})

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        job_description = request.form.get('jobDescription', '')
        
        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400

        cv_text = ''
        if 'cv' in request.files:
            file = request.files['cv']
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
            for page in pdf_reader.pages:
                cv_text += page.extract_text() or ''

        if not cv_text:
            return jsonify({'error': 'Could not extract text from CV'}), 400

        result = analyze_resume(cv_text, job_description)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)