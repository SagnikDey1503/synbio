import plotly.graph_objects as go
import plotly.express as px
import json
import pandas as pd
import numpy as np

# Data for the security flow
data = [
  {
    "step": 1,
    "component": "User Login",
    "action": "Sends credentials",
    "security": "Rate limited",
    "next": ["Backend Auth"]
  },
  {
    "step": 2,
    "component": "Backend Auth",
    "action": "Validates credentials",
    "security": "BCrypt verification",
    "next": ["JWT Generation"]
  },
  {
    "step": 3,
    "component": "JWT Generation",
    "action": "Creates secure token",
    "security": "Strong secret key",
    "next": ["Frontend Storage"]
  },
  {
    "step": 4,
    "component": "Frontend Storage",
    "action": "Stores JWT token",
    "security": "Local storage",
    "next": ["Answer Submission"]
  },
  {
    "step": 5,
    "component": "Answer Submission",
    "action": "Sends answer with JWT",
    "security": "Token validation",
    "next": ["Server Validation"]
  },
  {
    "step": 6,
    "component": "Server Validation",
    "action": "Checks answer server-side",
    "security": "Hidden answer key",
    "next": ["Database Update"]
  },
  {
    "step": 7,
    "component": "Database Update",
    "action": "Updates score and attempts",
    "security": "Atomic operations",
    "next": ["Socket Broadcast"]
  },
  {
    "step": 8,
    "component": "Socket Broadcast",
    "action": "Real-time leaderboard update",
    "security": "Authenticated sockets",
    "next": ["Frontend Update"]
  },
  {
    "step": 9,
    "component": "Frontend Update",
    "action": "Updates UI in real-time",
    "security": "No answer exposure",
    "next": []
  }
]

# Create positions for components in a logical flow
positions = {
    "User Login": (0, 3),
    "Backend Auth": (2, 3),
    "JWT Generation": (4, 3),
    "Frontend Storage": (6, 3),
    "Answer Submission": (8, 3),
    "Server Validation": (10, 3),
    "Database Update": (12, 3),
    "Socket Broadcast": (12, 1),
    "Frontend Update": (10, 1)
}

# Abbreviate component names to fit 15 char limit
name_mapping = {
    "User Login": "User Login",
    "Backend Auth": "Backend Auth",
    "JWT Generation": "JWT Gen",
    "Frontend Storage": "Frontend Store",
    "Answer Submission": "Answer Submit",
    "Server Validation": "Server Valid",
    "Database Update": "DB Update",
    "Socket Broadcast": "Socket Cast",
    "Frontend Update": "Frontend Upd"
}

# Create component categories for coloring
categories = {
    "User Login": "Frontend",
    "Backend Auth": "Backend",
    "JWT Generation": "Backend", 
    "Frontend Storage": "Frontend",
    "Answer Submission": "Frontend",
    "Server Validation": "Backend",
    "Database Update": "Database",
    "Socket Broadcast": "Real-time",
    "Frontend Update": "Frontend"
}

color_map = {
    "Frontend": "#1FB8CD",
    "Backend": "#FFC185", 
    "Database": "#ECEBD5",
    "Real-time": "#5D878F"
}

# Prepare data for plotting
df_components = []
for item in data:
    comp = item["component"]
    x, y = positions[comp]
    # Abbreviate action and security to fit hover limits
    action_short = item["action"][:15] if len(item["action"]) <= 15 else item["action"][:12] + "..."
    security_short = item["security"][:15] if len(item["security"]) <= 15 else item["security"][:12] + "..."
    
    df_components.append({
        "component": name_mapping[comp],
        "x": x,
        "y": y,
        "step": item["step"],
        "action": action_short,
        "security": security_short,
        "category": categories[comp],
        "color": color_map[categories[comp]]
    })

df = pd.DataFrame(df_components)

# Create the figure
fig = go.Figure()

# Add nodes for each category
for category in color_map.keys():
    category_data = df[df['category'] == category]
    fig.add_trace(go.Scatter(
        x=category_data['x'],
        y=category_data['y'],
        mode='markers+text',
        marker=dict(
            size=40,
            color=color_map[category],
            line=dict(width=2, color='white')
        ),
        text=category_data['component'],
        textposition='middle center',
        textfont=dict(size=8, color='black'),
        hovertemplate='<b>%{text}</b><br>Action: %{customdata[0]}<br>Security: %{customdata[1]}<extra></extra>',
        customdata=category_data[['action', 'security']].values,
        name=category,
        cliponaxis=False
    ))

# Add flow arrows using line shapes
arrow_shapes = []
for item in data:
    comp = item["component"]
    start_x, start_y = positions[comp]
    
    for next_comp in item["next"]:
        end_x, end_y = positions[next_comp]
        
        # Calculate arrow direction
        dx = end_x - start_x
        dy = end_y - start_y
        
        # Adjust start and end points to not overlap with nodes
        if dx != 0:
            start_x_adj = start_x + (0.8 if dx > 0 else -0.8)
            end_x_adj = end_x - (0.8 if dx > 0 else -0.8)
        else:
            start_x_adj = start_x
            end_x_adj = end_x
            
        if dy != 0:
            start_y_adj = start_y + (0.3 if dy > 0 else -0.3)
            end_y_adj = end_y - (0.3 if dy > 0 else -0.3)
        else:
            start_y_adj = start_y
            end_y_adj = end_y
        
        # Add arrow line
        arrow_shapes.append(dict(
            type="line",
            x0=start_x_adj, y0=start_y_adj,
            x1=end_x_adj, y1=end_y_adj,
            line=dict(color="#13343B", width=2),
            xref="x", yref="y"
        ))

# Update layout
fig.update_layout(
    title="Contest Portal Security Flow",
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    shapes=arrow_shapes,
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-1, 14]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[0, 4]
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)'
)

# Save the chart
fig.write_image("contest_portal_security_flow.png")