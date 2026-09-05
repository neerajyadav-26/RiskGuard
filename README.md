# RiskGuard – AI-Powered Fraud Detection System

> **An explainable, real-time AI-powered fraud detection system for identifying suspicious payment transactions before authorization.**

RiskGuard analyzes **transaction, customer, card, merchant, temporal, geographical, and behavioral information** to estimate the fraud risk of a payment transaction.

The system combines **Machine Learning + Historical Behavioral Analysis + Explainable AI** to provide both a fraud risk score and an explanation of why a transaction was considered risky.

---

# 📌 Project Overview

Traditional fraud detection systems often rely heavily on predefined rules.

RiskGuard takes a machine-learning-based approach by learning patterns from historical transaction behavior.

For every transaction, RiskGuard:

1. Accepts transaction and historical behavioral information.
2. Validates the input features.
3. Preprocesses numerical and categorical data.
4. Uses a trained **Random Forest Classifier** to estimate fraud risk.
5. Assigns the transaction to a risk level.
6. Recommends an appropriate operational action.
7. Uses **SHAP** to explain the model's prediction.
8. Displays the result through an interactive React dashboard.

---

# 🚀 Key Features

| Feature | Description |
|---|---|
| **Real-Time Risk Scoring** | Estimates fraud risk for individual transactions |
| **Machine Learning Detection** | Uses a trained Random Forest model |
| **Behavioral Analysis** | Analyzes customer, card, and merchant history |
| **Transaction Velocity** | Considers transaction frequency over multiple time windows |
| **Customer Profiling** | Uses customer financial and demographic information |
| **Card Analysis** | Uses card-level transaction history and characteristics |
| **Merchant Analysis** | Uses MCC-level transaction and fraud history |
| **Risk Classification** | Categorizes transactions into four risk levels |
| **Recommended Actions** | Suggests allow, verify, hold, or block actions |
| **Explainable AI** | Uses SHAP to explain model decisions |
| **Interactive Dashboard** | Provides a user-friendly React interface |
| **REST API** | Provides fraud prediction through FastAPI |

---

# ⚠️ Risk Classification

RiskGuard converts the model's fraud risk score into four operational risk levels.

| Fraud Risk Score | Risk Level | Recommended Action |
|---:|:---:|---|
| **< 20%** | 🟢 **LOW** | Allow transaction |
| **20% – <50%** | 🟡 **MEDIUM** | Request verification / monitor transaction |
| **50% – <80%** | 🟠 **HIGH** | Hold transaction / manual review |
| **≥ 80%** | 🔴 **CRITICAL** | Block transaction / immediate investigation |

> **Important:** The model output is presented as a **fraud risk score**. It should not be interpreted as a perfectly calibrated probability of fraud.

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React Frontend        │
│          Vite + UI          │
└──────────────┬──────────────┘
               │
               │ HTTP POST
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
│        /predict API         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    Feature Validation &     │
│       Preprocessing         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      ColumnTransformer      │
│                             │
│      StandardScaler         │
│      OneHotEncoder          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    Random Forest Model      │
│                             │
│      Fraud Risk Score       │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│     Risk     │  │     SHAP     │
│ Classification│  │  Explanation │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                ▼
┌─────────────────────────────┐
│      RiskGuard Dashboard    │
│                             │
│ Score + Action + Explanation│
└─────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

1. **React**
2. **Vite**
3. **JavaScript / JSX**
4. **CSS**

## Backend

1. **Python**
2. **FastAPI**
3. **Uvicorn**

## Machine Learning

1. **Scikit-learn**
2. **Random Forest Classifier**
3. **StandardScaler**
4. **ColumnTransformer**
5. **OneHotEncoder**

## Explainable AI

1. **SHAP**
2. **TreeExplainer**

## Data Processing

1. **Pandas**
2. **NumPy**
3. **Parquet**

---

# 🧠 Model Features

RiskGuard uses **35 input features** covering transaction behavior, customer information, card information, location, and historical fraud patterns.

## 1. Transaction Features

1. Amount
2. Absolute transaction amount
3. Transaction direction
4. Transaction hour
5. Day of week
6. Time since previous transaction

## 2. Behavioral Features

1. Historical average transaction amount
2. Amount ratio to historical spending
3. Transactions in the last 10 minutes
4. Transactions in the last hour
5. Transactions in the last 24 hours

## 3. Customer Features

1. Customer age
2. FICO score
3. Number of credit cards
4. Yearly income
5. Total debt
6. Debt-to-income ratio

## 4. Card Features

1. Cards issued
2. Credit limit
3. Amount-to-credit-limit ratio
4. Amount-to-income ratio
5. Card brand
6. Card type
7. Card has chip

## 5. Location Features

1. Location changed

## 6. Historical Customer Features

1. Customer previous transactions
2. Customer previous fraud
3. Customer historical fraud rate

## 7. Historical Card Features

1. Card previous transactions
2. Card previous fraud
3. Card historical fraud rate

## 8. Historical Merchant Features

1. MCC previous transactions
2. MCC previous fraud
3. MCC historical fraud rate

---

# 🔄 Machine Learning Pipeline

```text
Raw Transaction Data
         │
         ▼
Historical Feature Engineering
         │
         ▼
Customer / Card / Merchant
Behavioral Features
         │
         ▼
Numerical + Categorical Features
         │
         ▼
ColumnTransformer
         │
    ┌────┴─────┐
    ▼          ▼
StandardScaler  OneHotEncoder
    │          │
    └────┬─────┘
         ▼
Random Forest Classifier
         │
         ▼
Fraud Risk Score
         │
         ▼
Risk Classification
         │
         ▼
SHAP Explanation
```

The preprocessing pipeline converts the **35 raw input features into 150 encoded features** before passing them to the Random Forest model.

---

# 🔍 Explainable AI with SHAP

RiskGuard uses **SHAP (SHapley Additive exPlanations)** to make machine learning predictions easier to understand.

Instead of only displaying:

```text
Fraud Risk Score: 98.50%
```

RiskGuard also identifies the features that influenced the prediction.

## 🚨 Fraud Signals

Fraud signals are features that increase the model's fraud risk assessment.

Examples include:

1. High historical fraud rate for the merchant category
2. Previous fraud on the card
3. High card historical fraud rate
4. Unusual transaction amount
5. High transaction velocity

## 🛡️ Protective Signals

Protective signals are features that decrease the model's fraud risk assessment.

This allows users to understand **why a transaction received a particular risk score** instead of treating the machine learning model as a black box.

---

# 📊 Example Results

## 🟢 Legitimate Low-Risk Transaction

```text
Amount: $8.61

Fraud Risk Score: 17.37%

Risk Level: LOW

Recommended Action:
Allow transaction
```

---

## 🟠 Legitimate Higher-Risk Transaction

```text
Amount: $192.18

Fraud Risk Score: 56.99%

Risk Level: HIGH

Recommended Action:
Hold transaction / manual review
```

A legitimate transaction can still receive a high fraud risk score if its characteristics resemble patterns associated with fraudulent transactions.

---

## 🔴 Fraudulent Transaction

```text
Amount: $436.44

Fraud Risk Score: 98.50%

Risk Level: CRITICAL

Recommended Action:
Block transaction / immediate investigation
```

---

# 📁 Project Structure

```text
RiskGuard/
│
├── backend/
│   └── main_v4.py
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── package-lock.json
│
├── models/
│   ├── ibm_fraud_model_v4.pkl
│   ├── ibm_scaler_v4.pkl
│   ├── ibm_feature_columns_v4.pkl
│   └── ibm_training_medians_v4.pkl
│
├── .gitignore
├── requirements.txt
└── README.md
```

> **Note:** Large datasets and local development files are not required to run the deployed V4 inference application. The required trained model artifacts are included in the repository.

---

# ▶️ Running the Project Locally

Follow these steps to run RiskGuard on a **completely new Windows system**.

## Step 1 — Install Prerequisites

Install the following software:

1. **Git**
2. **Python 3.11**
3. **Node.js and npm**

After installation, open **Windows PowerShell** and verify:

```powershell
git --version
python --version
node --version
npm --version
```

Python 3.11 is recommended because the project's tested environment uses Python 3.11.

---

## Step 2 — Clone the Repository

Open Windows PowerShell and run:

```powershell
git clone https://github.com/neerajyadav-26/RiskGuard.git
```

Move into the project directory:

```powershell
cd RiskGuard
```

---

## Step 3 — Create a Python Virtual Environment

From the project root:

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

The terminal should now show:

```text
(venv)
```

If PowerShell blocks script execution, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Then activate the environment again:

```powershell
.\venv\Scripts\Activate.ps1
```

---

## Step 4 — Install Backend Dependencies

Install all required Python packages using the included requirements file:

```powershell
pip install -r requirements.txt
```

This installs the dependencies required by the RiskGuard backend, including:

1. FastAPI
2. Uvicorn
3. Pydantic
4. Joblib
5. Pandas
6. NumPy
7. SHAP
8. Scikit-learn

The required dependency versions are specified in `requirements.txt`.

---

## Step 5 — Start the FastAPI Backend

From the project root, run:

```powershell
python -m uvicorn backend.main_v4:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Keep this terminal running.

---

## Step 6 — Install Frontend Dependencies

Open a **second Windows PowerShell terminal**.

Move into the frontend directory:

```powershell
cd RiskGuard\frontend
```

Install the React/Vite dependencies:

```powershell
npm install
```

Wait until the installation finishes successfully.

---

## Step 7 — Start the React Frontend

Run:

```powershell
npm run dev
```

Vite will display a local URL similar to:

```text
http://localhost:5173/
```

If port `5173` is already in use, Vite may automatically use another port such as:

```text
http://localhost:5174/
```

Open the URL displayed by Vite in your web browser.

---

## Step 8 — Use RiskGuard

Once both the backend and frontend are running:

1. Open the Vite URL in your browser.
2. Enter the required transaction and customer/card features.
3. Submit the transaction.
4. RiskGuard generates a fraud-risk score.
5. The system assigns a LOW, MEDIUM, HIGH, or CRITICAL risk level.
6. The system recommends an action such as allowing, verifying, holding, or blocking the transaction.
7. SHAP explanations show the factors contributing to the prediction.

---

# 📦 No Dataset Download Required for Running the Application

The trained RiskGuard V4 model and its required inference artifacts are already included in the `models/` directory of this repository.

Therefore, a user who only wants to **run the application** does not need to download the original training dataset or retrain the model.

The dataset and model-training scripts were used during development and experimentation, but they are not required for normal application inference.

---

# 🔌 API

## POST `/predict`

The frontend sends the **35 transaction features** to the FastAPI backend.

The backend processes the transaction and returns:

1. Fraud risk score
2. Fraud risk percentage
3. Risk level
4. Recommended action
5. Transaction summary
6. SHAP-based explanation

Example endpoint:

```text
POST http://127.0.0.1:8000/predict
```

---

# 📦 Production Frontend Build

To create the production build of the React frontend:

```powershell
cd frontend
npm run build
```

The generated production files will be placed inside:

```text
frontend/dist/
```

The `dist/` directory is generated automatically and is not required in the GitHub repository for local development.

---

# 🤖 Model Artifacts

The V4 model requires the following files:

```text
models/
│
├── ibm_fraud_model_v4.pkl
├── ibm_scaler_v4.pkl
├── ibm_feature_columns_v4.pkl
└── ibm_training_medians_v4.pkl
```

These artifacts contain:

1. The trained Random Forest model
2. The fitted preprocessing pipeline
3. Feature metadata
4. Training-time numerical medians used during inference

---

# ⚠️ Important Note

RiskGuard is a **machine learning decision-support system**.

A high fraud risk score means that the transaction contains characteristics associated with fraudulent behavior. It does **not independently prove that fraud has occurred**.

In a production banking or payment environment, the model should be combined with:

1. Additional fraud detection systems
2. Transaction verification
3. Manual investigation
4. Institution-specific security policies

---

# 🔮 Future Improvements

Potential future improvements include:

1. Real-time transaction streaming
2. Model probability calibration
3. Model monitoring and drift detection
4. Automated model retraining
5. Advanced fraud detection models
6. Ensemble learning
7. Transaction graph analysis
8. Real-time fraud alerts
9. Authentication and role-based access control
10. Database-backed transaction history
11. Cloud deployment
12. Additional fraud datasets
13. Advanced SHAP visualizations

---

# 📌 Project Status

**Status: Functional V4 Prototype / Demonstration System**

RiskGuard currently provides an end-to-end fraud detection workflow:

```text
Transaction Input
      │
      ▼
Feature Processing
      │
      ▼
Machine Learning Prediction
      │
      ▼
Fraud Risk Score
      │
      ▼
Risk Classification
      │
      ▼
Recommended Action
      │
      ▼
SHAP Explanation
      │
      ▼
Interactive Dashboard
```

The current version demonstrates:

1. Real-time transaction scoring
2. Risk classification
3. Recommended operational actions
4. Customer, card, and merchant behavioral analysis
5. Explainable AI using SHAP
6. React-based visualization
7. FastAPI-based prediction API

---

# 👨‍💻 Project Summary

**RiskGuard** combines machine learning, behavioral analysis, and explainable AI into a single fraud detection workflow.

The project demonstrates how a transaction can be evaluated **before authorization**, assigned a fraud risk level, routed toward an appropriate action, and accompanied by an explanation of the factors influencing the model's decision.