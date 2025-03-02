import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
import warnings

with warnings.catch_warnings():
    warnings.simplefilter("ignore")


def data(diet_file='Personalized_Diet_Recommendations', nutrients_file='nutrients_csvfile'):
    diet_df = pd.read_csv(f"./{diet_file}.csv")
    nutrients_df = pd.read_csv(f"./{nutrients_file}.csv")

    diet_df.columns = diet_df.columns.str.strip().str.lower().str.replace(" ", "_")
    nutrients_df.columns = nutrients_df.columns.str.strip().str.lower().str.replace(" ", "_")

    diet_df.fillna({"chronic_disease": "None", "allergies": "None", "food_aversions": "None"}, inplace=True)

    label_encoders = {}

    for col in diet_df.select_dtypes(include=['object']).columns:
        if col not in ["patient_id"]:
            le = LabelEncoder()
            sorted_classes = sorted(diet_df[col].unique())
            le.fit(sorted_classes)
            diet_df[col] = le.transform(diet_df[col])
            label_encoders[col] = le

    nutrients_df.replace('t', 0, inplace=True)

    nutrients_df['protein'] = pd.to_numeric(
        nutrients_df['protein'], errors='coerce')
 
    nutrients_df['fat'] = pd.to_numeric(
        nutrients_df['fat'], errors='coerce')
   
    nutrients_df['carbs'] = pd.to_numeric(
        nutrients_df['carbs'], errors='coerce')
    
    nutrients_df['calories'] = pd.to_numeric(
        nutrients_df['calories'], errors='coerce')
    nutrients_df.fillna(0, inplace=True)

    return diet_df, nutrients_df, label_encoders


def model(diet_df, label_encoders):
    cols_to_drop = ["patient_id", "dietary_habits", "preferred_cuisine", "food_aversions", "recommended_meal_plan", "recommended_calories", "recommended_protein", "recommended_carbs", "recommended_fats"]
    features = [col for col in diet_df.columns if col not in cols_to_drop]
    
    X = diet_df.drop(columns=cols_to_drop)
    y = diet_df[["recommended_calories", "recommended_protein", "recommended_carbs", "recommended_fats", "recommended_meal_plan"]]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.001, random_state=14)

    multi_output_regressor = MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=14))
    multi_output_regressor.fit(X_train, y_train)

    with open('multi_output_regressor.pkl', 'wb') as file:
        pickle.dump(multi_output_regressor, file)

    print("Model saved to multi_output_regressor.pkl")
    return multi_output_regressor, features



diet_df, nutrients_df, label_encoders = data()
multi_output_regressor, features = model(diet_df, label_encoders)