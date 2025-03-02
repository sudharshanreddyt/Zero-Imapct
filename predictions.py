import math
import pickle
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import warnings

with warnings.catch_warnings():
    warnings.simplefilter("ignore")


def load_model(model_path="multi_output_regressor.pkl"):
    with open(model_path, "rb") as file:
        model = pickle.load(file)
    return model


def data(
    diet_file="Personalized_Diet_Recommendations.csv", 
    nutrients_file="nutrients_csvfile.csv"
):
    diet_df = pd.read_csv(diet_file)
    nutrients_df = pd.read_csv(nutrients_file)

    diet_df.columns = diet_df.columns.str.strip().str.lower().str.replace(" ", "_")
    nutrients_df.columns = (
        nutrients_df.columns.str.strip().str.lower().str.replace(" ", "_")
    )

    diet_df.fillna(
        {"chronic_disease": "None", "allergies": "None", "food_aversions": "None"},
        inplace=True,
    )

    label_encoders = {}

    for col in diet_df.select_dtypes(include=["object"]).columns:
        if col not in ["patient_id"]:
            le = LabelEncoder()
            sorted_classes = sorted(diet_df[col].unique())
            le.fit(sorted_classes)
            diet_df[col] = le.transform(diet_df[col])
            label_encoders[col] = le

    nutrients_df.replace("t", 0, inplace=True)
    nutrients_df["protein"] = pd.to_numeric(nutrients_df["protein"], errors="coerce")
    nutrients_df["fat"] = pd.to_numeric(nutrients_df["fat"], errors="coerce")
    nutrients_df["carbs"] = pd.to_numeric(nutrients_df["carbs"], errors="coerce")
    nutrients_df["calories"] = pd.to_numeric(nutrients_df["calories"], errors="coerce")
    nutrients_df.fillna(0, inplace=True)

    return diet_df, nutrients_df, label_encoders


def predict_for_patient(patient_id, diet_df, model, features):
    patient_data = diet_df[diet_df["patient_id"] == patient_id].iloc[0].to_dict()
    if not patient_data:
        return {"error": "Patient ID not found."}

    patient_features = {col: patient_data[col] for col in features}
    new_data = pd.DataFrame([patient_features])

    for col in new_data.columns:
        if col in label_encoders:
            new_data[col] = new_data[col].apply(
                lambda x: (
                    label_encoders[col].transform([x])[0]
                    if x in label_encoders[col].classes_
                    else label_encoders[col].transform([label_encoders[col].classes_[0]])[0]
                )
            )

    predicted_continuous = model.predict(new_data)

    if "recommended_meal_plan" in label_encoders:
        meal_plan = math.floor(predicted_continuous[0][4])
        predicted_categorical = label_encoders["recommended_meal_plan"].inverse_transform([meal_plan])[0]

    predictions = {
        "calories": predicted_continuous[0][0],
        "protein": predicted_continuous[0][1],
        "carbs": predicted_continuous[0][2],
        "fat": predicted_continuous[0][3],
        "recommended_meal_plan": predicted_categorical,
    }

    return predictions


def generate_meal_plans(nutrients_df, recommended_values):
    meal_plans = {}

    meal_targets = {
        "Breakfast": {
            "calories": recommended_values["calories"] * 0.3,
            "protein": recommended_values["protein"] * 0.3,
            "carbs": recommended_values["carbs"] * 0.3,
            "fat": recommended_values["fat"] * 0.3,
        },
        "Lunch": {
            "calories": recommended_values["calories"] * 0.4,
            "protein": recommended_values["protein"] * 0.4,
            "carbs": recommended_values["carbs"] * 0.4,
            "fat": recommended_values["fat"] * 0.4,
        },
        "Dinner": {
            "calories": recommended_values["calories"] * 0.3,
            "protein": recommended_values["protein"] * 0.3,
            "carbs": recommended_values["carbs"] * 0.3,
            "fat": recommended_values["fat"] * 0.3,
        },
    }

    meal_categories = {
        "Breakfast": [
            "Dairy products",
            "Breads, cereals, grains",
            "Fruits A-F",
            "Fruits G-P",
            "Fruits R-Z",
            "Seeds and Nuts",
            "Jams",
            "Jellies",
        ],
        "Lunch": [
            "Soups",
            "Meat",
            "Poultry",
            "Vegetables A-E",
            "Vegetables F-P",
            "Vegetables R-Z",
            "Breads, cereals, fastfood, grains",
        ],
        "Dinner": [
            "Soups",
            "Fish",
            "Seafood",
            "Vegetables A-E",
            "Vegetables F-P",
            "Vegetables R-Z",
            "Breads, cereals, fastfood, grains",
            "Desserts",
        ],
    }

    for meal, targets in meal_targets.items():
        meal_foods = nutrients_df[nutrients_df["category"].isin(meal_categories[meal])]

        meal_plan = []
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0

        meal_foods = meal_foods.sort_values(by="calories", ascending=False)

        for _, row in meal_foods.iterrows():
            if (
                total_calories + row["calories"] <= targets["calories"]
                and total_protein + row["protein"] <= targets["protein"]
                and total_carbs + row["carbs"] <= targets["carbs"]
                and total_fat + row["fat"] <= targets["fat"]
            ):
                meal_plan.append(row)

                total_calories += row["calories"]
                total_protein += row["protein"]
                total_carbs += row["carbs"]
                total_fat += row["fat"]

        meal_plans[meal] = {
            "foods": meal_plan,
            "totals": {
                "calories": total_calories,
                "protein": total_protein,
                "carbs": total_carbs,
                "fat": total_fat,
            },
        }

    return meal_plans


def get_recommendations(
    patient_id,
    model_path="multi_output_regressor.pkl",
    diet_file="Personalized_Diet_Recommendations.csv",
    nutrients_file="nutrients_csvfile.csv",
):
    model = load_model(model_path)

    diet_df, nutrients_df, _ = data(diet_file, nutrients_file)

    cols_to_drop = [
        "patient_id",
        "dietary_habits",
        "preferred_cuisine",
        "food_aversions",
        "recommended_meal_plan",
        "recommended_calories",
        "recommended_protein",
        "recommended_carbs",
        "recommended_fats",
    ]

    features = [col for col in diet_df.columns if col not in cols_to_drop]

    predictions = predict_for_patient(patient_id, diet_df, model, features)

    meal_plans = generate_meal_plans(nutrients_df, predictions)

    return {"predictions": predictions, "meal_plans": meal_plans}