from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

TECH_KEYWORDS = [
    'python', 'java', 'javascript', 'sql', 'react', 'node', 'flask',
    'django', 'spring', 'mongodb', 'mysql', 'postgresql', 'git',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'tensorflow',
    'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'matplotlib',
    'machine learning', 'deep learning', 'nlp', 'data analysis',
    'data science', 'computer vision', 'api', 'rest', 'agile', 'scrum',
    'html', 'css', 'typescript', 'vue', 'angular', 'express', 'fastapi',
    'xgboost', 'lightgbm', 'power bi', 'tableau', 'excel', 'spark',
    'hadoop', 'kafka', 'redis', 'graphql', 'jwt', 'oauth', 'linux',
    'bash', 'r programming', 'scala', 'c++', 'c#', 'php', 'swift'
]

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_keywords(text):
    text_lower = text.lower()
    found = []
    for kw in TECH_KEYWORDS:
        if kw in text_lower:
            found.append(kw)
    return found

def get_match_score(cv_text, jd_text):
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    try:
        tfidf_matrix = vectorizer.fit_transform([cv_text, jd_text])
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return round(float(score) * 100, 1)
    except:
        return 0.0

def generate_suggestions(missing_keywords, score):
    suggestions = []

    if score < 40:
        suggestions.append('Your CV needs significant improvement for this role — consider a major rewrite.')
    elif score < 60:
        suggestions.append('Good foundation but several gaps to address before applying.')
    elif score < 80:
        suggestions.append('Strong match — a few targeted improvements will make your CV stand out.')
    else:
        suggestions.append('Excellent match — your CV aligns very well with this role.')

    if missing_keywords:
        top_missing = missing_keywords[:3]
        suggestions.append(f'Add experience with: {", ".join(top_missing)} to strengthen your application.')

    if 'docker' in missing_keywords or 'kubernetes' in missing_keywords:
        suggestions.append('Consider adding containerization skills (Docker/Kubernetes) — highly valued.')

    if 'aws' in missing_keywords or 'azure' in missing_keywords or 'gcp' in missing_keywords:
        suggestions.append('Cloud platform experience (AWS/Azure/GCP) is increasingly required — worth learning.')

    if len(missing_keywords) > 5:
        suggestions.append('Focus on your strongest matching skills and highlight them prominently.')

    suggestions.append('Quantify your achievements with specific metrics (accuracy %, performance gains).')
    suggestions.append('Tailor your summary section to mirror the language used in this job description.')

    return suggestions[:5]

def analyze_resume(cv_text, jd_text):
    cv_clean = clean_text(cv_text)
    jd_clean = clean_text(jd_text)

    score = get_match_score(cv_clean, jd_clean)

    cv_keywords = extract_keywords(cv_clean)
    jd_keywords = extract_keywords(jd_clean)

    found_keywords = [kw for kw in jd_keywords if kw in cv_keywords]
    missing_keywords = [kw for kw in jd_keywords if kw not in cv_keywords]

    suggestions = generate_suggestions(missing_keywords, score)

    if score >= 75:
        rating = 'Excellent match'
        rating_color = 'green'
    elif score >= 55:
        rating = 'Good match'
        rating_color = 'blue'
    elif score >= 35:
        rating = 'Partial match'
        rating_color = 'amber'
    else:
        rating = 'Low match'
        rating_color = 'red'

    return {
        'score': score,
        'rating': rating,
        'rating_color': rating_color,
        'found_keywords': found_keywords,
        'missing_keywords': missing_keywords,
        'suggestions': suggestions,
        'cv_word_count': len(cv_text.split()),
        'jd_word_count': len(jd_text.split())
    }