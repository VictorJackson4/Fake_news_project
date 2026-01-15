
import { FileContent } from './types';

export const PROJECT_FILES: FileContent[] = [
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    language: 'plaintext',
    description: 'The dependencies needed to run the Python project.',
    content: `pandas>=1.3.0
numpy>=1.21.0
scikit-learn>=1.0.0
shap>=0.40.0
streamlit>=1.10.0
joblib>=1.1.0
matplotlib>=3.4.0`
  },
  {
    path: 'train.py',
    name: 'train.py',
    language: 'python',
    description: 'Script to load data, clean text, and train the Logistic Regression model.',
    content: `import pandas as pd
import numpy as np
import re
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

def clean_text(text):
    """Simple text cleaning: remove punctuation and lowercase."""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\\s]', '', text)
    return text

def train_model():
    print("Step 1: Loading Data...")
    # Load dataset (make sure data/news.csv exists)
    try:
        df = pd.read_csv('data/news.csv')
    except FileNotFoundError:
        print("Error: news.csv not found in data/ directory.")
        return

    # Clean text data
    print("Step 2: Cleaning Text...")
    df['content'] = df['text'].apply(clean_text)
    
    # Define features and labels (Assuming binary 'label' column)
    X = df['content']
    y = df['label'] # Expected: 'REAL' or 'FAKE'

    # Split dataset (80% training, 20% testing)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Vectorize using TF-IDF
    print("Step 3: Vectorizing with TF-IDF...")
    tfidf = TfidfVectorizer(stop_words='english', max_df=0.7)
    X_train_tfidf = tfidf.fit_transform(X_train)
    X_test_tfidf = tfidf.transform(X_test)

    # Train Logistic Regression
    print("Step 4: Training Logistic Regression Model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    # Evaluation
    y_pred = model.predict(X_test_tfidf)
    print("\\n--- Evaluation Metrics ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))

    # Save model and vectorizer
    print("Step 5: Saving Model to 'model/' directory...")
    joblib.dump(model, 'model/fake_news_model.pkl')
    joblib.dump(tfidf, 'model/tfidf_vectorizer.pkl')
    print("All done!")

if __name__ == "__main__":
    train_model()`
  },
  {
    path: 'explain.py',
    name: 'explain.py',
    language: 'python',
    description: 'Uses SHAP to explain how the model reaches a decision.',
    content: `import joblib
import shap
import pandas as pd

def get_explanation(text):
    """Generates SHAP values for a single string of text."""
    # Load model and vectorizer
    model = joblib.load('model/fake_news_model.pkl')
    tfidf = joblib.load('model/tfidf_vectorizer.pkl')

    # Prepare input
    text_vec = tfidf.transform([text])
    
    # Create SHAP Explainer
    # For Logistic Regression, we can use LinearExplainer or KernelExplainer
    # We use a summary of the training data as background if needed
    explainer = shap.Explainer(model, tfidf.transform([""])) 
    
    # Calculate SHAP values
    shap_values = explainer(text_vec)

    # Match SHAP values with word features
    feature_names = tfidf.get_feature_names_out()
    
    # Get values for the first (and only) prediction
    word_impacts = []
    for i in text_vec.indices:
        word = feature_names[i]
        impact = shap_values.values[0, i]
        word_impacts.append((word, impact))

    # Sort by absolute impact
    word_impacts.sort(key=lambda x: abs(x[1]), reverse=True)
    return word_impacts

if __name__ == "__main__":
    sample = "The government announced a secret plan to replace all birds with drones."
    print("Explaining: ", sample)
    impacts = get_explanation(sample)
    for word, impact in impacts[:5]:
        print(f"Word: {word:10} | SHAP Value: {impact:.4f}")`
  },
  {
    path: 'app.py',
    name: 'app.py',
    language: 'python',
    description: 'Streamlit application for user interaction.',
    content: `import streamlit as st
import joblib
import re
import pandas as pd
import matplotlib.pyplot as plt
from explain import get_explanation

# Page config
st.set_page_config(page_title="Fake News Detector", layout="wide")

# Load models cache
@st.cache_resource
def load_assets():
    model = joblib.load('model/fake_news_model.pkl')
    tfidf = joblib.load('model/tfidf_vectorizer.pkl')
    return model, tfidf

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\\s]', '', text)
    return text

def main():
    st.title("📰 Fake News Detection System")
    st.markdown("### Classify news and understand the 'why' using Explainable AI")
    
    try:
        model, tfidf = load_assets()
    except Exception as e:
        st.error("Error loading model. Did you run train.py first?")
        return

    # User Input
    user_input = st.text_area("Enter News Article Text:", height=200, placeholder="Paste your article here...")

    if st.button("Analyze Article"):
        if user_input.strip() == "":
            st.warning("Please enter some text.")
        else:
            # Preprocess
            cleaned = clean_text(user_input)
            vec = tfidf.transform([cleaned])
            
            # Prediction
            prediction = model.predict(vec)[0]
            prob = model.predict_proba(vec)
            
            # Display Results
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("Prediction")
                if prediction == 'FAKE':
                    st.error(f"Prediction: {prediction}")
                else:
                    st.success(f"Prediction: {prediction}")
                
                confidence = prob[0][0] if prediction == 'FAKE' else prob[0][1]
                st.metric("Confidence Score", f"{confidence*100:.2f}%")

            with col2:
                st.subheader("Explanation (SHAP)")
                impacts = get_explanation(cleaned)
                
                # Show top 10 influential words
                df_impacts = pd.DataFrame(impacts[:10], columns=['Word', 'Impact'])
                
                fig, ax = plt.subplots()
                colors = ['red' if x < 0 else 'green' for x in df_impacts['Impact']]
                df_impacts.plot.barh(x='Word', y='Impact', ax=ax, color=colors)
                st.pyplot(fig)

            st.write("---")
            st.info("The bar chart shows how much each word contributed to the final decision. Red usually pushes towards FAKE, while Green pushes towards REAL.")

if __name__ == "__main__":
    main()`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Documentation for the project.',
    content: `# Fake News Detection System with Explainable AI

This project uses Machine Learning (Logistic Regression) and NLP (TF-IDF) to classify news articles as **REAL** or **FAKE**. More importantly, it uses **SHAP (SHapley Additive exPlanations)** to explain *why* the model made its decision by highlighting influential words.

## 🚀 Features
- **Binary Classification**: Identifies news as REAL or FAKE.
- **Explainability**: Visualizes word impact on the model's decision.
- **Interactive Web App**: Built with Streamlit for a smooth user experience.
- **Beginner Friendly**: Clean, commented code using the standard Scikit-Learn pipeline.

## 🛠 Tech Stack
- **Python 3.10+**
- **Scikit-Learn**: Machine Learning model.
- **SHAP**: Explainable AI library.
- **Streamlit**: Web interface.
- **Pandas/Numpy**: Data manipulation.

## 📥 Installation

1. **Clone/Download** this project folder.
2. **Install dependencies**:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

## 🏃 Usage

### 1. Training
First, you need to train the model using a CSV dataset.
\`\`\`bash
python train.py
\`\`\`
This will generate files in a \`model/\` directory.

### 2. Run Web App
Launch the interactive dashboard:
\`\`\`bash
streamlit run app.py
\`\`\`

## 📊 Evaluation Metrics
After training, the system outputs:
- **Accuracy**: Overall correctness.
- **Precision**: How many predicted 'Fake' were actually 'Fake'.
- **Recall**: How many actual 'Fake' were caught by the model.

## ⚖ Ethics Section
- This tool is for **educational purposes**.
- Real-world fake news is complex; models can be fooled by sarcasm, evolving context, or unseen topics.
- Use this as a supporting tool, not a final truth source.`
  }
];
