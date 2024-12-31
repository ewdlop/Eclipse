import pandas as pd

# Load the data from a CSV file
df = pd.read_csv('hormone_levels.csv')

# Display the first few rows of the dataframe
print(df.head())

# Basic statistics
mean_level = df['hormone_level'].mean()
median_level = df['hormone_level'].median()
std_dev_level = df['hormone_level'].std()
max_level = df['hormone_level'].max()
min_level = df['hormone_level'].min()

print(f"Mean Hormone Level: {mean_level}")
print(f"Median Hormone Level: {median_level}")
print(f"Standard Deviation: {std_dev_level}")
print(f"Max Hormone Level: {max_level}")
print(f"Min Hormone Level: {min_level}")



# Interpretation
if p_value < 0.05:
    print("The difference between the groups is statistically significant.")
else:
    print("The difference between the groups is not statistically significant.")

# Additional statistics
variance_level = df['hormone_level'].var()
quantiles = df['hormone_level'].quantile([0.25, 0.5, 0.75])

print(f"Variance: {variance_level}")
print(f"Quantiles: \n{quantiles}")

from scipy.stats import ttest_ind

# Assuming you have two groups A and B
group_a = df[df['group'] == 'A']['hormone_level']
group_b = df[df['group'] == 'B']['hormone_level']

# Perform t-test
t_stat, p_value = ttest_ind(group_a, group_b)
print(f"T-statistic: {t_stat}, P-value: {p_value}")

from statsmodels.tsa.seasonal import seasonal_decompose

# Convert 'date' column to datetime
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)

# Decompose the time series
result = seasonal_decompose(df['hormone_level'], model='additive', period=30)
result.plot()
plt.show()

from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# Autocorrelation plot
plt.figure(figsize=(10, 6))
plot_acf(df['hormone_level'], lags=30)
plt.show()

# Partial Autocorrelation plot
plt.figure(figsize=(10, 6))
plot_pacf(df['hormone_level'], lags=30)
plt.show()

from statsmodels.tsa.arima.model import ARIMA

# Fit ARIMA model
model = ARIMA(df['hormone_level'], order=(5, 1, 0))
model_fit = model.fit()

# Summary of the model
print(model_fit.summary())

# Forecasting
forecast = model_fit.forecast(steps=10)
print(forecast)

import seaborn as sns
import matplotlib.pyplot as plt

# Histogram of hormone levels
plt.figure(figsize=(10, 6))
sns.histplot(df['hormone_level'], bins=10, kde=True)
plt.xlabel('Hormone Level')
plt.ylabel('Frequency')
plt.title('Distribution of Hormone Levels')
plt.show()

# Boxplot of hormone levels
plt.figure(figsize=(10, 6))
sns.boxplot(x=df['hormone_level'])
plt.xlabel('Hormone Level')
plt.title('Boxplot of Hormone Levels')
plt.show()

# Correlation heatmap
plt.figure(figsize=(10, 6))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm', vmin=-1, vmax=1)
plt.title('Correlation Heatmap')
plt.show()

