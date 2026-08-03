import pandas as pd
import numpy as np
import os

def generate_house_prices(output_dir):
    np.random.seed(42)
    n_samples = 1000
    df = pd.DataFrame({
        'OverallQual': np.random.randint(1, 10, n_samples),
        'GrLivArea': np.random.normal(1500, 500, n_samples).astype(int),
        'GarageCars': np.random.randint(0, 4, n_samples),
        'TotalBsmtSF': np.random.normal(1000, 300, n_samples).astype(int),
        '1stFlrSF': np.random.normal(1100, 300, n_samples).astype(int),
        'Neighborhood': np.random.choice(['CollgCr', 'Veenker', 'Crawfor', 'NoRidge', 'Mitchel'], n_samples)
    })
    
    # Simple linear relationship + noise
    df['SalePrice'] = (
        df['OverallQual'] * 15000 +
        df['GrLivArea'] * 55 +
        df['GarageCars'] * 10000 +
        df['TotalBsmtSF'] * 30 +
        np.random.normal(0, 10000, n_samples)
    )
    df['SalePrice'] = df['SalePrice'].clip(lower=50000)
    
    os.makedirs(output_dir, exist_ok=True)
    df.to_csv(os.path.join(output_dir, 'demo-house.csv'), index=False)
    print(" demo-house.csv generated.")

def generate_customer_churn(output_dir):
    np.random.seed(123)
    n_samples = 1500
    df = pd.DataFrame({
        'TenureMonths': np.random.randint(1, 72, n_samples),
        'MonthlyCharges': np.random.uniform(20.0, 120.0, n_samples),
        'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n_samples),
        'TechSupport': np.random.choice(['Yes', 'No', 'No internet service'], n_samples),
        'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n_samples)
    })
    
    # 0 = No Churn, 1 = Churn
    # Churn logic: High for short tenure + month-to-month.
    prob_churn = np.zeros(n_samples)
    prob_churn += np.where(df['Contract'] == 'Month-to-month', 0.4, 0.05)
    prob_churn -= df['TenureMonths'] * 0.005
    prob_churn += np.where(df['InternetService'] == 'Fiber optic', 0.1, 0)
    prob_churn += np.where(df['TechSupport'] == 'No', 0.1, -0.1)
    
    prob_churn = np.clip(prob_churn, 0.01, 0.99)
    df['Target'] = np.random.binomial(1, prob_churn)
    
    df.to_csv(os.path.join(output_dir, 'demo-churn.csv'), index=False)
    print(" demo-churn.csv generated.")

def generate_hr_attrition(output_dir):
    np.random.seed(999)
    n_samples = 1200
    df = pd.DataFrame({
        'Age': np.random.randint(22, 60, n_samples),
        'MonthlyIncome': np.random.normal(5000, 2500, n_samples).astype(int),
        'OverTime': np.random.choice(['Yes', 'No'], n_samples),
        'JobSatisfaction': np.random.randint(1, 5, n_samples),
        'EnvironmentSatisfaction': np.random.randint(1, 5, n_samples),
        'Department': np.random.choice(['Sales', 'Research & Development', 'Human Resources'], n_samples)
    })
    
    df['MonthlyIncome'] = df['MonthlyIncome'].clip(lower=2000)
    
    prob_attrition = np.zeros(n_samples)
    prob_attrition += np.where(df['OverTime'] == 'Yes', 0.25, 0.05)
    prob_attrition -= df['Age'] * 0.005
    prob_attrition += np.where(df['JobSatisfaction'] <= 2, 0.2, -0.05)
    prob_attrition -= df['MonthlyIncome'] * 0.00001
    
    prob_attrition = np.clip(prob_attrition, 0.01, 0.99)
    df['Target'] = np.random.binomial(1, prob_attrition)
    
    df.to_csv(os.path.join(output_dir, 'demo-attrition.csv'), index=False)
    print(" demo-attrition.csv generated.")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    generate_house_prices(current_dir)
    generate_customer_churn(current_dir)
    generate_hr_attrition(current_dir)
    print("All datasets successfully generated!")
    
