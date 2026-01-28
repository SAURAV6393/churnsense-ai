# 🛡️ ChurnSense: Predictive Analytics & Retention Platform

**ChurnSense** is a comprehensive data science project focused on identifying customer attrition patterns and automating retention strategies. Developed as a high-performance analytical tool, it integrates traditional machine learning with advanced LLM-based reasoning to provide actionable business intelligence.

---

## 🏗️ Technical Architecture

The platform is built with a decoupled architecture focusing on scalability and predictive precision.

- **Backend Engine**: FastAPI (Python 3.10+) utilizing asynchronous processing for real-time inference.
- **Data Science Core**: Implementation of Ensemble Learning (XGBoost, Random Forest, Logistic Regression) with optimized hyperparameters.
- **Frontend Interface**: High-fidelity React application with Tailwind CSS for professional data visualization.
- **Intelligence Layer**: Integration of Google Gemini 3.0 for generating local-language retention strategies and strategic audits.
- **Data Layer**: MongoDB for flexible persistence of customer history and risk logs.

---

## ✨ Project Capabilities

- **Ensemble Inference**: A stacked model architecture that aggregates weights from multiple classifiers to ensure high AUC-ROC scores.
- **Statistical Explainability**: Direct feature attribution to show which variables (e.g., tenure, contract type) are driving specific risk scores.
- **Cross-Validation Reporting**: Built-in 5-fold CV reporting for model stability assessment.
- **Multi-lingual Insights**: Automatic generation of English and Hindi strategy reports for operational staff.
- **Live Intelligence Hub**: Voice-enabled querying for rapid churn-risk consultation.

---

## 🚀 Deployment & Installation

### 1. Prerequisites
- Python 3.10+
- Node.js & NPM
- MongoDB Cluster (Atlas or Local)

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
API_KEY=your_secure_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_unique_jwt_secret
SMTP_USER=notifications@yourdomain.com
SMTP_PASS=your_secure_password
```

### 3. Backend Setup
```bash
# Setup virtual environment
python -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start the server
uvicorn main:app --port 3000 --reload
```

### 4. Interface Setup
The frontend is integrated as an ES module system. Ensure your environment variables are accessible to the client-side execution.

---

## 👨‍💻 Developer Information
**Name:** Saurav Rajput  
**Role:** Lead Data Engineer  
**Project:** B.Tech Capstone Project in Applied Machine Learning  

[GitHub Repository](https://github.com/SAURAV6393/churnsense-ai.git) | [Project Report](https://github.com/SAURAV6393/ChurnSense/docs/report.pdf)
