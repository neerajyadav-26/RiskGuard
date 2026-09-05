from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import math
import pandas as pd
import numpy as np
import shap


# ============================================================
# RISKGUARD V4 API
# ============================================================

APP_VERSION = "2.0.0"
MAX_REQUEST_SIZE = 10 * 1024


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "ibm_fraud_model_v4.pkl"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "models",
    "ibm_scaler_v4.pkl"
)

FEATURE_PATH = os.path.join(
    BASE_DIR,
    "models",
    "ibm_feature_columns_v4.pkl"
)

MEDIANS_PATH = os.path.join(
    BASE_DIR,
    "models",
    "ibm_training_medians_v4.pkl"
)


# ============================================================
# CORS
# ============================================================

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "RISKGUARD_ALLOWED_ORIGINS",
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "http://localhost:5174,"
        "http://127.0.0.1:5174"
    ).split(",")
    if origin.strip()
]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="RiskGuard API",
    description=(
        "Explainable, real-time AI-powered "
        "credit card fraud detection system"
    ),
    version=APP_VERSION
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ============================================================
# REQUEST SIZE LIMIT
# ============================================================

@app.middleware("http")
async def request_size_limit(
    request: Request,
    call_next
):

    content_length = request.headers.get(
        "content-length"
    )

    if content_length:

        try:

            content_length = int(
                content_length
            )

            if content_length > MAX_REQUEST_SIZE:

                raise HTTPException(
                    status_code=413,
                    detail="Request payload is too large."
                )

        except ValueError:

            raise HTTPException(
                status_code=400,
                detail="Invalid Content-Length header."
            )

    response = await call_next(request)

    return response


# ============================================================
# SECURITY HEADERS
# ============================================================

@app.middleware("http")
async def security_headers(
    request: Request,
    call_next
):

    response = await call_next(request)

    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"

    response.headers[
        "X-Frame-Options"
    ] = "DENY"

    response.headers[
        "Referrer-Policy"
    ] = "no-referrer"

    return response


# ============================================================
# LOAD MODEL COMPONENTS
# ============================================================

try:

    model = joblib.load(
        MODEL_PATH
    )

    preprocessor = joblib.load(
        PREPROCESSOR_PATH
    )

    feature_metadata = joblib.load(
        FEATURE_PATH
    )

    training_medians = joblib.load(
        MEDIANS_PATH
    )

except Exception as exc:

    raise RuntimeError(
        "Failed to load RiskGuard V4 "
        f"components: {exc}"
    )


# ============================================================
# EXTRACT FEATURE METADATA
# ============================================================

NUMERIC_FEATURES = (
    feature_metadata[
        "numeric_features"
    ]
)

CATEGORICAL_FEATURES = (
    feature_metadata[
        "categorical_features"
    ]
)

FEATURE_COLUMNS = (
    feature_metadata[
        "all_features"
    ]
)

ENCODED_FEATURE_NAMES = (
    feature_metadata[
        "encoded_feature_names"
    ]
)


EXPECTED_FEATURE_COUNT = (
    len(FEATURE_COLUMNS)
)


if EXPECTED_FEATURE_COUNT != 35:

    raise RuntimeError(
        "RiskGuard V4 expects 35 input features, "
        f"but found {EXPECTED_FEATURE_COUNT}."
    )


if len(ENCODED_FEATURE_NAMES) != 150:

    raise RuntimeError(
        "RiskGuard V4 expects 150 encoded features, "
        f"but found {len(ENCODED_FEATURE_NAMES)}."
    )


# ============================================================
# TRAINING MEDIANS
# ============================================================

if isinstance(
    training_medians,
    dict
):

    MEDIANS = training_medians

elif isinstance(
    training_medians,
    pd.Series
):

    MEDIANS = (
        training_medians.to_dict()
    )

else:

    raise RuntimeError(
        "Unexpected training median format."
    )


# ============================================================
# HUMAN-READABLE FEATURE NAMES
# ============================================================

FEATURE_DISPLAY_NAMES = {

    "Amount":
        "Transaction Amount",

    "amount_abs":
        "Absolute Transaction Amount",

    "transaction_hour":
        "Transaction Hour",

    "day_of_week":
        "Day of Week",

    "time_since_previous_min":
        "Time Since Previous Transaction",

    "historical_avg_amount":
        "Historical Average Amount",

    "amount_ratio_to_history":
        "Amount Compared With Historical Spending",

    "transactions_last_10min":
        "Transactions in Last 10 Minutes",

    "transactions_last_1hour":
        "Transactions in Last Hour",

    "transactions_last_24hour":
        "Transactions in Last 24 Hours",

    "customer_age":
        "Customer Age",

    "fico_score":
        "FICO Score",

    "num_credit_cards":
        "Number of Credit Cards",

    "yearly_income_num":
        "Yearly Income",

    "total_debt_num":
        "Total Debt",

    "debt_to_income":
        "Debt-to-Income Ratio",

    "cards_issued":
        "Cards Issued",

    "credit_limit_num":
        "Credit Limit",

    "amount_to_credit_limit":
        "Amount Compared With Credit Limit",

    "amount_to_income":
        "Amount Compared With Income",

    "location_changed":
        "Location Changed",

    "customer_previous_transactions":
        "Previous Customer Transactions",

    "customer_previous_fraud":
        "Previous Customer Fraud",

    "customer_historical_fraud_rate":
        "Customer Historical Fraud Rate",

    "card_previous_transactions":
        "Previous Transactions on This Card",

    "card_previous_fraud":
        "Previous Fraud on This Card",

    "card_historical_fraud_rate":
        "Card Historical Fraud Rate",

    "mcc_previous_transactions":
        "Previous Transactions in Merchant Category",

    "mcc_previous_fraud":
        "Previous Fraud in Merchant Category",

    "mcc_historical_fraud_rate":
        "Merchant Category Historical Fraud Rate",

    "amount_direction":
        "Transaction Direction",

    "card_brand":
        "Card Brand",

    "card_type":
        "Card Type",

    "card_has_chip":
        "Card Has Chip",

    "MCC":
        "Merchant Category Code",
}


# ============================================================
# SHAP
# ============================================================

try:

    explainer = shap.TreeExplainer(
        model
    )

except Exception as exc:

    raise RuntimeError(
        f"Failed to create SHAP explainer: {exc}"
    )


# ============================================================
# REQUEST MODEL
# ============================================================

class TransactionRequest(BaseModel):

    features: list


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {

        "service":
            "RiskGuard API",

        "status":
            "healthy",

        "version":
            APP_VERSION,

        "model":
            "RiskGuard V4",

        "features":
            EXPECTED_FEATURE_COUNT,

        "encoded_features":
            len(ENCODED_FEATURE_NAMES),

        "explainability":
            "SHAP"

    }


# ============================================================
# MODEL STATUS
# ============================================================

@app.get("/model-status")
def model_status():

    return {

        "model":
            type(model).__name__,

        "model_version":
            "RiskGuard V4",

        "input_features":
            EXPECTED_FEATURE_COUNT,

        "numeric_features":
            len(NUMERIC_FEATURES),

        "categorical_features":
            len(CATEGORICAL_FEATURES),

        "encoded_features":
            len(ENCODED_FEATURE_NAMES),

        "shap_enabled":
            True,

        "status":
            "loaded"

    }


# ============================================================
# VALIDATE REQUEST
# ============================================================

def validate_features(
    features
):

    if len(features) != EXPECTED_FEATURE_COUNT:

        raise HTTPException(
            status_code=422,
            detail={
                "error":
                    "Invalid feature count",

                "expected":
                    EXPECTED_FEATURE_COUNT,

                "received":
                    len(features)
            }
        )


    # --------------------------------------------------------
    # Numeric features
    # --------------------------------------------------------

    for index, feature in enumerate(
        NUMERIC_FEATURES
    ):

        value = features[index]

        if value is None:

            continue

        if isinstance(
            value,
            bool
        ):

            raise HTTPException(
                status_code=422,
                detail={
                    "error":
                        "Invalid numeric feature",

                    "feature":
                        feature
                }
            )

        try:

            numeric_value = float(
                value
            )

        except Exception:

            raise HTTPException(
                status_code=422,
                detail={
                    "error":
                        "Invalid numeric feature",

                    "feature":
                        feature,

                    "message":
                        "Expected a numeric value."
                }
            )

        if not math.isfinite(
            numeric_value
        ):

            raise HTTPException(
                status_code=422,
                detail={
                    "error":
                        "Invalid numerical value",

                    "feature":
                        feature
                }
            )


    # --------------------------------------------------------
    # Categorical features
    # --------------------------------------------------------

    for index, feature in enumerate(
        CATEGORICAL_FEATURES,
        start=len(NUMERIC_FEATURES)
    ):

        value = features[index]

        if value is None:

            raise HTTPException(
                status_code=422,
                detail={
                    "error":
                        "Missing categorical feature",

                    "feature":
                        feature
                }
            )

        if str(value).strip() == "":

            raise HTTPException(
                status_code=422,
                detail={
                    "error":
                        "Empty categorical feature",

                    "feature":
                        feature
                }
            )


# ============================================================
# RISK LEVEL
# ============================================================

def get_risk_level(
    probability
):

    if probability < 0.20:

        return "LOW"

    elif probability < 0.50:

        return "MEDIUM"

    elif probability < 0.80:

        return "HIGH"

    else:

        return "CRITICAL"


# ============================================================
# ACTION
# ============================================================

def get_recommended_action(
    risk_level
):

    if risk_level == "CRITICAL":

        return (
            "Block transaction / "
            "immediate investigation"
        )

    elif risk_level == "HIGH":

        return (
            "Hold transaction / "
            "manual review"
        )

    elif risk_level == "MEDIUM":

        return (
            "Request verification / "
            "monitor transaction"
        )

    else:

        return "Allow transaction"


# ============================================================
# CLEAN SHAP FEATURE NAME
# ============================================================

def clean_shap_feature_name(
    feature_name,
    feature_value=None
):

    name = str(
        feature_name
    )

    if "__" in name:

        name = name.split(
            "__",
            1
        )[1]


    categorical_features = [
        "amount_direction",
        "card_brand",
        "card_type",
        "card_has_chip",
        "MCC",
    ]


    for category in (
        categorical_features
    ):

        prefix = (
            category + "_"
        )

        if name.startswith(
            prefix
        ):

            value = name[
                len(prefix):
            ]

            display_name = (
                FEATURE_DISPLAY_NAMES.get(
                    category,
                    category
                )
            )

            # ------------------------------------------------
            # One-hot encoded categorical feature
            # ------------------------------------------------

            if feature_value is not None:

                # Hide inactive one-hot categories.
                if float(feature_value) == 0:

                    return None

                return (
                    f"{display_name}: {value}"
                )

            return (
                f"{display_name}: {value}"
            )


    return FEATURE_DISPLAY_NAMES.get(
        name,
        name
    )


# ============================================================
# BUILD SHAP EXPLANATION
# ============================================================

def build_shap_explanation(
    transaction_df
):

    # --------------------------------------------------------
    # 1. Transform original transaction
    # --------------------------------------------------------

    transformed = (
        preprocessor.transform(
            transaction_df
        )
    )


    # --------------------------------------------------------
    # 2. Calculate SHAP values
    # --------------------------------------------------------

    shap_values = (
        explainer.shap_values(
            transformed
        )
    )

    shap_values = np.asarray(
        shap_values
    )


    # --------------------------------------------------------
    # SHAP 0.51+
    #
    # For binary RandomForest:
    #
    # (samples, features, classes)
    #
    # Class 1 = fraud
    # --------------------------------------------------------

    if shap_values.ndim == 3:

        if shap_values.shape[2] >= 2:

            values = (
                shap_values[
                    0,
                    :,
                    1
                ]
            )

        else:

            values = (
                shap_values[
                    0,
                    :,
                    0
                ]
            )

    elif shap_values.ndim == 2:

        values = (
            shap_values[0]
        )

    else:

        values = shap_values


    # --------------------------------------------------------
    # 3. Get encoded feature names
    # --------------------------------------------------------

    feature_names = (
        preprocessor
        .get_feature_names_out()
        .tolist()
    )


    # --------------------------------------------------------
    # 4. Safety check
    # --------------------------------------------------------

    if len(values) != len(feature_names):

        raise RuntimeError(
            "SHAP feature count does not match "
            "preprocessor feature count. "
            f"SHAP={len(values)}, "
            f"features={len(feature_names)}"
        )


    # --------------------------------------------------------
    # 5. Build explanation
    # --------------------------------------------------------

    explanation = []

    for index, value in enumerate(
        values
    ):

        feature_name = (
            clean_shap_feature_name(
                feature_names[index],
                transformed[0][index]
            )
        )

        # Skip inactive one-hot categorical features.
        if feature_name is None:

            continue

        explanation.append({

            "feature":
                feature_name,

            "raw_feature":
                feature_names[index],

            "contribution":
                round(
                    float(value),
                    6
                )

        })


    explanation_df = pd.DataFrame(
        explanation
    )


    # --------------------------------------------------------
    # 6. Positive SHAP signals
    # --------------------------------------------------------

    positive = (
        explanation_df[
            explanation_df[
                "contribution"
            ] > 0
        ]
        .sort_values(
            "contribution",
            ascending=False
        )
        .head(5)
    )


    # --------------------------------------------------------
    # 7. Negative SHAP signals
    # --------------------------------------------------------

    negative = (
        explanation_df[
            explanation_df[
                "contribution"
            ] < 0
        ]
        .sort_values(
            "contribution"
        )
        .head(5)
    )


    # --------------------------------------------------------
    # 8. Convert positive signals
    # --------------------------------------------------------

    positive_list = []

    for _, row in (
        positive.iterrows()
    ):

        positive_list.append({

            "feature":
                row["feature"],

            "contribution":
                float(
                    row["contribution"]
                )

        })


    # --------------------------------------------------------
    # 9. Convert negative signals
    # --------------------------------------------------------

    negative_list = []

    for _, row in (
        negative.iterrows()
    ):

        negative_list.append({

            "feature":
                row["feature"],

            "contribution":
                float(
                    row["contribution"]
                )

        })


    # --------------------------------------------------------
    # 10. Return explanation
    # --------------------------------------------------------

    return {

        "fraud_signals":
            positive_list,

        "protective_signals":
            negative_list,

        "note":
            (
                "SHAP contributions show how "
                "features influence the model "
                "output. They are not percentage "
                "point changes in fraud probability."
            )

    }


# ============================================================
# PREDICTION
# ============================================================

@app.post("/predict")
def predict_transaction(
    transaction: TransactionRequest
):

    features = (
        transaction.features
    )


    # --------------------------------------------------------
    # 1. Validate
    # --------------------------------------------------------

    validate_features(
        features
    )


    # --------------------------------------------------------
    # 2. Build DataFrame
    # --------------------------------------------------------

    transaction_df = pd.DataFrame(
        [features],
        columns=FEATURE_COLUMNS
    )


    # --------------------------------------------------------
    # 3. Numeric features
    # --------------------------------------------------------

    for feature in NUMERIC_FEATURES:

        transaction_df[
            feature
        ] = pd.to_numeric(
            transaction_df[
                feature
            ],
            errors="coerce"
        )


        if transaction_df[
            feature
        ].isna().any():

            if feature in MEDIANS:

                transaction_df[
                    feature
                ] = (
                    transaction_df[
                        feature
                    ]
                    .fillna(
                        MEDIANS[feature]
                    )
                )

            else:

                raise HTTPException(
                    status_code=422,
                    detail={
                        "error":
                            "Invalid numeric feature",

                        "feature":
                            feature
                    }
                )


    # --------------------------------------------------------
    # 4. Categorical features
    # --------------------------------------------------------

    for feature in CATEGORICAL_FEATURES:

        transaction_df[
            feature
        ] = (
            transaction_df[
                feature
            ]
            .astype(str)
        )


    # --------------------------------------------------------
    # 5. Model transformation
    # --------------------------------------------------------

    try:

        transformed = (
            preprocessor.transform(
                transaction_df
            )
        )

    except Exception as exc:

        raise HTTPException(
            status_code=422,
            detail={
                "error":
                    "Feature preprocessing failed",

                "message":
                    str(exc)
            }
        )


    # --------------------------------------------------------
    # 6. Prediction
    # --------------------------------------------------------

    try:

        probability = float(
            model.predict_proba(
                transformed
            )[0, 1]
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail={
                "error":
                    "Prediction failed",

                "message":
                    str(exc)
            }
        )


    # --------------------------------------------------------
    # 7. Risk
    # --------------------------------------------------------

    risk_level = (
        get_risk_level(
            probability
        )
    )

    action = (
        get_recommended_action(
            risk_level
        )
    )


    # --------------------------------------------------------
    # 8. SHAP
    # --------------------------------------------------------

    try:

        explanation = (
            build_shap_explanation(
                transaction_df
            )
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail={
                "error":
                    "SHAP explanation failed",

                "message":
                    str(exc)
            }
        )


    # --------------------------------------------------------
    # 9. Transaction summary
    # --------------------------------------------------------

    amount = float(
        transaction_df[
            "Amount"
        ].iloc[0]
    )

    hour = int(
        transaction_df[
            "transaction_hour"
        ].iloc[0]
    )

    mcc = str(
        transaction_df[
            "MCC"
        ].iloc[0]
    )

    transaction_direction = str(
        transaction_df[
            "amount_direction"
        ].iloc[0]
    )


    # --------------------------------------------------------
    # 10. Final response
    # --------------------------------------------------------

    return {

        "success":
            True,

        "model":
            "RiskGuard V4",

        "fraud_probability":
            round(
                probability,
                6
            ),

        "fraud_probability_percent":
            round(
                probability * 100,
                2
            ),

        "risk_level":
            risk_level,

        "recommended_action":
            action,

        "transaction_summary": {

            "amount":
                amount,

            "transaction_hour":
                hour,

            "mcc":
                mcc,

            "transaction_direction":
                transaction_direction,

            "feature_count":
                EXPECTED_FEATURE_COUNT

        },

        "explanation":
            explanation

    }


# ============================================================
# STARTUP
# ============================================================

@app.on_event(
    "startup"
)
def startup_event():

    print()
    print("=" * 70)
    print("RiskGuard V4 API started")

    print(
        f"Model: {type(model).__name__}"
    )

    print(
        f"Input features: {EXPECTED_FEATURE_COUNT}"
    )

    print(
        f"Encoded features: {len(ENCODED_FEATURE_NAMES)}"
    )

    print("SHAP: ENABLED")
    print("=" * 70)
    print()