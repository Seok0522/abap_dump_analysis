
import pandas as pd

try:
    df = pd.read_excel(".idx/resource/abap dump.xlsx")
    print(df.columns.tolist())
    print(df.head(1).to_string())
except Exception as e:
    print(e)
