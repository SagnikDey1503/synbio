import pandas as pd
import plotly.graph_objects as go

# Complete dataset with normalized metrics
data = [
    {"Platform": "Render.com", "Setup": 9, "Perf": 8, "Contest": 9, "Storage_GB": 0, "BW_GB": 100},
    {"Platform": "Vercel", "Setup": 10, "Perf": 10, "Contest": 7, "Storage_GB": 0, "BW_GB": 100},
    {"Platform": "Railway", "Setup": 8, "Perf": 8, "Contest": 8, "Storage_GB": 1, "BW_GB": 1},
    {"Platform": "Fly.io", "Setup": 6, "Perf": 9, "Contest": 8, "Storage_GB": 1, "BW_GB": 160},
    {"Platform": "Glitch", "Setup": 10, "Perf": 5, "Contest": 5, "Storage_GB": 0.2, "BW_GB": 0}
]

df = pd.DataFrame(data)

# Normalize storage and bandwidth to 0-10 scale for visual comparison
df["Storage"] = (df["Storage_GB"] * 10).round(1)  # Scale up storage for visibility
df["Bandwidth"] = (df["BW_GB"] / 16).round(1)     # Scale bandwidth (160GB max = 10)

# Create comparison chart with 5 distinct metrics
fig = go.Figure()

# Define metrics with distinct colors from the brand palette
metrics = [
    ("Setup", "#1FB8CD"),      # Strong cyan
    ("Perf", "#FFC185"),       # Light orange  
    ("Contest", "#5D878F"),    # Cyan (different from first)
    ("Storage", "#D2BA4C"),    # Moderate yellow
    ("Bandwidth", "#B4413C")   # Moderate red
]

# Add bars for each metric
for metric, color in metrics:
    fig.add_trace(go.Bar(
        name=metric,
        y=df["Platform"],
        x=df[metric],
        orientation="h",
        marker_color=color,
        cliponaxis=False,
        hovertemplate=f"<b>%{{y}}</b><br>{metric}: %{{x}}<extra></extra>"
    ))

# Update layout
fig.update_layout(
    title="Platform Feature Scores",
    barmode="group",
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.05,
        xanchor="center",
        x=0.5
    )
)

fig.update_xaxes(title="Score (0-10)")
fig.update_yaxes(title="Platform")

# Save the chart
fig.write_image("platform_features.png")