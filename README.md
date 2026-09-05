\# RiskGuard – AI-Powered Fraud Detection System



> \*\*An explainable, real-time AI-powered fraud detection system for identifying suspicious payment transactions before authorization.\*\*



RiskGuard analyzes \*\*transaction, customer, card, merchant, temporal, geographical, and behavioral information\*\* to estimate the fraud risk of a payment transaction.



The system combines \*\*Machine Learning + Historical Behavioral Analysis + Explainable AI\*\* to provide both a fraud risk score and an explanation of why a transaction was considered risky.



\---



\## 📌 Project Overview



Traditional fraud detection systems often rely heavily on predefined rules.



RiskGuard takes a machine-learning-based approach by learning patterns from historical transaction behavior.



For every transaction, RiskGuard:



1\. Accepts transaction and historical behavioral information.

2\. Validates the input features.

3\. Preprocesses numerical and categorical data.

4\. Uses a trained \*\*Random Forest Classifier\*\* to estimate fraud risk.

5\. Assigns the transaction to a risk level.

6\. Recommends an appropriate operational action.

7\. Uses \*\*SHAP\*\* to explain the model's prediction.

8\. Displays the result through an interactive React dashboard.



\---



\## 🚀 Key Features



| Feature | Description |

|---|---|

| \*\*Real-Time Risk Scoring\*\* | Estimates fraud risk for individual transactions |

| \*\*Machine Learning Detection\*\* | Uses a trained Random Forest model |

| \*\*Behavioral Analysis\*\* | Analyzes customer, card, and merchant history |

| \*\*Transaction Velocity\*\* | Considers transaction frequency over multiple time windows |

| \*\*Customer Profiling\*\* | Uses customer financial and demographic information |

| \*\*Card Analysis\*\* | Uses card-level transaction history and characteristics |

| \*\*Merchant Analysis\*\* | Uses MCC-level transaction and fraud history |

| \*\*Risk Classification\*\* | Categorizes transactions into four risk levels |

| \*\*Recommended Actions\*\* | Suggests allow, verify, hold, or block actions |

| \*\*Explainable AI\*\* | Uses SHAP to explain model decisions |

| \*\*Interactive Dashboard\*\* | Provides a user-friendly React interface |

| \*\*REST API\*\* | Provides fraud prediction through FastAPI |



\---



\# ⚠️ Risk Classification



RiskGuard converts the model's fraud risk score into four operational risk levels.



| Fraud Risk Score | Risk Level | Recommended Action |

|---:|:---:|---|

| \*\*< 20%\*\* | 🟢 \*\*LOW\*\* | Allow transaction |

| \*\*20% – <50%\*\* | 🟡 \*\*MEDIUM\*\* | Request verification / monitor transaction |

| \*\*50% – <80%\*\* | 🟠 \*\*HIGH\*\* | Hold transaction / manual review |

| \*\*≥ 80%\*\* | 🔴 \*\*CRITICAL\*\* | Block transaction / immediate investigation |



> \*\*Important:\*\* The model output is presented as a \*\*fraud risk score\*\*. It should not be interpreted as a perfectly calibrated probability of fraud.



\---



\# 🏗️ System Architecture



```text

┌─────────────────────────────┐

│       React Frontend        │

│          Vite + UI          │

└──────────────┬──────────────┘

&#x20;              │

&#x20;              │ HTTP POST

&#x20;              ▼

┌─────────────────────────────┐

│       FastAPI Backend       │

│        /predict API         │

└──────────────┬──────────────┘

&#x20;              │

&#x20;              ▼

┌─────────────────────────────┐

│    Feature Validation \&     │

│       Preprocessing         │

└──────────────┬──────────────┘

&#x20;              │

&#x20;              ▼

┌─────────────────────────────┐

│      ColumnTransformer      │

│                             │

│      StandardScaler         │

│      OneHotEncoder          │

└──────────────┬──────────────┘

&#x20;              │

&#x20;              ▼

┌─────────────────────────────┐

│    Random Forest Model      │

│                             │

│      Fraud Risk Score       │

└──────────────┬──────────────┘

&#x20;              │

&#x20;       ┌──────┴──────┐

&#x20;       ▼             ▼

┌──────────────┐  ┌──────────────┐

│     Risk     │  │     SHAP     │

│Classification│  │  Explanation │

└──────┬───────┘  └──────┬───────┘

&#x20;      │                 │

&#x20;      └────────┬────────┘

&#x20;               ▼

┌─────────────────────────────┐

│      RiskGuard Dashboard    │

│                             │

│ Score + Action + Explanation│

└─────────────────────────────┘

````



\---



\# 🛠️ Technology Stack



\## Frontend



1\. \*\*React\*\*

2\. \*\*Vite\*\*

3\. \*\*JavaScript / JSX\*\*

4\. \*\*CSS\*\*



\## Backend



1\. \*\*Python\*\*

2\. \*\*FastAPI\*\*

3\. \*\*Uvicorn\*\*



\## Machine Learning



1\. \*\*Scikit-learn\*\*

2\. \*\*Random Forest Classifier\*\*

3\. \*\*StandardScaler\*\*

4\. \*\*ColumnTransformer\*\*

5\. \*\*OneHotEncoder\*\*



\## Explainable AI



1\. \*\*SHAP\*\*

2\. \*\*TreeExplainer\*\*



\## Data Processing



1\. \*\*Pandas\*\*

2\. \*\*NumPy\*\*

3\. \*\*Parquet\*\*



\---



\# 🧠 Model Features



RiskGuard uses \*\*35 input features\*\* covering transaction behavior, customer information, card information, location, and historical fraud patterns.



\## 1. Transaction Features



1\. Amount

2\. Absolute transaction amount

3\. Transaction direction

4\. Transaction hour

5\. Day of week

6\. Time since previous transaction



\## 2. Behavioral Features



1\. Historical average transaction amount

2\. Amount ratio to historical spending

3\. Transactions in the last 10 minutes

4\. Transactions in the last hour

5\. Transactions in the last 24 hours



\## 3. Customer Features



1\. Customer age

2\. FICO score

3\. Number of credit cards

4\. Yearly income

5\. Total debt

6\. Debt-to-income ratio



\## 4. Card Features



1\. Cards issued

2\. Credit limit

3\. Amount-to-credit-limit ratio

4\. Amount-to-income ratio

5\. Card brand

6\. Card type

7\. Card has chip



\## 5. Location Features



1\. Location changed



\## 6. Historical Customer Features



1\. Customer previous transactions

2\. Customer previous fraud

3\. Customer historical fraud rate



\## 7. Historical Card Features



1\. Card previous transactions

2\. Card previous fraud

3\. Card historical fraud rate



\## 8. Historical Merchant Features



1\. MCC previous transactions

2\. MCC previous fraud

3\. MCC historical fraud rate



\---



\# 🔄 Machine Learning Pipeline



```text

Raw Transaction Data

&#x20;         │

&#x20;         ▼

Historical Feature Engineering

&#x20;         │

&#x20;         ▼

Customer / Card / Merchant

Behavioral Features

&#x20;         │

&#x20;         ▼

Numerical + Categorical Features

&#x20;         │

&#x20;         ▼

ColumnTransformer

&#x20;         │

&#x20;    ┌────┴─────┐

&#x20;    ▼          ▼

StandardScaler  OneHotEncoder

&#x20;    │          │

&#x20;    └────┬─────┘

&#x20;         ▼

Random Forest Classifier

&#x20;         │

&#x20;         ▼

Fraud Risk Score

&#x20;         │

&#x20;         ▼

Risk Classification

&#x20;         │

&#x20;         ▼

SHAP Explanation

```



The preprocessing pipeline converts the \*\*35 raw input features into 150 encoded features\*\* before passing them to the Random Forest model.



\---



\# 🔍 Explainable AI with SHAP



RiskGuard uses \*\*SHAP (SHapley Additive exPlanations)\*\* to make machine learning predictions easier to understand.



Instead of only displaying:



```text

Fraud Risk Score: 98.50%

```



RiskGuard also identifies the features that influenced the prediction.



\## 🚨 Fraud Signals



Fraud signals are features that increase the model's fraud risk assessment.



Examples include:



1\. High historical fraud rate for the merchant category

2\. Previous fraud on the card

3\. High card historical fraud rate

4\. Unusual transaction amount

5\. High transaction velocity



\## 🛡️ Protective Signals



Protective signals are features that decrease the model's fraud risk assessment.



This allows users to understand \*\*why a transaction received a particular risk score\*\* instead of treating the machine learning model as a black box.



\---



\# 📊 Example Results



\## 🟢 Legitimate Low-Risk Transaction



```text

Amount: $8.61



Fraud Risk Score: 17.37%



Risk Level: LOW



Recommended Action:

Allow transaction

```



\---



\## 🟠 Legitimate Higher-Risk Transaction



```text

Amount: $192.18



Fraud Risk Score: 56.99%



Risk Level: HIGH



Recommended Action:

Hold transaction / manual review

```



A legitimate transaction can still receive a high fraud risk score if its characteristics resemble patterns associated with fraudulent transactions.



\---



\## 🔴 Fraudulent Transaction



```text

Amount: $436.44



Fraud Risk Score: 98.50%



Risk Level: CRITICAL



Recommended Action:

Block transaction / immediate investigation

```



\---



\# 📁 Project Structure



```text

RISKGAURD/

│

├── backend/

│   ├── main.py

│   ├── main\_before\_v4\_integration.py

│   ├── main\_v4.py

│   └── main\_v4\_FINAL.py

│

├── frontend/

│   ├── src/

│   │   ├── App.jsx

│   │   └── App\_FINAL.jsx

│   ├── package.json

│   └── dist/

│

├── data/

│   ├── creditcard.csv

│   ├── ibm\_sorted.parquet

│   ├── ibm\_features\_v2.parquet

│   ├── ibm\_features\_profile\_enriched.parquet

│   ├── ibm\_features\_profile\_clean.parquet

│   └── riskguard\_v4\_test\_predictions\_clean.parquet

│

├── models/

│   ├── ibm\_fraud\_model\_v4.pkl

│   ├── ibm\_scaler\_v4.pkl

│   ├── ibm\_feature\_columns\_v4.pkl

│   └── ibm\_training\_medians\_v4.pkl

│

├── venv/

│

└── README.md

```



> \*\*Note:\*\* `venv/` is a local Python virtual environment and normally should not be uploaded to GitHub.



\---



\# ▶️ Running the Project Locally



\## Step 1 — Activate the Virtual Environment



Open \*\*Windows PowerShell\*\* from the project root.



```powershell

.\\venv\\Scripts\\Activate.ps1

```



\---



\## Step 2 — Start the FastAPI Backend



From the project root:



```powershell

python -m uvicorn backend.main\_v4:app --reload

```



The backend will run at:



```text

http://127.0.0.1:8000

```



\---



\## Step 3 — Start the React Frontend



Open a \*\*second terminal\*\*.



```powershell

cd frontend

npm run dev

```



Vite will display a local URL such as:



```text

http://localhost:5173

```



If port `5173` is already in use, Vite may automatically use:



```text

http://localhost:5174

```



\---



\## Step 4 — Open RiskGuard



Open the Vite URL displayed in the terminal.



You should now see the \*\*RiskGuard fraud detection dashboard\*\*.



\---



\# 🔌 API



\## POST `/predict`



The frontend sends the \*\*35 transaction features\*\* to the FastAPI backend.



The backend processes the transaction and returns:



1\. Fraud risk score

2\. Fraud risk percentage

3\. Risk level

4\. Recommended action

5\. Transaction summary

6\. SHAP-based explanation



Example endpoint:



```text

POST http://127.0.0.1:8000/predict

```



\---



\# 📦 Production Frontend Build



To create the production build of the React frontend:



```powershell

cd frontend

npm run build

```



The generated production files will be placed inside:



```text

frontend/dist/

```



\---



\# 🤖 Model Artifacts



The V4 model requires the following files:



```text

models/

│

├── ibm\_fraud\_model\_v4.pkl

├── ibm\_scaler\_v4.pkl

├── ibm\_feature\_columns\_v4.pkl

└── ibm\_training\_medians\_v4.pkl

```



These artifacts contain:



1\. The trained Random Forest model

2\. The fitted preprocessing pipeline

3\. Feature metadata

4\. Training-time numerical medians used during inference



\---



\# ⚠️ Important Note



RiskGuard is a \*\*machine learning decision-support system\*\*.



A high fraud risk score means that the transaction contains characteristics associated with fraudulent behavior. It does \*\*not independently prove that fraud has occurred\*\*.



In a production banking or payment environment, the model should be combined with:



1\. Additional fraud detection systems

2\. Transaction verification

3\. Manual investigation

4\. Institution-specific security policies



\---



\# 🔮 Future Improvements



Potential future improvements include:



1\. Real-time transaction streaming

2\. Model probability calibration

3\. Model monitoring and drift detection

4\. Automated model retraining

5\. Advanced fraud detection models

6\. Ensemble learning

7\. Transaction graph analysis

8\. Real-time fraud alerts

9\. Authentication and role-based access control

10\. Database-backed transaction history

11\. Cloud deployment

12\. Additional fraud datasets

13\. Advanced SHAP visualizations



\---



\# 📌 Project Status



\*\*Status: Functional V4 Prototype / Demonstration System\*\*



RiskGuard currently provides an end-to-end fraud detection workflow:



```text

Transaction Input

&#x20;      │

&#x20;      ▼

Feature Processing

&#x20;      │

&#x20;      ▼

Machine Learning Prediction

&#x20;      │

&#x20;      ▼

Fraud Risk Score

&#x20;      │

&#x20;      ▼

Risk Classification

&#x20;      │

&#x20;      ▼

Recommended Action

&#x20;      │

&#x20;      ▼

SHAP Explanation

&#x20;      │

&#x20;      ▼

Interactive Dashboard

```



The current version demonstrates:



1\. Real-time transaction scoring

2\. Risk classification

3\. Recommended operational actions

4\. Customer, card, and merchant behavioral analysis

5\. Explainable AI using SHAP

6\. React-based visualization

7\. FastAPI-based prediction API



\---



\## 👨‍💻 Project Summary



\*\*RiskGuard\*\* combines machine learning, behavioral analysis, and explainable AI into a single fraud detection workflow.



The project demonstrates how a transaction can be evaluated \*\*before authorization\*\*, assigned a fraud risk level, routed toward an appropriate action, and accompanied by an explanation of the factors influencing the model's decision.









